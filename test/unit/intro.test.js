import {describe, test, it, expect} from 'vitest';
import { max, fizzBuzz } from '../../intro.js';

describe('max', ()=> {
    it('should return the first argument if it is greater', () => {
        expect(max(2,1)).toBe(2);
    })
    it('should return the second argument if it is greater', () => {
        expect(max(1,2)).toBe(2);
    })
    it('should return the first argument if arguements are equal', () => {
        expect(max(1,1)).toBe(1);
    })
   
});

// describe('fizzBuzz', ()=> {
//     it('should return "FizzBuzz" if n is divisible by both 3 & 5', () => {
//         expect(fizzBuzz(15)).toBe('FizzBuzz');
//     })
//     it('should return "Fizz" if n is divisible by 3 but not 5 ', () => {
//         expect(fizzBuzz(12)).toBe('Fizz');
//     })
//     it('should return "Buzz" if n is divisible by 5 but not 3', () => {
//         expect(fizzBuzz(10)).toBe('Buzz');
//     })
//     it('should return n to a string value if not divisible by 3 or 5', ()=> {
//         expect(fizzBuzz(7)).toBe('7');
//     })
// })

describe('fizBuzz', () => {
    const testCases = [
        { input: 15, expected: 'FizzBuzz' },
        { input: 12, expected: 'Fizz' },
        { input: 10, expected: 'Buzz' },
        { input: 7, expected: '7' },
      ];
     
      testCases.forEach(({input, expected}) => {
        it(`should return "${expected}" for input ${input}`, () => {
            expect(fizzBuzz(input)).toBe(fizzBuzz(expected));
        });
      });
});

