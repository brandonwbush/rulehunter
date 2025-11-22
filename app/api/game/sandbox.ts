import ivm from 'isolated-vm';
import { transformSync } from 'esbuild';

export interface SandboxResult {
  success: boolean;
  result?: boolean;
  error?: string;
}

const TIMEOUT_MS = 100;
const MEMORY_LIMIT_MB = 128;

function transpileTypeScript(code: string): string {
  try {
    const result = transformSync(code, {
      loader: 'ts',
      target: 'es2020',
    });
    return result.code;
  } catch (error) {
    throw new Error(`TypeScript compilation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function executeSandboxed(code: string, testArray: number[]): Promise<SandboxResult> {
  let isolate: ivm.Isolate | null = null;

  try {
    // Transpile TypeScript to JavaScript
    const jsCode = transpileTypeScript(code);

    // Validate the code doesn't contain dangerous patterns
    if (containsDangerousCode(jsCode)) {
      return {
        success: false,
        error: 'Code contains potentially dangerous patterns'
      };
    }

    // Create isolated VM with memory limit
    isolate = new ivm.Isolate({ memoryLimit: MEMORY_LIMIT_MB });
    const context = await isolate.createContext();

    // Extract function name from code using regex (try both original and transpiled)
    let functionMatch = code.match(/function\s+(\w+)\s*\(/);
    if (!functionMatch) {
      functionMatch = jsCode.match(/function\s+(\w+)\s*\(/);
    }
    const functionName = functionMatch ? functionMatch[1] : null;

    if (!functionName) {
      return {
        success: false,
        error: 'No function was defined. Please define a function.'
      };
    }

    // Wrap the user's code to extract the function by name
    const wrappedCode = `
      'use strict';
      ${jsCode}
      ${functionName};
    `;

    // Compile and run the code to get the function
    const script = await isolate.compileScript(wrappedCode);
    const ruleFunction = await script.run(context, { timeout: TIMEOUT_MS });

    // Transfer the test array to the isolate
    const testArrayRef = new ivm.ExternalCopy(testArray).copyInto({ release: true });

    // Execute the function with the test array
    const resultRef = await ruleFunction.apply(undefined, [testArrayRef], { timeout: TIMEOUT_MS, result: { copy: true } });

    // resultRef is already copied when using result: { copy: true }
    const result = resultRef;

    if (typeof result !== 'boolean') {
      return {
        success: false,
        error: `Function must return a boolean, got ${typeof result}`
      };
    }

    return {
      success: true,
      result
    };
  } catch (error) {
    if (error instanceof Error) {
      // Check for specific error types
      if (error.message.includes('Script execution timed out')) {
        return {
          success: false,
          error: 'Execution timeout: your code took too long to execute'
        };
      }
      if (error.message.includes('memory limit')) {
        return {
          success: false,
          error: 'Memory limit exceeded: your code used too much memory'
        };
      }
      return {
        success: false,
        error: error.message
      };
    }
    return {
      success: false,
      error: 'Unknown error occurred'
    };
  } finally {
    // Clean up the isolate
    if (isolate) {
      isolate.dispose();
    }
  }
}

function containsDangerousCode(code: string): boolean {
  const dangerousPatterns = [
    /require\s*\(/,
    /import\s+/,
    /eval\s*\(/,
    /Function\s*\(/,
    /setTimeout/,
    /setInterval/,
    /fetch\s*\(/,
    /XMLHttpRequest/,
    /process\./,
    /global\./,
    /globalThis\./,
  ];

  return dangerousPatterns.some(pattern => pattern.test(code));
}
