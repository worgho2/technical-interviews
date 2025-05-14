/**
 * 1.2 Validação e Tipagem com Union Types
 *
 * Implemente uma função que recebe uma string representando uma operação matemática (add, subtract,
 * multiply, divide) e dois números. A função deve realizar a operação correspondente e lançar um
 * erro caso a operação não seja suportada.
 *
 * Exemplo:
 *
 * calculate('add', 10, 5); // 15
 * calculate('divide', 10, 0); // Error: Division by zero
 */

export type CalculationType = 'add' | 'subtract' | 'multiply' | 'divide';

export const calculate = (input: { operation: CalculationType; a: number; b: number }): number => {
  const operationMap: Record<CalculationType, (x: number, y: number) => number> = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => {
      if (b === 0) {
        throw new Error('Division by zero');
      }
      return a / b;
    },
  };

  return operationMap[input.operation](input.a, input.b);
};

const result = calculate({
  operation: 'add',
  a: 1,
  b: 2,
});

console.log(result);
