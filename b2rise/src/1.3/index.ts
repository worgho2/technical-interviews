/**
 * 1.3 Imutabilidade e Manipulação de Arrays
 *
 * Implemente uma função que recebe uma lista de números e retorna uma nova lista onde todos os
 * números negativos são transformados em positivos, sem modificar a lista original.
 *
 * Exemplo:
 *
 * const numbers = [-1, 2, -3, 4];
 * const result = makeAllPositive(numbers);
 *
 * Saída esperada: [1, 2, 3, 4]
 */

export const makeAllPositive = (values: number[]): number[] => {
  return values.map(Math.abs);
};

const input = [-1, 2, -3, 4];
const result = makeAllPositive(input);

console.log(result);
