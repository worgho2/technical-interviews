/**
 * 3.1 Refatoração de Código
 *
 * Dado o seguinte código, identifique e implemente as melhorias necessárias seguindo princípios de
 * Clean Code:
 *
 * function processItems(items: any[]) {
 *   for (let i = 0; i < items.length; i++) {
 *     if (items[i].price > 100) {
 *       console.log(items[i].name + ' is expensive');
 *     }
 *   }
 * }
 */

export interface Logger {
  log: (message: string) => void;
}

export type Item = {
  name: string;
  price: number;
};

export const logExpensiveItems = (input: { items: Item[]; logger: Logger }): void => {
  input.items.forEach((item) => {
    if (item.price > 100) {
      input.logger.log(`Item "${item.name}" is expensive. Price "${item.price}" higher than 100`);
    }
  });
};

const consoleLogger: Logger = {
  log: (message) => console.log(message),
};

const result = logExpensiveItems({
  items: [
    {
      name: 'Item 1',
      price: 101,
    },
    {
      name: 'Item 2',
      price: 99,
    },
  ],
  logger: consoleLogger,
});

console.log(result);
