export interface FuzzerConfig {
  numTests: number;
  maxArrayLength: number;
  minValue: number;
  maxValue: number;
}

const DEFAULT_CONFIG: FuzzerConfig = {
  numTests: 1000,
  maxArrayLength: 20,
  minValue: -100,
  maxValue: 100
};

export function generateTestCases(config: Partial<FuzzerConfig> = {}): number[][] {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };
  const testCases: number[][] = [];

  // Edge cases (always included)
  testCases.push(
    [],                                    // Empty array
    [0],                                   // Single zero
    [1],                                   // Single positive
    [-1],                                  // Single negative
    [0, 0],                                // All zeros
    [1, 1, 1],                             // All same
    [-1, -2, -3],                          // All negative
    [1, 2, 3, 4, 5],                       // Increasing
    [5, 4, 3, 2, 1],                       // Decreasing
    [1, 3, 2, 5, 4],                       // Random order
  );

  // Generate random arrays
  const randomTests = Math.max(0, fullConfig.numTests - testCases.length);
  for (let i = 0; i < randomTests; i++) {
    const strategy = i % 5;

    switch (strategy) {
      case 0:
        // Completely random
        testCases.push(generateRandomArray(fullConfig));
        break;
      case 1:
        // Small arrays
        testCases.push(generateRandomArray({ ...fullConfig, maxArrayLength: 5 }));
        break;
      case 2:
        // Arrays with patterns
        testCases.push(generatePatternArray(fullConfig));
        break;
      case 3:
        // Arrays with duplicates
        testCases.push(generateArrayWithDuplicates(fullConfig));
        break;
      case 4:
        // Boundary values
        testCases.push(generateBoundaryArray(fullConfig));
        break;
    }
  }

  return testCases;
}

function generateRandomArray(config: FuzzerConfig): number[] {
  const length = Math.floor(Math.random() * (config.maxArrayLength + 1));
  const arr: number[] = [];

  for (let i = 0; i < length; i++) {
    const value = Math.floor(
      Math.random() * (config.maxValue - config.minValue + 1) + config.minValue
    );
    arr.push(value);
  }

  return arr;
}

function generatePatternArray(config: FuzzerConfig): number[] {
  const length = Math.floor(Math.random() * config.maxArrayLength) + 1;
  const patterns = [
    // Arithmetic progression
    () => {
      const start = randomInt(config.minValue, config.maxValue / 2);
      const step = randomInt(1, 5);
      return Array.from({ length }, (_, i) => start + i * step);
    },
    // Geometric progression
    () => {
      const start = randomInt(1, 10);
      const ratio = randomInt(2, 3);
      return Array.from({ length: Math.min(length, 8) }, (_, i) => start * Math.pow(ratio, i));
    },
    // Alternating odd/even
    () => {
      const startOdd = Math.random() > 0.5;
      return Array.from({ length }, (_, i) => {
        const shouldBeOdd = startOdd ? i % 2 === 0 : i % 2 === 1;
        const base = randomInt(0, config.maxValue / 2);
        return shouldBeOdd ? base * 2 + 1 : base * 2;
      });
    },
    // All even or all odd
    () => {
      const allEven = Math.random() > 0.5;
      return Array.from({ length }, () => {
        const base = randomInt(config.minValue / 2, config.maxValue / 2);
        return allEven ? base * 2 : base * 2 + 1;
      });
    }
  ];

  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  return pattern();
}

function generateArrayWithDuplicates(config: FuzzerConfig): number[] {
  const length = Math.floor(Math.random() * config.maxArrayLength) + 1;
  const uniqueValues = Math.max(1, Math.floor(length / 2));
  const values = Array.from(
    { length: uniqueValues },
    () => randomInt(config.minValue, config.maxValue)
  );

  const arr: number[] = [];
  for (let i = 0; i < length; i++) {
    arr.push(values[Math.floor(Math.random() * values.length)]);
  }

  return arr;
}

function generateBoundaryArray(config: FuzzerConfig): number[] {
  const length = Math.floor(Math.random() * config.maxArrayLength) + 1;
  const arr: number[] = [];

  for (let i = 0; i < length; i++) {
    const choice = Math.random();
    if (choice < 0.33) {
      arr.push(config.minValue);
    } else if (choice < 0.66) {
      arr.push(config.maxValue);
    } else {
      arr.push(0);
    }
  }

  return arr;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
