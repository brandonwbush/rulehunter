import { describe, it, expect } from 'vitest';
import { getRandomRule, getRuleByName } from '@/app/api/game/rule';
import { ALL_RULES } from '@/app/api/game/rule';

describe('Rule Bank', () => {
  describe('getRandomRule', () => {
    it('should return a rule when called without difficulty', () => {
      const rule = getRandomRule();
      expect(rule).toBeDefined();
      expect(rule).toHaveProperty('name');
      expect(rule).toHaveProperty('difficulty');
      expect(rule).toHaveProperty('description');
      expect(rule).toHaveProperty('fn');
      expect(rule).toHaveProperty('exampleArrays');
      expect(rule).toHaveProperty('hint');
    });

    it('should return an easy rule when difficulty is easy', () => {
      const rule = getRandomRule('easy');
      expect(rule.difficulty).toBe('easy');
    });

    it('should return a medium rule when difficulty is medium', () => {
      const rule = getRandomRule('medium');
      expect(rule.difficulty).toBe('medium');
    });

    it('should return a hard rule when difficulty is hard', () => {
      const rule = getRandomRule('hard');
      expect(rule.difficulty).toBe('hard');
    });

    it('should return different rules on multiple calls', () => {
      const rules = new Set();
      // Call 20 times to likely get different rules
      for (let i = 0; i < 20; i++) {
        const rule = getRandomRule();
        rules.add(rule.name);
      }
      // We should have gotten at least 2 different rules
      expect(rules.size).toBeGreaterThan(1);
    });

    it('should only return rules from the specified difficulty', () => {
      const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];

      for (const diff of difficulties) {
        // Get 10 random rules of this difficulty
        for (let i = 0; i < 10; i++) {
          const rule = getRandomRule(diff);
          expect(rule.difficulty).toBe(diff);
        }
      }
    });
  });

  describe('getRuleByName', () => {
    it('should return a rule when given a valid name', () => {
      const rule = getRuleByName('all-positive');
      expect(rule).toBeDefined();
      expect(rule?.name).toBe('all-positive');
      expect(rule?.difficulty).toBe('easy');
    });

    it('should return undefined when given an invalid name', () => {
      const rule = getRuleByName('non-existent-rule');
      expect(rule).toBeUndefined();
    });

    it('should return the correct rule for each known rule name', () => {
      // Test a few known rules
      const knownRules = [
        'all-positive',
        'all-even',
        'strictly-increasing',
        'sum-divisible-by-3'
      ];

      for (const ruleName of knownRules) {
        const rule = getRuleByName(ruleName);
        expect(rule).toBeDefined();
        expect(rule?.name).toBe(ruleName);
      }
    });

    it('should have unique rule names', () => {
      const names = ALL_RULES.map(r => r.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(ALL_RULES.length);
    });
  });

  describe('ALL_RULES validation', () => {
    it('should have exactly 150 rules', () => {
      expect(ALL_RULES.length).toBe(150);
    });

    it('should have 50 easy rules', () => {
      const easyRules = ALL_RULES.filter(r => r.difficulty === 'easy');
      expect(easyRules.length).toBe(50);
    });

    it('should have 50 medium rules', () => {
      const mediumRules = ALL_RULES.filter(r => r.difficulty === 'medium');
      expect(mediumRules.length).toBe(50);
    });

    it('should have 50 hard rules', () => {
      const hardRules = ALL_RULES.filter(r => r.difficulty === 'hard');
      expect(hardRules.length).toBe(50);
    });

    it('should have all rules with valid structure', () => {
      for (const rule of ALL_RULES) {
        expect(rule).toHaveProperty('name');
        expect(rule).toHaveProperty('difficulty');
        expect(rule).toHaveProperty('description');
        expect(rule).toHaveProperty('fn');
        expect(rule).toHaveProperty('exampleArrays');
        expect(rule).toHaveProperty('hint');

        expect(typeof rule.name).toBe('string');
        expect(['easy', 'medium', 'hard']).toContain(rule.difficulty);
        expect(typeof rule.description).toBe('string');
        expect(typeof rule.fn).toBe('function');
        expect(Array.isArray(rule.exampleArrays)).toBe(true);
        expect(typeof rule.hint).toBe('string');

        // Ensure hint is not empty
        expect(rule.hint.length).toBeGreaterThan(0);

        // Ensure example arrays are not empty
        expect(rule.exampleArrays.length).toBeGreaterThan(0);
      }
    });

    it('should have all rule functions work with example arrays', () => {
      for (const rule of ALL_RULES) {
        // Each example array should pass the rule
        for (const exampleArray of rule.exampleArrays) {
          const result = rule.fn(exampleArray);
          expect(result, `Rule "${rule.name}" failed on example array ${JSON.stringify(exampleArray)}`).toBe(true);
        }
      }
    });

    it('should have all rule functions return boolean', () => {
      for (const rule of ALL_RULES) {
        const testArrays = [
          [],
          [1],
          [1, 2, 3],
          [-1, 0, 1],
          [100, 200, 300]
        ];

        for (const testArray of testArrays) {
          const result = rule.fn(testArray);
          expect(typeof result).toBe('boolean');
        }
      }
    });
  });
});
