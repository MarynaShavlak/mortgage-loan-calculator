export const inputsConfig = {
  totalCost: createInputConfig(
    '#total-cost',
    '#total-cost-badge',
    '--thumb-percent',
    { min: 100000, max: 10000000 },
  ),
  advancePayment: createInputConfig(
    '#advance-payment',
    '#advance-payment-badge',
    '--thumb-percent-2',
    { min: 30, max: 90 },
  ),
  creditTerm: createInputConfig(
    '#credit-term-range',
    '#credit-term-range-badge',
    '--thumb-percent-3',
    { min: 12, max: 240 },
  ),
};


function createInputConfig(inputSelector, badgeSelector, thumb, range) {
  const input = document.querySelector(inputSelector);
  const badge = document.querySelector(badgeSelector);
  return { input, badge, thumb, range };
}