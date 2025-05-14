/**
 * 1.1 Manipulação de Tipos e Generics
 *
 * Implemente uma função que recebe um array de objetos e retorna um novo array contendo apenas os
 * valores de uma chave específica. Utilize Generics para garantir a tipagem.
 *
 * Exemplo:
 *
 * const data = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' }
 * ];
 * const result = extractValues(data, 'name');
 *
 * Saída Esperada: ['Alice', 'Bob']
 *
 */

export const extractValues = <T, K extends keyof T>(input: { objects: T[]; key: K }): T[K][] => {
  return input.objects.map((o) => o[input.key]).filter((k) => k !== undefined);
};

const result = extractValues({
  objects: [
    {
      id: 1,
      name: 'Alice',
    },
    {
      id: 2,
      name: 1,
    },
    {
      id: 3,
    },
    {},
    {
      test: 'test',
    },
  ],
  key: 'name',
});

console.log(result);
