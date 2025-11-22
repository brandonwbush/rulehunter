import { describe, it, expect } from 'vitest';
import { executeSandboxed } from '@/core/game/sandbox';

describe('executeSandboxed', () => {
  describe('basic functionality', () => {
    it('should execute simple function returning true', async () => {
      const code = `function test(arr) { return true; }`;
      const result = await executeSandboxed(code, [1, 2, 3]);
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);
    });

    it('should execute simple function returning false', async () => {
      const code = `function test(arr) { return false; }`;
      const result = await executeSandboxed(code, [1, 2, 3]);
      expect(result.success).toBe(true);
      expect(result.result).toBe(false);
    });

    it('should accept any function name', async () => {
      const code = `function myCustomName(arr) { return arr.length > 0; }`;
      const result = await executeSandboxed(code, [1, 2, 3]);
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);
    });

    it('should handle TypeScript syntax', async () => {
      const code = `function test(arr: number[]): boolean { return arr.length > 0; }`;
      const result = await executeSandboxed(code, [1, 2, 3]);
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);
    });
  });

  describe('array operations', () => {
    it('should handle array.every()', async () => {
      const code = `function test(arr) { return arr.every(n => n > 0); }`;
      const result = await executeSandboxed(code, [1, 2, 3]);
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);
    });

    it('should handle array.some()', async () => {
      const code = `function test(arr) { return arr.some(n => n > 5); }`;
      const result = await executeSandboxed(code, [1, 2, 6]);
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);
    });

    it('should handle array.filter()', async () => {
      const code = `function test(arr) { return arr.filter(n => n > 2).length === 1; }`;
      const result = await executeSandboxed(code, [1, 2, 3]);
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);
    });

    it('should handle array.map()', async () => {
      const code = `function test(arr) { return arr.map(n => n * 2)[0] === 2; }`;
      const result = await executeSandboxed(code, [1, 2, 3]);
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);
    });

    it('should handle array.reduce()', async () => {
      const code = `function test(arr) { return arr.reduce((a, b) => a + b, 0) === 6; }`;
      const result = await executeSandboxed(code, [1, 2, 3]);
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty array', async () => {
      const code = `function test(arr) { return arr.length === 0; }`;
      const result = await executeSandboxed(code, []);
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);
    });

    it('should handle single element array', async () => {
      const code = `function test(arr) { return arr.length === 1; }`;
      const result = await executeSandboxed(code, [42]);
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);
    });

    it('should handle negative numbers', async () => {
      const code = `function test(arr) { return arr.every(n => n < 0); }`;
      const result = await executeSandboxed(code, [-1, -2, -3]);
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);
    });

    it('should handle large numbers', async () => {
      const code = `function test(arr) { return arr[0] > 1000000; }`;
      const result = await executeSandboxed(code, [1000001]);
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should fail on syntax error', async () => {
      const code = `function test(arr) { return arr.length `;
      const result = await executeSandboxed(code, [1, 2, 3]);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should fail on runtime error', async () => {
      const code = `function test(arr) { throw new Error('test error'); }`;
      const result = await executeSandboxed(code, [1, 2, 3]);
      expect(result.success).toBe(false);
      expect(result.error).toContain('test error');
    });

    it('should fail when no function is defined', async () => {
      const code = `const x = 5;`;
      const result = await executeSandboxed(code, [1, 2, 3]);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('security', () => {
    it('should not have access to process', async () => {
      const code = `function test(arr) { return typeof process === 'undefined'; }`;
      const result = await executeSandboxed(code, [1, 2, 3]);
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);
    });

    it('should not have access to require', async () => {
      const code = `function test(arr) { return typeof require === 'undefined'; }`;
      const result = await executeSandboxed(code, [1, 2, 3]);
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);
    });

    it('should not have access to global', async () => {
      const code = `function test(arr) { return typeof global === 'undefined'; }`;
      const result = await executeSandboxed(code, [1, 2, 3]);
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);
    });
  });

  describe('complex logic', () => {
    it('should handle nested conditions', async () => {
      const code = `
        function test(arr) {
          if (arr.length === 0) return false;
          if (arr.length === 1) return arr[0] > 0;
          return arr[0] + arr[1] > 5;
        }
      `;
      const result = await executeSandboxed(code, [3, 4]);
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);
    });

    it('should handle multiple variables', async () => {
      const code = `
        function test(arr) {
          const sum = arr.reduce((a, b) => a + b, 0);
          const avg = sum / arr.length;
          const hasPositive = arr.some(n => n > 0);
          return hasPositive && avg > 1;
        }
      `;
      const result = await executeSandboxed(code, [1, 2, 3]);
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);
    });

    it('should handle helper functions', async () => {
      const code = `
        function test(arr) {
          function isEven(n) { return n % 2 === 0; }
          return arr.every(isEven);
        }
      `;
      const result = await executeSandboxed(code, [2, 4, 6]);
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);
    });
  });
});
