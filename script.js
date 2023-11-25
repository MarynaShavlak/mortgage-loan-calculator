import { loanFees } from './loanFeesData.js';
import { renderFees } from './renderFees.js';

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
  totalFees: 1000,
};

let selectedFees = [
  {
    fee: { name: 'Комісія за надання кредиту', amount: 1000 },
    key: 'loanIssuanceFee',
  },
];

const loanAmountEl = document.querySelector('.loan-amount__value');
const annuityRadio = document.querySelector('.input--annuity');
const classicRadio = document.querySelector('.input--classic');

annuityRadio.addEventListener('change', handleLoanType);
classicRadio.addEventListener('change', handleLoanType);
updateCalculatorInterface();
renderFees(loanFees);

Object.keys(inputsConfig).forEach(inputKey => {
  const { input, badge } = inputsConfig[inputKey];
  input.addEventListener('input', () => updateThumb(inputKey));
  badge.addEventListener(
    'blur',
    handleBlur(inputKey, inputsConfig[inputKey].range),
  );
});

export function updateSelectedFees(feeKey, isChecked) {
  if (isChecked) {
    selectedFees.push({ key: feeKey, fee: loanFees[feeKey] });
  } else {
    selectedFees = selectedFees.filter(fee => fee.key !== feeKey);
  }

  updateAddOptionsInterface(feeKey);
}

function updateAddOptionsInterface(feeKey) {
  const addOptionsList = document.querySelector('.add-options-list');
  const fee = selectedFees.find(item => item.key === feeKey);

  if (fee) {
    handleFeeUpdate(feeKey, fee, addOptionsList);
  } else {
    handleFeeRemoval(feeKey, addOptionsList);
  }
}

function handleFeeUpdate(feeKey, fee, addOptionsList) {
  const listItem = createFeeItem(feeKey, fee);
  addOptionsList.appendChild(listItem);

  updateTotalFees();

  const totalPayment = calculateTotalPayment();
  updateTotalPaymentDisplay(totalPayment);
  updateLoanCostsDisplay(loanDetails.loanAmount, totalPayment);
}

function handleFeeRemoval(feeKey, addOptionsList) {
  addOptionsList.innerHTML = '';

  const filtered = selectedFees.filter(item => item.key !== feeKey);
  filtered.forEach(fee => {
    const listItem = createFeeItem(feeKey, fee);
    addOptionsList.appendChild(listItem);

    updateTotalFees();

    const totalPayment = calculateTotalPayment();
    updateTotalPaymentDisplay(totalPayment);
    updateLoanCostsDisplay(loanDetails.loanAmount, totalPayment);
  });
}

function updateTotalFees() {
  const totalAmount = selectedFees.reduce(
    (sum, current) => sum + current.fee.amount,
    0,
  );
  loanDetails.totalFees = totalAmount;
}

function createFeeItem(feeKey, fee) {
  const listItem = document.createElement('li');
  listItem.classList.add('add-option-item');
  listItem.setAttribute('data-id', feeKey);
  const labelSpan = document.createElement('span');
  labelSpan.classList.add('item__label');
  labelSpan.textContent = fee.fee.name;
  const valueSpan = document.createElement('span');
  valueSpan.classList.add('item__value');
  valueSpan.textContent = `${fee.fee.amount} грн`;
  listItem.appendChild(labelSpan);
  listItem.appendChild(valueSpan);
  return listItem;
}

function updateThumb(inputKey) {
  updateRange(inputKey);
  handleSpecialCases(inputKey);
  updateCalculatorInterface();
}

function updateRange(inputKey) {
  const { input, thumb, badge } = inputsConfig[inputKey];
  const thumbPercent = (input.value - input.min) / (input.max - input.min);
  document.documentElement.style.setProperty(thumb, thumbPercent);
  badge.value = numberWithSpaces(input.value);
}

function updateLoanType() {
  if (annuityRadio.checked) {
    loanDetails.type = 'annuity';
  } else if (classicRadio.checked) {
    loanDetails.type = 'classic';
  }
}

function updateCalculatorInterface() {
  const totalPayment = calculateTotalPayment();
  const monthlyPayment = calculateMonthlyPayment();
  updateMonthlyPaymentDisplay(monthlyPayment);
  updateTotalPaymentDisplay(totalPayment);
  updateLoanCostsDisplay(loanDetails.loanAmount, totalPayment);
  const realAnnualInterestRate = calculateRealAnnualInterestRate(loanDetails);
  updateRealAnnualInterestRateDisplay(realAnnualInterestRate);
}

function calculateTotalPayment() {
  if (loanDetails.type === 'annuity') {
    return calculateAnnuityTotalPayment(loanDetails);
  } else if (loanDetails.type === 'classic') {
    return calculateClassicTotalPayment(loanDetails);
  }
}

function calculateMonthlyPayment() {
  if (loanDetails.type === 'annuity') {
    return calculateAnnuityMonthlyPayment(loanDetails);
  } else if (loanDetails.type === 'classic') {
    return calculateClassicMonthlyPayment(loanDetails);
  }
}

function handleLoanType() {
  updateLoanType();
  updateCalculatorInterface();
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

function updateMonthlyPaymentDisplay(monthlyPayment) {
  const monthAmountEl = document.querySelector('.month__value');
  monthAmountEl.textContent = numberWithSpaces(monthlyPayment);
}

function updateTotalPaymentDisplay(totalPayment) {
  const totalPaymentEl = document.querySelector('.value--total');
  totalPaymentEl.textContent = `${numberWithSpaces(totalPayment)} грн`;
}

function updateLoanCostsDisplay(loanAmount, totalPayment) {
  const loanCostsEl = document.querySelector('.value--costs');
  loanCostsEl.textContent = `${numberWithSpaces(
    calculateLoanCosts(loanAmount, totalPayment),
  )} грн`;
}

function updateRealAnnualInterestRateDisplay(realRate) {
  const realInterestEl = document.querySelector('.value--real');
  realInterestEl.textContent = `${realRate} %`;
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

function calculateAnnuityTotalPayment(loanDetails) {
  const { loanAmount, annualInterestRate, loanTermInMonths, totalFees } =
    loanDetails;
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const { numerator, denominator } = calculateNumeratorDenominator(
    loanAmount,
    monthlyInterestRate,
    loanTermInMonths,
  );

  const totalPayment = (numerator / denominator) * loanTermInMonths + totalFees;
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

function calculateRealAnnualInterestRate(loanDetails) {
  const { annualInterestRate, loanTermInMonths, totalFees, loanAmount } =
    loanDetails;
  const nominalRateDecimal = annualInterestRate / 100;
  const realAnnualInterestRate =
    Math.pow(1 + nominalRateDecimal / loanTermInMonths, loanTermInMonths) -
    1 +
    totalFees / loanAmount;

  const realAnnualInterestRatePercentage = realAnnualInterestRate * 100;

  return parseFloat(realAnnualInterestRatePercentage.toFixed(2));
}

function calculateClassicMonthlyPayment(loanDetails) {
  const { loanAmount, loanTermInMonths, annualInterestRate } = loanDetails;
  const stablePayment = loanAmount / loanTermInMonths;
  const currentDate = new Date();
  const months = generateMonthsArray(currentDate, loanTermInMonths);

  let left = loanAmount;
  let firstMonthlyPayment;

  for (let i = 0; i < months.length; i++) {
    const daysInMonth = months[i].daysInMonth;
    const daysInYear = months[i].daysInYear;
    const p = (left * annualInterestRate * daysInMonth) / (daysInYear * 100);
    const monthlyPayment = p + stablePayment;

    if (i === 0) {
      firstMonthlyPayment = parseFloat(monthlyPayment.toFixed(0));
    }

    left -= stablePayment;
  }

  return firstMonthlyPayment;
}

function calculateClassicTotalPayment(loanDetails) {
  const { loanAmount, loanTermInMonths, annualInterestRate } = loanDetails;
  const stablePayment = loanAmount / loanTermInMonths;
  const currentDate = new Date();
  const months = generateMonthsArray(currentDate, loanTermInMonths);

  let total = 0;
  let left = loanAmount;

  for (let i = 0; i < months.length; i++) {
    const daysInMonth = months[i].daysInMonth;
    const daysInYear = months[i].daysInYear;
    const p = (left * annualInterestRate * daysInMonth) / (daysInYear * 100);
    const monthlyPayment = p + stablePayment;

    total += parseFloat(monthlyPayment.toFixed(0));
    left -= stablePayment;
  }

  return total;
}

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function generateMonthsArray(startDate, numberOfMonths) {
  const months = [];
  let currentDate = new Date(startDate);

  for (let i = 0; i < numberOfMonths; i++) {
    const month = currentDate.toLocaleString('en-US', { month: 'long' });
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    ).getDate();
    const daysInYear = isLeapYear(currentDate.getFullYear()) ? 366 : 365;

    months.push({ month, daysInMonth, daysInYear });

    // Move to the next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return months;
}

