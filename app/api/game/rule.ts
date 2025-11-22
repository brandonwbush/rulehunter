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
