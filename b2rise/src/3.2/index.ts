/**
 * 3.2 Refatoração de Lógica Complexa
 *
 * Dado o código abaixo, refatore para melhorar a legibilidade e modularidade:
 *
 * function calculateDiscount(price: number, isPremium: boolean): number {
 *   if (isPremium) {
 *     if (price > 100) {
 *       return price * 0.8;
 *     } else {
 *       return price * 0.9;
 *     }
 *   } else {
 *     if (price > 100) {
 *       return price * 0.9;
 *     } else {
 *       return price;
 *     }
 *   }
 * }
 */

export interface Discount {
  apply: (price: number) => number;
}

export const calculateFinalPrice = (input: { price: number; discount?: Discount }): number => {
  const finalPrice = input.discount?.apply(input.price) ?? input.price;
  return Math.max(0, finalPrice);
};

export const premiumDiscount: Discount = {
  apply: (price) => {
    if (price > 100) {
      return price * 0.8;
    }

    return price * 0.9;
  },
};

export const regularDiscount: Discount = {
  apply: (price) => {
    if (price > 100) {
      return price * 0.9;
    }

    return price;
  },
};

const result = calculateFinalPrice({
  price: 100,
  discount: premiumDiscount,
});

console.log(result);
