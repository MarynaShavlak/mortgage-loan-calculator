const inputsConfig = {
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

const loanDetails = {
  loanAmount: 70000,
  annualInterestRate: 19.7,
  loanTermInMonths: 12,
  type: 'annuity',
};

const loanAmountEl = document.querySelector('.loan-amount__value');



Object.keys(inputsConfig).forEach(inputKey => {
  const { input, badge } = inputsConfig[inputKey];
  input.addEventListener('input', () => updateThumb(inputKey));
  badge.addEventListener(
    'blur',
    handleBlur(inputKey, inputsConfig[inputKey].range),
  );
});

function updateThumb(inputKey) {
  updateRange(inputKey);
  handleSpecialCases(inputKey);
  const monthlyPayment = calculateAnnuityMonthlyPayment(loanDetails);
  const totalPayment = calculateTotalPayment(loanDetails);
  updateMonthlyPaymentDisplay(monthlyPayment);
  updateTotalPaymentDisplay(totalPayment);
  updateLoanCostsDisplay( loanDetails.loanAmount, totalPayment)
}

function updateRange(inputKey) {
  const { input, thumb, badge } = inputsConfig[inputKey];
  const thumbPercent = (input.value - input.min) / (input.max - input.min);
  document.documentElement.style.setProperty(thumb, thumbPercent);
  badge.value = numberWithSpaces(input.value);
}

function handleSpecialCases(inputKey) {
  if (inputKey === 'totalCost' || inputKey === 'advancePayment') {
    const loanAmount = calculateLoanAmount();
    updateLoanAmount(loanAmount);
    loanDetails.loanAmount = loanAmount;
  } else if (inputKey === 'creditTerm') {
    loanDetails.loanTermInMonths = inputsConfig[inputKey].input.value;
  }
}

function updateMonthlyPaymentDisplay( monthlyPayment) {
      const monthAmountEl = document.querySelector('.month__value');
  monthAmountEl.textContent = numberWithSpaces(monthlyPayment);
}

function updateTotalPaymentDisplay( monthlyPayment) {
      const totalPaymentEl = document.querySelector('.value--total');
      totalPaymentEl.textContent = `${numberWithSpaces(monthlyPayment)} грн`;
}
function updateLoanCostsDisplay( loanAmount, totalPayment) {
      const loanCostsEl = document.querySelector('.value--costs');
      loanCostsEl.textContent = `${numberWithSpaces(calculateLoanCosts(loanAmount, totalPayment))} грн`;
}


function calculateLoanAmount() {
  const totalCost = parseFloat(inputsConfig.totalCost.input.value) || 0;
  const advancePayment =
    parseFloat(inputsConfig.advancePayment.input.value) || 0;
  const loanAmount = totalCost - (totalCost * advancePayment) / 100;
  return loanAmount;
}

function updateLoanAmount(loanAmount) {
  loanAmountEl.textContent = numberWithSpaces(loanAmount);
}

function numberWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function handleBlur(inputKey, { min, max }) {
  return function () {
    const cleanedValue = this.value.replace(/[^\d\s]/g, '');
    const trimmedValue = cleanedValue.replace(/\s/g, '');
    const clampedValue = Math.min(
      Math.max(parseInt(trimmedValue, 10), min),
      max,
    );

    const { input, badge } = inputsConfig[inputKey];
    badge.value = numberWithSpaces(clampedValue);
    input.value = clampedValue;

    updateThumb(inputKey);
  };
}

function createInputConfig(inputSelector, badgeSelector, thumb, range) {
  const input = document.querySelector(inputSelector);
  const badge = document.querySelector(badgeSelector);
  return { input, badge, thumb, range };
}

function calculateAnnuityMonthlyPayment(loanDetails) {
  const { loanAmount, annualInterestRate, loanTermInMonths } = loanDetails;
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const { numerator, denominator } = calculateNumeratorDenominator(
    loanAmount,
    monthlyInterestRate,
    loanTermInMonths,
  );

  const monthlyPayment = numerator / denominator;
  return parseFloat(monthlyPayment.toFixed(0));
}

function calculateTotalPayment(loanDetails) {
  const { loanAmount, annualInterestRate, loanTermInMonths } = loanDetails;
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const { numerator, denominator } = calculateNumeratorDenominator(
    loanAmount,
    monthlyInterestRate,
    loanTermInMonths,
  );

  const totalPayment = (numerator / denominator) * loanTermInMonths;
  return parseFloat(totalPayment.toFixed(0));
}

function calculateLoanCosts(loanAmount, totalPayment) {
return totalPayment - loanAmount;
}

function calculateNumeratorDenominator(
  loanAmount,
  monthlyInterestRate,
  loanTermInMonths,
) {
  const numerator =
    loanAmount *
    monthlyInterestRate *
    Math.pow(1 + monthlyInterestRate, loanTermInMonths);
  const denominator = Math.pow(1 + monthlyInterestRate, loanTermInMonths) - 1;

  return { numerator, denominator };
}


