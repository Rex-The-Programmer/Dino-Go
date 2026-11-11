import { describe, expect, it } from 'vitest';
import { calculate, formatTime } from './TamingCalc.js';

describe('taming calculator', () => {
    it('calculates bites and time needed for a food', () => {
        const [result] = calculate({
            dino: {
                affinity_needed: 1000,
                affinity_per_level: 0,
                food_consumption: 1,
                ineffectiveness: 0,
            },
            foods: [{ id: 1, food_name: 'Test food', affinity: 100, food_value: 50 }],
            level: 20,
            tamingSpeed: 1,
            selected: {},
        });

        expect(result).toMatchObject({
            id: 1,
            max: 3,
            effectiveness: 1,
            seconds: 150,
        });
    });

    it('formats elapsed time consistently', () => {
        expect(formatTime(3661)).toBe('1:01:01');
        expect(formatTime(null)).toBe('—');
    });
});
