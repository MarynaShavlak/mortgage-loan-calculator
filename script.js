import { loanFees } from './loanFeesData.js';
import { renderFees } from './renderFees.js';
import { inputsConfig } from './inputs.js';
import { createFeeItem } from './createItems.js';
import { numberWithSpaces } from './utils.js';
import {
  calculateLoanAmount,
  calculateMonthlyPayment,
  calculateRealAnnualInterestRate,
  calculateTotalPayment,
  calculateLoanCosts
} from './calculations.js';

export const loanDetails = {
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
const iconFees = document.querySelector('.icon-fees');
const iconOptions = document.querySelector('.icon-label');
iconFees.addEventListener('click', toggleFeesListVisibility);
iconOptions.addEventListener('click', toggleAddOptionsVisibility);

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

function toggleFeesListVisibility() {
  iconFees.classList.toggle('icon-fees--close');
  const list = document.querySelector('.feesList');
  list.classList.toggle('feesList--close');
}

function toggleAddOptionsVisibility() {
  iconOptions.classList.toggle('icon-label--close');
  const list = document.querySelector('.add-options-list');
  list.classList.toggle('add-options-list--close');
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
  updateLoanDetails();
}

function handleFeeRemoval(feeKey, addOptionsList) {
  clearAddOptionsList(addOptionsList);

  const filtered = selectedFees.filter(item => item.key !== feeKey);
  filtered.forEach(fee => {
    const listItem = createFeeItem(feeKey, fee);
    addOptionsList.appendChild(listItem);
  });
  updateLoanDetails();
}

function clearAddOptionsList(addOptionsList) {
  addOptionsList.innerHTML = '';
}

function updateLoanDetails() {
  updateTotalFees();
  updateLoanResults();
}

function updateTotalFees() {
  const totalAmount = selectedFees.reduce(
    (sum, current) => sum + current.fee.amount,
    0,
  );
  loanDetails.totalFees = totalAmount;
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
  const monthlyPayment = calculateMonthlyPayment();
  updateMonthlyPaymentDisplay(monthlyPayment);
  const realAnnualInterestRate = calculateRealAnnualInterestRate(loanDetails);
  updateRealAnnualInterestRateDisplay(realAnnualInterestRate);
  updateLoanResults();
}

function updateLoanResults() {
  const totalPayment = calculateTotalPayment();
  updateTotalPaymentDisplay(totalPayment);
  updateLoanCostsDisplay(loanDetails.loanAmount, totalPayment);
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

function updateLoanAmount(loanAmount) {
  loanAmountEl.textContent = numberWithSpaces(loanAmount);
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
