import { Difficulty, MysteryRule } from '@/lib/types';
import { ALL_RULES } from './mystery-rule';

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
