// Types
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface MysteryRule {
  name: string
  difficulty: Difficulty
  description: string
  fn: (arr: number[]) => boolean
  exampleArrays: number[][]
  hint: string
}

// Helper functions
function isPrime(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

function isFibonacci(arr: number[]): boolean {
  if (arr.length === 0) return true;
  if (arr.length === 1) return true;
  if (arr.length === 2) return arr[0] + arr[1] >= 0;

  for (let i = 2; i < arr.length; i++) {
    if (arr[i] !== arr[i - 1] + arr[i - 2]) {
      return false;
    }
  }
  return true;
}

function isArithmeticProgression(arr: number[]): boolean {
  if (arr.length <= 2) return true;
  const diff = arr[1] - arr[0];
  for (let i = 2; i < arr.length; i++) {
    if (arr[i] - arr[i - 1] !== diff) {
      return false;
    }
  }
  return true;
}

function isGeometricProgression(arr: number[]): boolean {
  if (arr.length <= 2) return true;
  if (arr[0] === 0) return false;
  const ratio = arr[1] / arr[0];
  for (let i = 2; i < arr.length; i++) {
    if (arr[i - 1] === 0 || arr[i] / arr[i - 1] !== ratio) {
      return false;
    }
  }
  return true;
}

// Easy Rules (20)
const easyRules: MysteryRule[] = [
  {
    name: 'strictly-increasing',
    difficulty: 'easy',
    description: 'Array must be strictly increasing',
    fn: (arr) => arr.every((n, i) => i === 0 || n > arr[i - 1]),
    exampleArrays: [[1, 2, 5, 8, 10]],
    hint: 'The rule involves comparing adjacent elements'
  },
  {
    name: 'all-even',
    difficulty: 'easy',
    description: 'All numbers must be even',
    fn: (arr) => arr.every(n => n % 2 === 0),
    exampleArrays: [[2, 4, 6, 8]],
    hint: 'The rule involves checking a mathematical property of numbers'
  },
  {
    name: 'all-odd',
    difficulty: 'easy',
    description: 'All numbers must be odd',
    fn: (arr) => arr.every(n => n % 2 !== 0),
    exampleArrays: [[1, 3, 5, 7]],
    hint: 'The rule involves checking a mathematical property of numbers'
  },
  {
    name: 'sum-divisible-by-3',
    difficulty: 'easy',
    description: 'Sum of array must be divisible by 3',
    fn: (arr) => arr.reduce((sum, n) => sum + n, 0) % 3 === 0,
    exampleArrays: [[1, 2, 3]],
    hint: 'The rule involves calculating a total and checking divisibility'
  },
  {
    name: 'all-positive',
    difficulty: 'easy',
    description: 'All numbers must be positive',
    fn: (arr) => arr.every(n => n > 0),
    exampleArrays: [[1, 2, 3, 4]],
    hint: 'The rule involves checking a property of each number'
  },
  {
    name: 'all-negative',
    difficulty: 'easy',
    description: 'All numbers must be negative',
    fn: (arr) => arr.every(n => n < 0),
    exampleArrays: [[-5, -3, -1]],
    hint: 'The rule involves checking a property of each number'
  },
  {
    name: 'contains-zero',
    difficulty: 'easy',
    description: 'Array must contain at least one zero',
    fn: (arr) => arr.includes(0),
    exampleArrays: [[1, 0, 3]],
    hint: 'The rule involves checking if a specific value exists'
  },
  {
    name: 'no-duplicates',
    difficulty: 'easy',
    description: 'Array must not contain duplicate values',
    fn: (arr) => new Set(arr).size === arr.length,
    exampleArrays: [[1, 2, 3, 4]],
    hint: 'The rule involves checking uniqueness of values'
  },
  {
    name: 'length-even',
    difficulty: 'easy',
    description: 'Array length must be even',
    fn: (arr) => arr.length % 2 === 0,
    exampleArrays: [[1, 2, 3, 4]],
    hint: 'The rule involves the array length'
  },
  {
    name: 'first-equals-last',
    difficulty: 'easy',
    description: 'First element must equal last element',
    fn: (arr) => arr.length === 0 || arr[0] === arr[arr.length - 1],
    exampleArrays: [[5, 2, 3, 5]],
    hint: 'The rule involves comparing specific positions in the array'
  },
  {
    name: 'all-same',
    difficulty: 'easy',
    description: 'All elements must be the same',
    fn: (arr) => arr.every(n => n === arr[0]),
    exampleArrays: [[7, 7, 7, 7]],
    hint: 'The rule involves checking if all elements are identical'
  },
  {
    name: 'sum-positive',
    difficulty: 'easy',
    description: 'Sum of array must be positive',
    fn: (arr) => arr.reduce((sum, n) => sum + n, 0) > 0,
    exampleArrays: [[1, 2, 3]],
    hint: 'The rule involves calculating a total'
  },
  {
    name: 'max-less-than-10',
    difficulty: 'easy',
    description: 'Maximum element must be less than 10',
    fn: (arr) => arr.length === 0 || Math.max(...arr) < 10,
    exampleArrays: [[1, 3, 5, 9]],
    hint: 'The rule involves finding the largest value'
  },
  {
    name: 'strictly-decreasing',
    difficulty: 'easy',
    description: 'Array must be strictly decreasing',
    fn: (arr) => arr.every((n, i) => i === 0 || n < arr[i - 1]),
    exampleArrays: [[10, 7, 4, 2, 1]],
    hint: 'The rule involves comparing elements to each other'
  },
  {
    name: 'all-single-digit',
    difficulty: 'easy',
    description: 'All numbers must be single digits (0-9)',
    fn: (arr) => arr.every(n => n >= 0 && n <= 9),
    exampleArrays: [[1, 5, 9, 3]],
    hint: 'The rule involves checking a range for each number'
  },
  {
    name: 'contains-five',
    difficulty: 'easy',
    description: 'Array must contain the number 5',
    fn: (arr) => arr.includes(5),
    exampleArrays: [[1, 5, 9]],
    hint: 'The rule involves checking if a specific value exists'
  },
  {
    name: 'length-greater-than-3',
    difficulty: 'easy',
    description: 'Array length must be greater than 3',
    fn: (arr) => arr.length > 3,
    exampleArrays: [[1, 2, 3, 4]],
    hint: 'The rule involves the array length'
  },
  {
    name: 'product-even',
    difficulty: 'easy',
    description: 'Product of all elements must be even',
    fn: (arr) => arr.length === 0 || arr.reduce((prod, n) => prod * n, 1) % 2 === 0,
    exampleArrays: [[1, 2, 3]],
    hint: 'The rule involves multiplying all elements together'
  },
  {
    name: 'no-zeros',
    difficulty: 'easy',
    description: 'Array must not contain any zeros',
    fn: (arr) => !arr.includes(0),
    exampleArrays: [[1, 2, 3, 4]],
    hint: 'The rule involves checking if a specific value exists'
  },
  {
    name: 'at-least-one-negative',
    difficulty: 'easy',
    description: 'Array must contain at least one negative number',
    fn: (arr) => arr.some(n => n < 0),
    exampleArrays: [[1, -2, 3]],
    hint: 'The rule involves checking if at least one element meets a condition'
  },
  {
    name: 'sum-divisible-by-5',
    difficulty: 'easy',
    description: 'Sum of array must be divisible by 5',
    fn: (arr) => arr.reduce((sum, n) => sum + n, 0) % 5 === 0,
    exampleArrays: [[1, 2, 2], [5, 10, 15]],
    hint: 'The rule involves calculating a total and checking divisibility'
  },
  {
    name: 'length-odd',
    difficulty: 'easy',
    description: 'Array length must be odd',
    fn: (arr) => arr.length % 2 !== 0,
    exampleArrays: [[1, 2, 3], [5]],
    hint: 'The rule involves the array length'
  },
  {
    name: 'all-less-than-100',
    difficulty: 'easy',
    description: 'All numbers must be less than 100',
    fn: (arr) => arr.every(n => n < 100),
    exampleArrays: [[1, 50, 99], [0, 5, 10]],
    hint: 'The rule involves checking a range for each number'
  },
  {
    name: 'at-least-one-even',
    difficulty: 'easy',
    description: 'Array must contain at least one even number',
    fn: (arr) => arr.some(n => n % 2 === 0),
    exampleArrays: [[1, 2, 3], [5, 6, 7]],
    hint: 'The rule involves checking if at least one element meets a condition'
  },
  {
    name: 'sum-even',
    difficulty: 'easy',
    description: 'Sum of array must be even',
    fn: (arr) => arr.reduce((sum, n) => sum + n, 0) % 2 === 0,
    exampleArrays: [[1, 1], [2, 4, 6]],
    hint: 'The rule involves calculating a total and checking parity'
  },
  {
    name: 'min-greater-than-zero',
    difficulty: 'easy',
    description: 'Minimum element must be greater than zero',
    fn: (arr) => arr.length === 0 || Math.min(...arr) > 0,
    exampleArrays: [[1, 2, 3], [5, 10, 15]],
    hint: 'The rule involves finding the smallest value'
  },
  {
    name: 'contains-one',
    difficulty: 'easy',
    description: 'Array must contain the number 1',
    fn: (arr) => arr.includes(1),
    exampleArrays: [[1, 2, 3], [0, 1]],
    hint: 'The rule involves checking if a specific value exists'
  },
  {
    name: 'all-divisible-by-2',
    difficulty: 'easy',
    description: 'All numbers must be divisible by 2',
    fn: (arr) => arr.every(n => n % 2 === 0),
    exampleArrays: [[2, 4, 6], [10, 20]],
    hint: 'The rule involves checking divisibility for each number'
  },
  {
    name: 'length-less-than-10',
    difficulty: 'easy',
    description: 'Array length must be less than 10',
    fn: (arr) => arr.length < 10,
    exampleArrays: [[1, 2, 3], [5, 6, 7, 8, 9]],
    hint: 'The rule involves the array length'
  },
  {
    name: 'sum-odd',
    difficulty: 'easy',
    description: 'Sum of array must be odd',
    fn: (arr) => arr.reduce((sum, n) => sum + n, 0) % 2 !== 0,
    exampleArrays: [[1, 2], [3, 4, 6]],
    hint: 'The rule involves calculating a total and checking parity'
  },
  {
    name: 'all-greater-than-zero',
    difficulty: 'easy',
    description: 'All numbers must be greater than zero',
    fn: (arr) => arr.every(n => n > 0),
    exampleArrays: [[1, 2, 3], [5, 10]],
    hint: 'The rule involves checking a property of each number'
  },
  {
    name: 'max-greater-than-10',
    difficulty: 'easy',
    description: 'Maximum element must be greater than 10',
    fn: (arr) => arr.length > 0 && Math.max(...arr) > 10,
    exampleArrays: [[1, 11, 5], [20, 5]],
    hint: 'The rule involves finding the largest value'
  },
  {
    name: 'contains-ten',
    difficulty: 'easy',
    description: 'Array must contain the number 10',
    fn: (arr) => arr.includes(10),
    exampleArrays: [[1, 10, 3], [10, 20]],
    hint: 'The rule involves checking if a specific value exists'
  },
  {
    name: 'all-in-range-1-10',
    difficulty: 'easy',
    description: 'All numbers must be in range 1-10',
    fn: (arr) => arr.every(n => n >= 1 && n <= 10),
    exampleArrays: [[1, 5, 10], [2, 3, 7]],
    hint: 'The rule involves checking a range for each number'
  },
  {
    name: 'product-positive',
    difficulty: 'easy',
    description: 'Product of all elements must be positive',
    fn: (arr) => arr.length === 0 || arr.reduce((prod, n) => prod * n, 1) > 0,
    exampleArrays: [[1, 2, 3], [-1, -2]],
    hint: 'The rule involves multiplying all elements together'
  },
  {
    name: 'length-divisible-by-3',
    difficulty: 'easy',
    description: 'Array length must be divisible by 3',
    fn: (arr) => arr.length % 3 === 0,
    exampleArrays: [[1, 2, 3], [1, 2, 3, 4, 5, 6]],
    hint: 'The rule involves the array length'
  },
  {
    name: 'second-greater-than-first',
    difficulty: 'easy',
    description: 'Second element must be greater than first element',
    fn: (arr) => arr.length < 2 || arr[1] > arr[0],
    exampleArrays: [[1, 2, 0], [5, 10, 3]],
    hint: 'The rule involves comparing specific positions in the array'
  },
  {
    name: 'at-least-one-odd',
    difficulty: 'easy',
    description: 'Array must contain at least one odd number',
    fn: (arr) => arr.some(n => n % 2 !== 0),
    exampleArrays: [[2, 3, 4], [1, 2]],
    hint: 'The rule involves checking if at least one element meets a condition'
  },
  {
    name: 'all-non-negative',
    difficulty: 'easy',
    description: 'All numbers must be non-negative',
    fn: (arr) => arr.every(n => n >= 0),
    exampleArrays: [[0, 1, 2], [5, 10]],
    hint: 'The rule involves checking a property of each number'
  },
  {
    name: 'sum-divisible-by-10',
    difficulty: 'easy',
    description: 'Sum of array must be divisible by 10',
    fn: (arr) => arr.reduce((sum, n) => sum + n, 0) % 10 === 0,
    exampleArrays: [[5, 5], [10, 20, 30]],
    hint: 'The rule involves calculating a total and checking divisibility'
  },
  {
    name: 'last-greater-than-first',
    difficulty: 'easy',
    description: 'Last element must be greater than first element',
    fn: (arr) => arr.length < 2 || arr[arr.length - 1] > arr[0],
    exampleArrays: [[1, 5, 10], [2, 1, 3]],
    hint: 'The rule involves comparing specific positions in the array'
  },
  {
    name: 'exactly-three-elements',
    difficulty: 'easy',
    description: 'Array must contain exactly 3 elements',
    fn: (arr) => arr.length === 3,
    exampleArrays: [[1, 2, 3], [5, 10, 15]],
    hint: 'The rule involves the array length'
  },
  {
    name: 'all-divisible-by-3',
    difficulty: 'easy',
    description: 'All numbers must be divisible by 3',
    fn: (arr) => arr.every(n => n % 3 === 0),
    exampleArrays: [[3, 6, 9], [12, 15]],
    hint: 'The rule involves checking divisibility for each number'
  },
  {
    name: 'sum-greater-than-10',
    difficulty: 'easy',
    description: 'Sum of array must be greater than 10',
    fn: (arr) => arr.reduce((sum, n) => sum + n, 0) > 10,
    exampleArrays: [[5, 6], [11]],
    hint: 'The rule involves calculating a total'
  },
  {
    name: 'contains-duplicate',
    difficulty: 'easy',
    description: 'Array must contain at least one duplicate value',
    fn: (arr) => new Set(arr).size < arr.length,
    exampleArrays: [[1, 2, 2], [5, 5, 10]],
    hint: 'The rule involves checking for repeated values'
  },
  {
    name: 'all-less-than-50',
    difficulty: 'easy',
    description: 'All numbers must be less than 50',
    fn: (arr) => arr.every(n => n < 50),
    exampleArrays: [[1, 10, 49], [0, 25]],
    hint: 'The rule involves checking a range for each number'
  },
  {
    name: 'at-least-five-elements',
    difficulty: 'easy',
    description: 'Array must contain at least 5 elements',
    fn: (arr) => arr.length >= 5,
    exampleArrays: [[1, 2, 3, 4, 5], [0, 0, 0, 0, 0, 0]],
    hint: 'The rule involves the array length'
  },
  {
    name: 'product-divisible-by-10',
    difficulty: 'easy',
    description: 'Product of all elements must be divisible by 10',
    fn: (arr) => arr.length === 0 || arr.reduce((prod, n) => prod * n, 1) % 10 === 0,
    exampleArrays: [[2, 5], [10, 3]],
    hint: 'The rule involves multiplying all elements together'
  },
  {
    name: 'sum-less-than-100',
    difficulty: 'easy',
    description: 'Sum of array must be less than 100',
    fn: (arr) => arr.reduce((sum, n) => sum + n, 0) < 100,
    exampleArrays: [[10, 20, 30], [50, 49]],
    hint: 'The rule involves calculating a total'
  },
  {
    name: 'all-divisible-by-5',
    difficulty: 'easy',
    description: 'All numbers must be divisible by 5',
    fn: (arr) => arr.every(n => n % 5 === 0),
    exampleArrays: [[5, 10, 15], [20, 25]],
    hint: 'The rule involves checking divisibility for each number'
  }
];

// Medium Rules (20)
const mediumRules: MysteryRule[] = [
  {
    name: 'sorted',
    difficulty: 'medium',
    description: 'Array must be sorted (non-decreasing)',
    fn: (arr) => arr.every((n, i) => i === 0 || n >= arr[i - 1]),
    exampleArrays: [[1, 2, 2, 5, 8], [0, 3, 7, 10]],
    hint: 'The rule involves comparing adjacent elements'
  },
  {
    name: 'element-lte-index',
    difficulty: 'medium',
    description: 'Each element must be less than or equal to its index',
    fn: (arr) => arr.every((n, i) => n <= i),
    exampleArrays: [[0, 0, 1, 2, 4], [0, 1, 1, 3]],
    hint: 'The rule involves comparing each element to its position'
  },
  {
    name: 'alternating-odd-even',
    difficulty: 'medium',
    description: 'Elements must alternate between odd and even',
    fn: (arr) => arr.every((n, i) => i === 0 || (arr[i - 1] % 2 !== n % 2)),
    exampleArrays: [[1, 2, 3, 4, 5], [3, 6, 7, 10]],
    hint: 'The rule involves checking parity of adjacent elements'
  },
  {
    name: 'palindrome',
    difficulty: 'medium',
    description: 'Array must be a palindrome',
    fn: (arr) => arr.every((n, i) => n === arr[arr.length - 1 - i]),
    exampleArrays: [[1, 2, 3, 2, 1], [5, 4, 4, 5]],
    hint: 'The rule involves comparing elements from opposite ends'
  },
  {
    name: 'sum-equals-product',
    difficulty: 'medium',
    description: 'Sum of elements must equal product of elements',
    fn: (arr) => {
      if (arr.length === 0) return true;
      const sum = arr.reduce((a, b) => a + b, 0);
      const prod = arr.reduce((a, b) => a * b, 1);
      return sum === prod;
    },
    exampleArrays: [[2, 2], [1, 2, 3]],
    hint: 'The rule involves two different aggregate calculations'
  },
  {
    name: 'majority-element',
    difficulty: 'medium',
    description: 'One element must appear more than half the time',
    fn: (arr) => {
      if (arr.length === 0) return false;
      const counts = new Map<number, number>();
      arr.forEach(n => counts.set(n, (counts.get(n) || 0) + 1));
      return Array.from(counts.values()).some(count => count > arr.length / 2);
    },
    exampleArrays: [[1, 1, 1, 2, 3], [5, 5, 1, 5]],
    hint: 'The rule involves counting element occurrences'
  },
  {
    name: 'no-consecutive-duplicates',
    difficulty: 'medium',
    description: 'No two consecutive elements can be equal',
    fn: (arr) => arr.every((n, i) => i === 0 || n !== arr[i - 1]),
    exampleArrays: [[1, 2, 3, 2, 4], [5, 3, 7, 2]],
    hint: 'The rule involves comparing adjacent elements'
  },
  {
    name: 'sum-of-squares-even',
    difficulty: 'medium',
    description: 'Sum of squares must be even',
    fn: (arr) => arr.reduce((sum, n) => sum + n * n, 0) % 2 === 0,
    exampleArrays: [[1, 1, 2], [2, 2, 2]],
    hint: 'The rule involves transforming elements before summing'
  },
  {
    name: 'median-is-mean',
    difficulty: 'medium',
    description: 'Median must equal the mean',
    fn: (arr) => {
      if (arr.length === 0) return false;
      const sorted = [...arr].sort((a, b) => a - b);
      const median = arr.length % 2 === 0
        ? (sorted[arr.length / 2 - 1] + sorted[arr.length / 2]) / 2
        : sorted[Math.floor(arr.length / 2)];
      const mean = arr.reduce((sum, n) => sum + n, 0) / arr.length;
      return Math.abs(median - mean) < 0.0001;
    },
    exampleArrays: [[1, 2, 3], [5, 5, 5]],
    hint: 'The rule involves statistical measures'
  },
  {
    name: 'three-way-partition',
    difficulty: 'medium',
    description: 'Array can be partitioned into three equal-sum parts',
    fn: (arr) => {
      const sum = arr.reduce((a, b) => a + b, 0);
      if (sum % 3 !== 0) return false;
      const target = sum / 3;
      let current = 0;
      let parts = 0;
      for (const n of arr) {
        current += n;
        if (current === target) {
          parts++;
          current = 0;
        }
      }
      return parts === 3 && current === 0;
    },
    exampleArrays: [[1, 3, 2, 2, 4], [3, 3, 3, 3, 3, 3]],
    hint: 'The rule involves dividing the array into equal parts'
  },
  {
    name: 'zigzag',
    difficulty: 'medium',
    description: 'Elements must alternate between increasing and decreasing',
    fn: (arr) => {
      if (arr.length < 3) return true;
      for (let i = 1; i < arr.length - 1; i++) {
        const isLocalMax = arr[i] > arr[i - 1] && arr[i] > arr[i + 1];
        const isLocalMin = arr[i] < arr[i - 1] && arr[i] < arr[i + 1];
        if (!isLocalMax && !isLocalMin) return false;
      }
      return true;
    },
    exampleArrays: [[1, 3, 2, 4, 3], [2, 5, 1, 6, 4]],
    hint: 'The rule involves checking peaks and valleys in the sequence'
  },
  {
    name: 'running-sum-positive',
    difficulty: 'medium',
    description: 'All running sums must be positive',
    fn: (arr) => {
      let sum = 0;
      for (const n of arr) {
        sum += n;
        if (sum <= 0) return false;
      }
      return true;
    },
    exampleArrays: [[1, 2, -1, 3], [5, -2, 4]],
    hint: 'The rule involves tracking cumulative sums as you move through the array'
  },
  {
    name: 'two-pair',
    difficulty: 'medium',
    description: 'Array must contain exactly two pairs of duplicates',
    fn: (arr) => {
      const counts = new Map<number, number>();
      arr.forEach(n => counts.set(n, (counts.get(n) || 0) + 1));
      return Array.from(counts.values()).filter(c => c >= 2).length === 2;
    },
    exampleArrays: [[1, 1, 2, 2, 3], [4, 4, 5, 5, 6]],
    hint: 'The rule involves counting how many different values repeat'
  },
  {
    name: 'mountain-array',
    difficulty: 'medium',
    description: 'Array increases then decreases (one peak)',
    fn: (arr) => {
      if (arr.length < 3) return false;
      let i = 0;
      while (i < arr.length - 1 && arr[i] < arr[i + 1]) i++;
      if (i === 0 || i === arr.length - 1) return false;
      while (i < arr.length - 1 && arr[i] > arr[i + 1]) i++;
      return i === arr.length - 1;
    },
    exampleArrays: [[1, 3, 5, 4, 2], [2, 5, 3, 1]],
    hint: 'The rule involves a single peak with an ascent and descent'
  },
  {
    name: 'divisible-by-length',
    difficulty: 'medium',
    description: 'All elements must be divisible by array length',
    fn: (arr) => arr.length > 0 && arr.every(n => n % arr.length === 0),
    exampleArrays: [[3, 6, 9], [4, 8]],
    hint: 'The rule involves a relationship between each element and the array size'
  },
  {
    name: 'balanced-parens',
    difficulty: 'medium',
    description: 'Running sum never goes negative (treat negatives as -1, positives as +1)',
    fn: (arr) => {
      let balance = 0;
      for (const n of arr) {
        balance += n > 0 ? 1 : n < 0 ? -1 : 0;
        if (balance < 0) return false;
      }
      return balance === 0;
    },
    exampleArrays: [[1, -1, 1, -1], [1, 1, -1, -1]],
    hint: 'The rule involves balancing positive and negative values in a sequence'
  },
  {
    name: 'arithmetic-subsequence',
    difficulty: 'medium',
    description: 'Contains a subsequence of length 3+ forming arithmetic progression',
    fn: (arr) => {
      for (let i = 0; i < arr.length - 2; i++) {
        for (let j = i + 1; j < arr.length - 1; j++) {
          const diff = arr[j] - arr[i];
          if (arr.slice(j + 1).some(n => n === arr[j] + diff)) return true;
        }
      }
      return false;
    },
    exampleArrays: [[1, 3, 5, 2], [2, 4, 6, 1]],
    hint: 'The rule involves finding elements that form a regular pattern'
  },
  {
    name: 'range-product-lt-100',
    difficulty: 'medium',
    description: 'Product of (max - min) must be less than 100',
    fn: (arr) => {
      if (arr.length === 0) return true;
      const max = Math.max(...arr);
      const min = Math.min(...arr);
      return (max - min) < 100;
    },
    exampleArrays: [[1, 50, 99], [5, 10, 15]],
    hint: 'The rule involves comparing the spread between largest and smallest values'
  },
  {
    name: 'quartiles-increasing',
    difficulty: 'medium',
    description: 'Each quarter of the array has higher average than previous',
    fn: (arr) => {
      if (arr.length < 4) return false;
      const q = Math.floor(arr.length / 4);
      const avgs = [
        arr.slice(0, q).reduce((a, b) => a + b, 0) / q,
        arr.slice(q, 2 * q).reduce((a, b) => a + b, 0) / q,
        arr.slice(2 * q, 3 * q).reduce((a, b) => a + b, 0) / q,
        arr.slice(3 * q).reduce((a, b) => a + b, 0) / (arr.length - 3 * q)
      ];
      return avgs.every((avg, i) => i === 0 || avg > avgs[i - 1]);
    },
    exampleArrays: [[1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7]],
    hint: 'The rule involves dividing the array into sections and comparing their averages'
  },
  {
    name: 'no-triple',
    difficulty: 'medium',
    description: 'No element appears 3 or more times',
    fn: (arr) => {
      const counts = new Map<number, number>();
      arr.forEach(n => counts.set(n, (counts.get(n) || 0) + 1));
      return !Array.from(counts.values()).some(c => c >= 3);
    },
    exampleArrays: [[1, 1, 2, 2, 3], [4, 5, 4, 5]],
    hint: 'The rule involves limiting how often values can repeat'
  },
  {
    name: 'reverse-sorted',
    difficulty: 'medium',
    description: 'Array must be sorted in descending order (non-increasing)',
    fn: (arr) => arr.every((n, i) => i === 0 || n <= arr[i - 1]),
    exampleArrays: [[10, 8, 5, 2, 2], [100, 50, 10]],
    hint: 'The rule involves comparing adjacent elements'
  },
  {
    name: 'unique-first-half',
    difficulty: 'medium',
    description: 'First half of array contains no duplicates',
    fn: (arr) => {
      const half = Math.ceil(arr.length / 2);
      const firstHalf = arr.slice(0, half);
      return new Set(firstHalf).size === firstHalf.length;
    },
    exampleArrays: [[1, 2, 3, 3, 3], [5, 6, 7, 8, 8]],
    hint: 'The rule involves checking uniqueness in a portion of the array'
  },
  {
    name: 'sum-equals-length',
    difficulty: 'medium',
    description: 'Sum of elements must equal array length',
    fn: (arr) => arr.reduce((sum, n) => sum + n, 0) === arr.length,
    exampleArrays: [[1, 1, 1, 1], [0, 1, 2], [1, 0, 1, 1, 2]],
    hint: 'The rule involves a relationship between total and array size'
  },
  {
    name: 'abs-decreasing',
    difficulty: 'medium',
    description: 'Absolute values must be strictly decreasing',
    fn: (arr) => arr.every((n, i) => i === 0 || Math.abs(n) < Math.abs(arr[i - 1])),
    exampleArrays: [[10, -8, 5, -3, 1], [100, -50, 20]],
    hint: 'The rule involves comparing transformed values of adjacent elements'
  },
  {
    name: 'alternating-signs',
    difficulty: 'medium',
    description: 'Elements must alternate between positive and negative',
    fn: (arr) => arr.every((n, i) => i === 0 || (arr[i - 1] > 0 && n < 0) || (arr[i - 1] < 0 && n > 0)),
    exampleArrays: [[1, -2, 3, -4], [-5, 6, -7, 8]],
    hint: 'The rule involves checking signs of adjacent elements'
  },
  {
    name: 'even-odd-split',
    difficulty: 'medium',
    description: 'Number of even elements equals number of odd elements',
    fn: (arr) => {
      const evens = arr.filter(n => n % 2 === 0).length;
      const odds = arr.filter(n => n % 2 !== 0).length;
      return evens === odds;
    },
    exampleArrays: [[1, 2, 3, 4], [5, 6, 7, 8]],
    hint: 'The rule involves counting elements with different properties'
  },
  {
    name: 'increasing-differences',
    difficulty: 'medium',
    description: 'Differences between consecutive elements must increase',
    fn: (arr) => {
      if (arr.length < 3) return true;
      for (let i = 2; i < arr.length; i++) {
        if ((arr[i] - arr[i - 1]) <= (arr[i - 1] - arr[i - 2])) return false;
      }
      return true;
    },
    exampleArrays: [[1, 2, 4, 7, 11], [0, 1, 3, 6]],
    hint: 'The rule involves comparing gaps between consecutive elements'
  },
  {
    name: 'product-equals-last',
    difficulty: 'medium',
    description: 'Product of all but last element equals last element',
    fn: (arr) => {
      if (arr.length < 2) return false;
      const prod = arr.slice(0, -1).reduce((p, n) => p * n, 1);
      return prod === arr[arr.length - 1];
    },
    exampleArrays: [[2, 3, 6], [2, 2, 2, 8]],
    hint: 'The rule involves a relationship between most elements and one special element'
  },
  {
    name: 'max-index-equals-value',
    difficulty: 'medium',
    description: 'Index of maximum element equals the maximum value',
    fn: (arr) => {
      if (arr.length === 0) return false;
      const max = Math.max(...arr);
      const maxIndex = arr.indexOf(max);
      return maxIndex === max;
    },
    exampleArrays: [[0, 1, 2, 3], [1, 0, 2], [0, 1, 2, 3, 4]],
    hint: 'The rule involves a relationship between position and value'
  },
  {
    name: 'all-unique-differences',
    difficulty: 'medium',
    description: 'All consecutive differences are unique',
    fn: (arr) => {
      if (arr.length < 2) return true;
      const diffs = arr.slice(1).map((n, i) => n - arr[i]);
      return new Set(diffs).size === diffs.length;
    },
    exampleArrays: [[1, 2, 5, 9], [0, 1, 3, 7], [10, 11, 14, 19]],
    hint: 'The rule involves uniqueness of gaps between consecutive elements'
  },
  {
    name: 'avg-equals-median-element',
    difficulty: 'medium',
    description: 'Average equals the middle element',
    fn: (arr) => {
      if (arr.length === 0 || arr.length % 2 === 0) return false;
      const avg = arr.reduce((sum, n) => sum + n, 0) / arr.length;
      const middle = arr[Math.floor(arr.length / 2)];
      return Math.abs(avg - middle) < 0.0001;
    },
    exampleArrays: [[1, 3, 5], [0, 2, 4]],
    hint: 'The rule involves comparing a statistical measure to a specific position'
  },
  {
    name: 'symmetric-around-center',
    difficulty: 'medium',
    description: 'Array is symmetric around the average value',
    fn: (arr) => {
      if (arr.length === 0) return false;
      const avg = arr.reduce((sum, n) => sum + n, 0) / arr.length;
      for (let i = 0; i < arr.length; i++) {
        const reflected = 2 * avg - arr[i];
        if (!arr.some(n => Math.abs(n - reflected) < 0.0001)) return false;
      }
      return true;
    },
    exampleArrays: [[1, 2, 3], [0, 5, 10]],
    hint: 'The rule involves elements having mirror pairs'
  },
  {
    name: 'no-valleys',
    difficulty: 'medium',
    description: 'No element is less than both neighbors',
    fn: (arr) => {
      if (arr.length < 3) return true;
      for (let i = 1; i < arr.length - 1; i++) {
        if (arr[i] < arr[i - 1] && arr[i] < arr[i + 1]) return false;
      }
      return true;
    },
    exampleArrays: [[1, 2, 3], [5, 4, 4, 5]],
    hint: 'The rule involves checking for local minima'
  },
  {
    name: 'product-of-halves-equal',
    difficulty: 'medium',
    description: 'Product of first half equals product of second half',
    fn: (arr) => {
      if (arr.length < 2) return false;
      const mid = Math.floor(arr.length / 2);
      const firstProd = arr.slice(0, mid).reduce((p, n) => p * n, 1);
      const secondProd = arr.slice(-mid).reduce((p, n) => p * n, 1);
      return firstProd === secondProd;
    },
    exampleArrays: [[2, 3, 2, 3], [1, 4, 2, 2]],
    hint: 'The rule involves comparing products of two sections'
  },
  {
    name: 'multiples-of-first',
    difficulty: 'medium',
    description: 'All elements are multiples of the first element',
    fn: (arr) => {
      if (arr.length === 0 || arr[0] === 0) return false;
      return arr.every(n => n % arr[0] === 0);
    },
    exampleArrays: [[3, 6, 9, 12], [5, 10, 15]],
    hint: 'The rule involves a relationship between all elements and one special element'
  },
  {
    name: 'max-minus-min-equals-length',
    difficulty: 'medium',
    description: 'Difference between max and min equals array length',
    fn: (arr) => {
      if (arr.length === 0) return false;
      const max = Math.max(...arr);
      const min = Math.min(...arr);
      return (max - min) === arr.length;
    },
    exampleArrays: [[0, 1, 3], [1, 2, 3, 4, 6], [0, 2]],
    hint: 'The rule involves a relationship between range and array size'
  },
  {
    name: 'windowed-sum-increasing',
    difficulty: 'medium',
    description: 'Sum of each 3-element window is increasing',
    fn: (arr) => {
      if (arr.length < 3) return true;
      for (let i = 0; i < arr.length - 3; i++) {
        const sum1 = arr[i] + arr[i + 1] + arr[i + 2];
        const sum2 = arr[i + 1] + arr[i + 2] + arr[i + 3];
        if (sum2 <= sum1) return false;
      }
      return true;
    },
    exampleArrays: [[1, 2, 3, 4, 5], [0, 1, 2, 4, 6]],
    hint: 'The rule involves comparing sums of overlapping subsequences'
  },
  {
    name: 'mode-appears-odd-times',
    difficulty: 'medium',
    description: 'Most frequent element appears an odd number of times',
    fn: (arr) => {
      if (arr.length === 0) return false;
      const counts = new Map<number, number>();
      arr.forEach(n => counts.set(n, (counts.get(n) || 0) + 1));
      const maxCount = Math.max(...Array.from(counts.values()));
      return maxCount % 2 !== 0;
    },
    exampleArrays: [[1, 1, 1, 2, 3], [5, 5, 5, 5, 5, 6]],
    hint: 'The rule involves counting frequency of the most common element'
  },
  {
    name: 'sum-of-first-and-last-even',
    difficulty: 'medium',
    description: 'Sum of first and last element is even',
    fn: (arr) => {
      if (arr.length === 0) return false;
      return (arr[0] + arr[arr.length - 1]) % 2 === 0;
    },
    exampleArrays: [[1, 5, 3], [2, 7, 4]],
    hint: 'The rule involves specific positions and parity'
  },
  {
    name: 'no-peaks',
    difficulty: 'medium',
    description: 'No element is greater than both neighbors',
    fn: (arr) => {
      if (arr.length < 3) return true;
      for (let i = 1; i < arr.length - 1; i++) {
        if (arr[i] > arr[i - 1] && arr[i] > arr[i + 1]) return false;
      }
      return true;
    },
    exampleArrays: [[1, 2, 2, 3], [5, 4, 4, 3]],
    hint: 'The rule involves checking for local maxima'
  },
  {
    name: 'exactly-one-peak',
    difficulty: 'medium',
    description: 'Exactly one element is greater than both neighbors',
    fn: (arr) => {
      if (arr.length < 3) return false;
      let peaks = 0;
      for (let i = 1; i < arr.length - 1; i++) {
        if (arr[i] > arr[i - 1] && arr[i] > arr[i + 1]) peaks++;
      }
      return peaks === 1;
    },
    exampleArrays: [[1, 3, 2], [2, 5, 4, 3]],
    hint: 'The rule involves counting local maxima'
  },
  {
    name: 'double-ended-increasing',
    difficulty: 'medium',
    description: 'First half increasing and second half increasing',
    fn: (arr) => {
      if (arr.length < 2) return true;
      const mid = Math.floor(arr.length / 2);
      const firstHalf = arr.slice(0, mid);
      const secondHalf = arr.slice(mid);
      const checkInc = (a: number[]) => a.every((n, i) => i === 0 || n >= a[i - 1]);
      return checkInc(firstHalf) && checkInc(secondHalf);
    },
    exampleArrays: [[1, 2, 3, 1, 2, 3], [5, 10, 2, 4, 6]],
    hint: 'The rule involves checking a pattern in two separate sections'
  },
  {
    name: 'all-factors-of-max',
    difficulty: 'medium',
    description: 'All elements are factors of the maximum element',
    fn: (arr) => {
      if (arr.length === 0) return false;
      const max = Math.max(...arr);
      if (max === 0) return arr.every(n => n === 0);
      return arr.every(n => n !== 0 && max % n === 0);
    },
    exampleArrays: [[2, 4, 8, 16], [3, 6, 12]],
    hint: 'The rule involves divisibility relationships with the largest element'
  },
  {
    name: 'increasing-then-constant',
    difficulty: 'medium',
    description: 'Array increases then becomes constant',
    fn: (arr) => {
      if (arr.length < 2) return true;
      let i = 0;
      while (i < arr.length - 1 && arr[i] < arr[i + 1]) i++;
      while (i < arr.length - 1 && arr[i] === arr[i + 1]) i++;
      return i === arr.length - 1;
    },
    exampleArrays: [[1, 2, 3, 3, 3], [0, 5, 5]],
    hint: 'The rule involves two distinct phases in the sequence'
  },
  {
    name: 'sum-of-extremes-divisible-by-length',
    difficulty: 'medium',
    description: 'Sum of min and max is divisible by array length',
    fn: (arr) => {
      if (arr.length === 0) return false;
      const max = Math.max(...arr);
      const min = Math.min(...arr);
      return (max + min) % arr.length === 0;
    },
    exampleArrays: [[1, 3, 5], [2, 4, 10]],
    hint: 'The rule involves a relationship between extremes and array size'
  },
  {
    name: 'contains-arithmetic-triple',
    difficulty: 'medium',
    description: 'Contains three consecutive elements forming arithmetic progression',
    fn: (arr) => {
      if (arr.length < 3) return false;
      for (let i = 0; i < arr.length - 2; i++) {
        if (arr[i + 1] - arr[i] === arr[i + 2] - arr[i + 1]) return true;
      }
      return false;
    },
    exampleArrays: [[1, 2, 3, 5], [5, 1, 3, 5, 9]],
    hint: 'The rule involves finding a pattern in adjacent elements'
  },
  {
    name: 'positive-negative-balance',
    difficulty: 'medium',
    description: 'Sum of positive numbers equals absolute sum of negative numbers',
    fn: (arr) => {
      const posSum = arr.filter(n => n > 0).reduce((sum, n) => sum + n, 0);
      const negSum = Math.abs(arr.filter(n => n < 0).reduce((sum, n) => sum + n, 0));
      return posSum === negSum;
    },
    exampleArrays: [[1, 2, -3], [5, -2, -3]],
    hint: 'The rule involves balancing different types of elements'
  },
  {
    name: 'first-half-sum-greater',
    difficulty: 'medium',
    description: 'Sum of first half is greater than sum of second half',
    fn: (arr) => {
      if (arr.length < 2) return false;
      const mid = Math.floor(arr.length / 2);
      const firstSum = arr.slice(0, mid).reduce((sum, n) => sum + n, 0);
      const secondSum = arr.slice(-mid).reduce((sum, n) => sum + n, 0);
      return firstSum > secondSum;
    },
    exampleArrays: [[10, 5, 1, 2], [100, 50, 10, 20]],
    hint: 'The rule involves comparing sums of two sections'
  },
  {
    name: 'step-pattern',
    difficulty: 'medium',
    description: 'Each element equals previous element plus a constant (step)',
    fn: (arr) => {
      if (arr.length < 2) return true;
      const step = arr[1] - arr[0];
      return arr.every((n, i) => i === 0 || n === arr[i - 1] + step);
    },
    exampleArrays: [[2, 5, 8, 11], [10, 7, 4, 1]],
    hint: 'The rule involves a consistent change between consecutive elements'
  },
  {
    name: 'power-of-two-length',
    difficulty: 'medium',
    description: 'Array length must be a power of 2',
    fn: (arr) => {
      const len = arr.length;
      return len > 0 && (len & (len - 1)) === 0;
    },
    exampleArrays: [[1, 2, 3, 4], [1, 2], [5, 6, 7, 8, 9, 10, 11, 12]],
    hint: 'The rule involves a special property of the array length'
  }
];

// Hard Rules (20)
const hardRules: MysteryRule[] = [
  {
    name: 'fibonacci-sequence',
    difficulty: 'hard',
    description: 'Array must form a Fibonacci sequence',
    fn: isFibonacci,
    exampleArrays: [[1, 1, 2, 3, 5], [0, 1, 1, 2, 3], [2, 2, 4, 6, 10]],
    hint: 'The rule involves elements relating to their predecessors in a specific way'
  },
  {
    name: 'even-prime-count',
    difficulty: 'hard',
    description: 'Number of prime numbers in array must be even',
    fn: (arr) => arr.filter(n => isPrime(n)).length % 2 === 0,
    exampleArrays: [[2, 3, 4, 6], [5, 7, 10, 12], [11, 13, 1, 4]],
    hint: 'The rule involves identifying special numbers and counting them'
  },
  {
    name: 'arithmetic-or-geometric',
    difficulty: 'hard',
    description: 'Array must form an arithmetic or geometric progression',
    fn: (arr) => arr.length <= 1 || isArithmeticProgression(arr) || isGeometricProgression(arr),
    exampleArrays: [[2, 4, 6, 8], [2, 4, 8, 16], [5, 5, 5]],
    hint: 'The rule involves elements changing by a consistent pattern'
  },
  {
    name: 'longest-increasing-ge-half',
    difficulty: 'hard',
    description: 'Longest increasing subsequence length >= half of array length',
    fn: (arr) => {
      if (arr.length === 0) return true;
      const lis = new Array(arr.length).fill(1);
      for (let i = 1; i < arr.length; i++) {
        for (let j = 0; j < i; j++) {
          if (arr[j] < arr[i]) {
            lis[i] = Math.max(lis[i], lis[j] + 1);
          }
        }
      }
      return Math.max(...lis) >= arr.length / 2;
    },
    exampleArrays: [[1, 2, 3, 4], [1, 5, 2, 3, 4], [1, 2, 1, 3]],
    hint: 'The rule involves finding a substantial increasing sequence'
  },
  {
    name: 'bitwise-xor-zero',
    difficulty: 'hard',
    description: 'XOR of all elements must equal zero',
    fn: (arr) => arr.reduce((xor, n) => xor ^ n, 0) === 0,
    exampleArrays: [[1, 2, 3, 0], [5, 5], [7, 3, 4]],
    hint: 'The rule involves a bitwise operation on all elements'
  },
  {
    name: 'subset-sum-exists',
    difficulty: 'hard',
    description: 'A subset must sum to exactly zero',
    fn: (arr) => {
      const sums = new Set([0]);
      for (const n of arr) {
        const newSums = new Set(sums);
        for (const sum of sums) {
          newSums.add(sum + n);
        }
        if (newSums.has(0) && newSums.size > 1) return true;
        sums.clear();
        newSums.forEach(s => sums.add(s));
      }
      return false;
    },
    exampleArrays: [[1, -1, 2], [3, -3, 5], [2, -5, 3]],
    hint: 'The rule involves finding elements that combine to a specific total'
  },
  {
    name: 'max-gap-small',
    difficulty: 'hard',
    description: 'Max difference between consecutive elements <= 2',
    fn: (arr) => arr.every((n, i) => i === 0 || Math.abs(n - arr[i - 1]) <= 2),
    exampleArrays: [[1, 2, 4, 5, 6], [10, 11, 12], [5, 6, 7, 8]],
    hint: 'The rule involves how much adjacent elements can differ'
  },
  {
    name: 'perfect-squares',
    difficulty: 'hard',
    description: 'All elements must be perfect squares',
    fn: (arr) => arr.every(n => n >= 0 && Math.sqrt(n) === Math.floor(Math.sqrt(n))),
    exampleArrays: [[1, 4, 9, 16], [0, 1, 4], [9, 16, 25]],
    hint: 'The rule involves a mathematical property of each number'
  },
  {
    name: 'gcd-gt-one',
    difficulty: 'hard',
    description: 'GCD of all elements must be greater than 1',
    fn: (arr) => {
      if (arr.length === 0) return false;
      const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
      return arr.reduce((g, n) => gcd(g, n), arr[0]) > 1;
    },
    exampleArrays: [[6, 9, 12], [4, 8, 12], [10, 15, 20]],
    hint: 'The rule involves finding a common factor of all numbers'
  },
  {
    name: 'sum-of-pairs-even',
    difficulty: 'hard',
    description: 'Sum of every pair of elements must be even',
    fn: (arr) => {
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if ((arr[i] + arr[j]) % 2 !== 0) return false;
        }
      }
      return true;
    },
    exampleArrays: [[2, 4, 6, 8], [1, 3, 5], [10, 12, 14]],
    hint: 'The rule involves properties that any two elements must share'
  },
  {
    name: 'lcm-divisible-by-sum',
    difficulty: 'hard',
    description: 'LCM of elements divisible by sum of elements',
    fn: (arr) => {
      if (arr.length === 0 || arr.some(n => n === 0)) return false;
      const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
      const lcm = (a: number, b: number) => Math.abs(a * b) / gcd(a, b);
      const arrayLcm = arr.reduce((l, n) => lcm(l, n));
      const sum = arr.reduce((s, n) => s + n, 0);
      return sum !== 0 && arrayLcm % sum === 0;
    },
    exampleArrays: [[2, 4, 6], [3, 6, 9]],
    hint: 'The rule involves multiple number relationships'
  },
  {
    name: 'binary-tree-inorder',
    difficulty: 'hard',
    description: 'Array represents valid binary tree inorder traversal (BST property)',
    fn: (arr) => arr.every((n, i) => i === 0 || n >= arr[i - 1]),
    exampleArrays: [[1, 2, 3, 4, 5], [5, 10, 15, 20], [0, 1, 2]],
    hint: 'The rule involves a specific ordering constraint'
  },
  {
    name: 'no-three-arithmetic',
    difficulty: 'hard',
    description: 'No three elements form an arithmetic progression',
    fn: (arr) => {
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          const diff = arr[j] - arr[i];
          if (arr.some((n, k) => k > j && n === arr[j] + diff)) return false;
        }
      }
      return true;
    },
    exampleArrays: [[1, 2, 4, 8], [1, 3, 7], [2, 5, 11]],
    hint: 'The rule involves preventing certain numeric patterns'
  },
  {
    name: 'digit-sum-divisible',
    difficulty: 'hard',
    description: 'Sum of digits of each element divisible by 3',
    fn: (arr) => arr.every(n => {
      const digitSum = Math.abs(n).toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
      return digitSum % 3 === 0;
    }),
    exampleArrays: [[12, 21, 30], [111, 222], [3, 6, 9]],
    hint: 'The rule involves breaking down numbers into their component digits'
  },
  {
    name: 'circular-sorted',
    difficulty: 'hard',
    description: 'Array is a rotation of a sorted array',
    fn: (arr) => {
      if (arr.length <= 1) return true;
      let rotations = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] > arr[(i + 1) % arr.length]) rotations++;
      }
      return rotations <= 1;
    },
    exampleArrays: [[4, 5, 1, 2, 3], [3, 1, 2], [2, 3, 4, 5, 1]],
    hint: 'The rule involves a sorted structure with a twist'
  },
  {
    name: 'powers-of-two-sum',
    difficulty: 'hard',
    description: 'Sum of elements is a power of 2',
    fn: (arr) => {
      const sum = arr.reduce((s, n) => s + n, 0);
      return sum > 0 && (sum & (sum - 1)) === 0;
    },
    exampleArrays: [[1, 2, 5], [3, 5], [7, 9]],
    hint: 'The rule involves the total and a special property it must have'
  },
  {
    name: 'bipartite-parity',
    difficulty: 'hard',
    description: 'Can partition into two sets with equal sum',
    fn: (arr) => {
      const sum = arr.reduce((s, n) => s + n, 0);
      if (sum % 2 !== 0) return false;
      const target = sum / 2;
      const dp = new Set([0]);
      for (const n of arr) {
        const newDp = new Set(dp);
        for (const val of dp) {
          newDp.add(val + n);
        }
        dp.clear();
        newDp.forEach(v => dp.add(v));
        if (dp.has(target)) return true;
      }
      return false;
    },
    exampleArrays: [[1, 5, 11, 5], [1, 1, 2, 2], [3, 3]],
    hint: 'The rule involves dividing elements into balanced groups'
  },
  {
    name: 'catalan-length',
    difficulty: 'hard',
    description: 'Array length is a Catalan number',
    fn: (arr) => {
      const catalans = [1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862];
      return catalans.includes(arr.length);
    },
    exampleArrays: [[1, 2, 3, 4, 5], [1, 2], [1]],
    hint: 'The rule involves a special property of the array length'
  },
  {
    name: 'harmonic-mean-integer',
    difficulty: 'hard',
    description: 'Harmonic mean of elements is an integer',
    fn: (arr) => {
      if (arr.length === 0 || arr.some(n => n === 0)) return false;
      const harmonicMean = arr.length / arr.reduce((sum, n) => sum + 1 / n, 0);
      return Math.abs(harmonicMean - Math.round(harmonicMean)) < 0.0001;
    },
    exampleArrays: [[2, 3, 6], [1, 1, 1], [4, 4]],
    hint: 'The rule involves a specific type of average'
  },
  {
    name: 'all-primes',
    difficulty: 'hard',
    description: 'All elements must be prime numbers',
    fn: (arr) => arr.length > 0 && arr.every(n => isPrime(n)),
    exampleArrays: [[2, 3, 5, 7], [11, 13], [2, 5, 11]],
    hint: 'The rule involves a mathematical property all elements must have'
  },
  {
    name: 'triangular-numbers',
    difficulty: 'hard',
    description: 'All elements must be triangular numbers',
    fn: (arr) => arr.every(n => {
      const x = Math.sqrt(2 * n + 0.25) - 0.5;
      return x >= 0 && Math.abs(x - Math.round(x)) < 0.0001;
    }),
    exampleArrays: [[1, 3, 6, 10], [0, 1, 3], [6, 10, 15]],
    hint: 'The rule involves a mathematical property of each number'
  },
  {
    name: 'sum-is-prime',
    difficulty: 'hard',
    description: 'Sum of all elements must be a prime number',
    fn: (arr) => {
      const sum = arr.reduce((s, n) => s + n, 0);
      return isPrime(sum);
    },
    exampleArrays: [[2, 3], [1, 1, 3], [4, 3]],
    hint: 'The rule involves the total having a special mathematical property'
  },
  {
    name: 'all-composite',
    difficulty: 'hard',
    description: 'All elements must be composite numbers (not prime, > 1)',
    fn: (arr) => arr.length > 0 && arr.every(n => n > 1 && !isPrime(n)),
    exampleArrays: [[4, 6, 8, 9], [10, 12, 14], [15, 16, 18]],
    hint: 'The rule involves a mathematical property all elements must have'
  },
  {
    name: 'digit-product-divisible-by-sum',
    difficulty: 'hard',
    description: 'Product of digits divisible by sum of digits for each element',
    fn: (arr) => arr.every(n => {
      const digits = Math.abs(n).toString().split('').map(d => parseInt(d));
      const sum = digits.reduce((a, b) => a + b, 0);
      const prod = digits.reduce((a, b) => a * b, 1);
      return sum !== 0 && prod % sum === 0;
    }),
    exampleArrays: [[22, 36], [123, 132], [44, 66, 88]],
    hint: 'The rule involves breaking down numbers into their component digits'
  },
  {
    name: 'pythagorean-triple',
    difficulty: 'hard',
    description: 'Array contains at least one Pythagorean triple (a² + b² = c²)',
    fn: (arr) => {
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          for (let k = j + 1; k < arr.length; k++) {
            const sorted = [arr[i], arr[j], arr[k]].sort((a, b) => a - b);
            if (sorted[0] * sorted[0] + sorted[1] * sorted[1] === sorted[2] * sorted[2]) {
              return true;
            }
          }
        }
      }
      return false;
    },
    exampleArrays: [[3, 4, 5], [5, 12, 13, 1], [8, 15, 17]],
    hint: 'The rule involves finding three numbers with a special relationship'
  },
  {
    name: 'lucas-sequence',
    difficulty: 'hard',
    description: 'Array forms a Lucas sequence (like Fibonacci, starts 2, 1)',
    fn: (arr) => {
      if (arr.length === 0) return true;
      if (arr.length === 1) return true;
      if (arr.length === 2) return arr[0] >= 0 && arr[1] >= 0;
      for (let i = 2; i < arr.length; i++) {
        if (arr[i] !== arr[i - 1] + arr[i - 2]) return false;
      }
      return true;
    },
    exampleArrays: [[2, 1, 3, 4, 7], [1, 3, 4, 7, 11], [5, 5, 10, 15, 25]],
    hint: 'The rule involves elements relating to their predecessors in a specific way'
  },
  {
    name: 'power-of-three',
    difficulty: 'hard',
    description: 'All elements must be powers of 3',
    fn: (arr) => arr.length > 0 && arr.every(n => {
      if (n <= 0) return false;
      let temp = n;
      while (temp > 1) {
        if (temp % 3 !== 0) return false;
        temp /= 3;
      }
      return temp === 1;
    }),
    exampleArrays: [[1, 3, 9, 27], [3, 9], [1, 9, 81]],
    hint: 'The rule involves a mathematical property all elements must have'
  },
  {
    name: 'palindrome-digits',
    difficulty: 'hard',
    description: 'All elements must be palindromic numbers',
    fn: (arr) => arr.every(n => {
      const str = Math.abs(n).toString();
      return str === str.split('').reverse().join('');
    }),
    exampleArrays: [[121, 131, 141], [11, 22, 33], [1, 2, 3]],
    hint: 'The rule involves the structure of each number'
  },
  {
    name: 'sum-of-divisors-even',
    difficulty: 'hard',
    description: 'Sum of divisors is even for all elements',
    fn: (arr) => arr.every(n => {
      if (n <= 0) return false;
      let sum = 0;
      for (let i = 1; i <= n; i++) {
        if (n % i === 0) sum += i;
      }
      return sum % 2 === 0;
    }),
    exampleArrays: [[3, 6, 10], [15, 21]],
    hint: 'The rule involves finding all factors of each number'
  },
  {
    name: 'contains-perfect-number',
    difficulty: 'hard',
    description: 'Array contains at least one perfect number',
    fn: (arr) => arr.some(n => {
      if (n <= 1) return false;
      let sum = 0;
      for (let i = 1; i < n; i++) {
        if (n % i === 0) sum += i;
      }
      return sum === n;
    }),
    exampleArrays: [[6, 10, 20], [28, 5, 10], [1, 6, 8]],
    hint: 'The rule involves a special mathematical property'
  },
  {
    name: 'all-abundant-numbers',
    difficulty: 'hard',
    description: 'All elements are abundant numbers (sum of divisors > 2n)',
    fn: (arr) => arr.length > 0 && arr.every(n => {
      if (n <= 0) return false;
      let sum = 0;
      for (let i = 1; i < n; i++) {
        if (n % i === 0) sum += i;
      }
      return sum > n;
    }),
    exampleArrays: [[12, 18, 20], [24, 30], [36, 40]],
    hint: 'The rule involves comparing each number to its divisors'
  },
  {
    name: 'bitwise-and-zero',
    difficulty: 'hard',
    description: 'Bitwise AND of all elements equals zero',
    fn: (arr) => {
      if (arr.length === 0) return false;
      return arr.reduce((and, n) => and & n, arr[0]) === 0;
    },
    exampleArrays: [[1, 2], [3, 4], [7, 8]],
    hint: 'The rule involves a bitwise operation on all elements'
  },
  {
    name: 'geometric-mean-integer',
    difficulty: 'hard',
    description: 'Geometric mean of elements is an integer',
    fn: (arr) => {
      if (arr.length === 0 || arr.some(n => n <= 0)) return false;
      const product = arr.reduce((p, n) => p * n, 1);
      const geomMean = Math.pow(product, 1 / arr.length);
      return Math.abs(geomMean - Math.round(geomMean)) < 0.0001;
    },
    exampleArrays: [[2, 8], [3, 3, 3], [2, 2, 2, 2]],
    hint: 'The rule involves a specific type of average'
  },
  {
    name: 'collatz-converges-fast',
    difficulty: 'hard',
    description: 'All elements reach 1 in Collatz sequence within 10 steps',
    fn: (arr) => arr.every(n => {
      if (n <= 0) return false;
      let steps = 0;
      let val = n;
      while (val !== 1 && steps < 10) {
        val = val % 2 === 0 ? val / 2 : 3 * val + 1;
        steps++;
      }
      return val === 1;
    }),
    exampleArrays: [[1, 2, 4, 8], [3, 5, 6], [10, 12, 16]],
    hint: 'The rule involves testing a sequence property for each number'
  },
  {
    name: 'all-happy-numbers',
    difficulty: 'hard',
    description: 'All elements are happy numbers (sum of squares of digits reaches 1)',
    fn: (arr) => arr.length > 0 && arr.every(n => {
      const seen = new Set<number>();
      let current = Math.abs(n);
      while (current !== 1 && !seen.has(current)) {
        seen.add(current);
        current = current.toString().split('').reduce((sum, d) => sum + parseInt(d) ** 2, 0);
      }
      return current === 1;
    }),
    exampleArrays: [[1, 7, 10], [13, 19, 23], [28, 31, 32]],
    hint: 'The rule involves iterating a process on each number'
  },
  {
    name: 'factorial-sum',
    difficulty: 'hard',
    description: 'Sum equals factorial of array length',
    fn: (arr) => {
      const factorial = (n: number): number => n <= 1 ? 1 : n * factorial(n - 1);
      const sum = arr.reduce((s, n) => s + n, 0);
      return sum === factorial(arr.length);
    },
    exampleArrays: [[1, 1], [1, 2, 3], [6, 6, 6, 6]],
    hint: 'The rule involves a relationship between sum and array size'
  },
  {
    name: 'no-substring-sum-zero',
    difficulty: 'hard',
    description: 'No contiguous subarray sums to zero',
    fn: (arr) => {
      for (let i = 0; i < arr.length; i++) {
        let sum = 0;
        for (let j = i; j < arr.length; j++) {
          sum += arr[j];
          if (sum === 0) return false;
        }
      }
      return true;
    },
    exampleArrays: [[1, 2, 3], [5, -2, 4], [10, 20, 30]],
    hint: 'The rule involves checking all possible contiguous subsequences'
  },
  {
    name: 'each-divides-next',
    difficulty: 'hard',
    description: 'Each element divides the next element',
    fn: (arr) => {
      if (arr.some(n => n === 0)) return false;
      return arr.every((n, i) => i === arr.length - 1 || arr[i + 1] % n === 0);
    },
    exampleArrays: [[2, 4, 8, 16], [3, 6, 12], [1, 5, 10]],
    hint: 'The rule involves divisibility relationships between consecutive elements'
  },
  {
    name: 'modulo-sequence',
    difficulty: 'hard',
    description: 'Elements form a sequence where arr[i] ≡ i (mod 7)',
    fn: (arr) => arr.every((n, i) => n % 7 === i % 7),
    exampleArrays: [[0, 1, 2, 3], [7, 8, 9], [14, 15, 16]],
    hint: 'The rule involves a modular relationship between values and positions'
  },
  {
    name: 'square-free',
    difficulty: 'hard',
    description: 'No element is divisible by a perfect square > 1',
    fn: (arr) => arr.every(n => {
      if (n === 0) return false;
      const absN = Math.abs(n);
      for (let i = 2; i * i <= absN; i++) {
        if (absN % (i * i) === 0) return false;
      }
      return true;
    }),
    exampleArrays: [[1, 2, 3, 5], [6, 7, 10], [11, 13, 14]],
    hint: 'The rule involves checking if numbers have repeated prime factors'
  },
  {
    name: 'sum-equals-max-squared',
    difficulty: 'hard',
    description: 'Sum of all elements equals square of maximum element',
    fn: (arr) => {
      if (arr.length === 0) return false;
      const max = Math.max(...arr);
      const sum = arr.reduce((s, n) => s + n, 0);
      return sum === max * max;
    },
    exampleArrays: [[3, 3, 3], [4, 4, 4, 4], [5, 5, 5, 5, 5]],
    hint: 'The rule involves a relationship between sum and the largest value'
  },
  {
    name: 'alternating-parity-sum',
    difficulty: 'hard',
    description: 'Alternating sum (arr[0] - arr[1] + arr[2] - ...) equals zero',
    fn: (arr) => {
      const altSum = arr.reduce((sum, n, i) => sum + (i % 2 === 0 ? n : -n), 0);
      return altSum === 0;
    },
    exampleArrays: [[1, 1], [2, 3, 1], [5, 5, 3, 3]],
    hint: 'The rule involves a special way of combining elements'
  },
  {
    name: 'coprime-neighbors',
    difficulty: 'hard',
    description: 'Each pair of consecutive elements is coprime (GCD = 1)',
    fn: (arr) => {
      const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
      return arr.every((n, i) => i === 0 || gcd(n, arr[i - 1]) === 1);
    },
    exampleArrays: [[3, 5, 7, 11], [2, 3, 4, 5], [7, 8, 9]],
    hint: 'The rule involves checking divisibility relationships between adjacent elements'
  },
  {
    name: 'digit-ascending',
    difficulty: 'hard',
    description: 'All elements have digits in strictly ascending order',
    fn: (arr) => arr.every(n => {
      const digits = Math.abs(n).toString().split('');
      return digits.every((d, i) => i === 0 || parseInt(d) > parseInt(digits[i - 1]));
    }),
    exampleArrays: [[123, 456, 789], [12, 34, 56], [1, 2, 3]],
    hint: 'The rule involves the structure of each number'
  },
  {
    name: 'tetrahedral-numbers',
    difficulty: 'hard',
    description: 'All elements are tetrahedral numbers',
    fn: (arr) => arr.every(n => {
      // Tetrahedral: n = k(k+1)(k+2)/6
      if (n < 0) return false;
      for (let k = 0; k <= 100; k++) {
        if (k * (k + 1) * (k + 2) / 6 === n) return true;
        if (k * (k + 1) * (k + 2) / 6 > n) return false;
      }
      return false;
    }),
    exampleArrays: [[1, 4, 10, 20], [0, 1, 4], [10, 20, 35]],
    hint: 'The rule involves a mathematical property of each number'
  },
  {
    name: 'weighted-sum-zero',
    difficulty: 'hard',
    description: 'Weighted sum (index * value) equals zero',
    fn: (arr) => {
      const weightedSum = arr.reduce((sum, n, i) => sum + i * n, 0);
      return weightedSum === 0;
    },
    exampleArrays: [[0, 0, 0], [0, 2, -1], [0, 0, 3, -2]],
    hint: 'The rule involves combining position and value'
  },
  {
    name: 'binary-palindrome',
    difficulty: 'hard',
    description: 'All elements are palindromes in binary representation',
    fn: (arr) => arr.every(n => {
      const binary = Math.abs(n).toString(2);
      return binary === binary.split('').reverse().join('');
    }),
    exampleArrays: [[1, 3, 5, 7], [9, 15, 17], [21, 31, 33]],
    hint: 'The rule involves the binary representation of each number'
  },
  {
    name: 'sum-of-cubes',
    difficulty: 'hard',
    description: 'Array contains two elements where one is sum of cubes of others',
    fn: (arr) => {
      for (let target = 0; target < arr.length; target++) {
        const others = arr.filter((_, i) => i !== target);
        const sumOfCubes = others.reduce((sum, n) => sum + n * n * n, 0);
        if (arr[target] === sumOfCubes) return true;
      }
      return false;
    },
    exampleArrays: [[2, 3, 35], [1, 2, 9], [1, 1, 2]],
    hint: 'The rule involves finding a special relationship between one element and the rest'
  },
  {
    name: 'product-is-perfect-square',
    difficulty: 'hard',
    description: 'Product of all elements is a perfect square',
    fn: (arr) => {
      if (arr.length === 0) return false;
      const product = arr.reduce((p, n) => p * Math.abs(n), 1);
      const sqrt = Math.sqrt(product);
      return Math.abs(sqrt - Math.round(sqrt)) < 0.0001;
    },
    exampleArrays: [[2, 2], [3, 3, 4], [4, 9]],
    hint: 'The rule involves the product having a special property'
  },
  {
    name: 'all-deficient-numbers',
    difficulty: 'hard',
    description: 'All elements are deficient numbers (sum of divisors < 2n)',
    fn: (arr) => arr.length > 0 && arr.every(n => {
      if (n <= 0) return false;
      let sum = 0;
      for (let i = 1; i < n; i++) {
        if (n % i === 0) sum += i;
      }
      return sum < n;
    }),
    exampleArrays: [[2, 3, 4, 5], [7, 8, 9], [13, 14, 15]],
    hint: 'The rule involves comparing each number to its divisors'
  }
];

export const ALL_RULES: MysteryRule[] = [
  ...easyRules,
  ...mediumRules,
  ...hardRules
];

export function getRandomRule(difficulty?: Difficulty): MysteryRule {
  const rules = difficulty
    ? ALL_RULES.filter(rule => rule.difficulty === difficulty)
    : ALL_RULES;
  const randomIndex = Math.floor(Math.random() * rules.length);
  return rules[randomIndex];
}

export function getRuleByName(name: string): MysteryRule | undefined {
  return ALL_RULES.find(rule => rule.name === name);
}

// Simple seeded random number generator
function seededRandom(seed: number): number {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function getDailyRule(difficulty?: Difficulty): MysteryRule {
  // Get today's date as seed (YYYY-MM-DD format)
  const today = new Date().toISOString().split('T')[0];
  // Convert date string to number seed
  const seed = today.split('-').map(Number).reduce((acc, val) => acc + val, 0);

  const rules = difficulty
    ? ALL_RULES.filter(rule => rule.difficulty === difficulty)
    : ALL_RULES;

  const index = Math.floor(seededRandom(seed) * rules.length);
  return rules[index];
}
