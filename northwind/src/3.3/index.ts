/**
 * 3.3 Melhorando Nomes e Estrutura
 *
 * Refatore o código abaixo para melhorar a clareza dos nomes e a modularidade:
 *
 * function c(x: number[]): number[] {
 *   const r = [];
 *   for (let i = 0; i < x.length; i++) {
 *     if (x[i] % 2 === 0) {
 *       r.push(x[i] * 2);
 *     }
 *   }
 *   return r;
 * }
 */

export const filterAndApply = (input: {
  values: number[];
  filter: (value: number) => boolean;
  apply: (value: number) => number;
}): number[] => {
  const filteredValues: number[] = [];

  for (const value of input.values) {
    if (input.filter(value)) {
      filteredValues.push(input.apply(value));
    }
  }

  return filteredValues;
};

const result = filterAndApply({
  values: [1, 2, 3, 4, 5],
  filter: (value) => value % 2 === 0,
  apply: (value) => value * 2,
});

console.log(result);
