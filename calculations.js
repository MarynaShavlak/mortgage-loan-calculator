import { generateMonthsArray } from './date.js';
import { loanDetails } from './script.js';
import { inputsConfig } from './inputs.js';

export function calculateTotalPayment() {
  if (loanDetails.type === 'annuity') {
    return calculateAnnuityTotalPayment(loanDetails);
  } else if (loanDetails.type === 'classic') {
    return calculateClassicTotalPayment(loanDetails);
  }
}

export function calculateMonthlyPayment() {
  if (loanDetails.type === 'annuity') {
    return calculateAnnuityMonthlyPayment(loanDetails);
  } else if (loanDetails.type === 'classic') {
    return calculateClassicMonthlyPayment(loanDetails);
  }
}

export function calculateLoanAmount() {
  const totalCost = parseFloat(inputsConfig.totalCost.input.value) || 0;
  const advancePayment =
    parseFloat(inputsConfig.advancePayment.input.value) || 0;
  const loanAmount = totalCost - (totalCost * advancePayment) / 100;
  return loanAmount;
}


export function calculateAnnuityMonthlyPayment(loanDetails) {
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

export function calculateAnnuityTotalPayment(loanDetails) {
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

export function calculateLoanCosts(loanAmount, totalPayment) {
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

export function calculateRealAnnualInterestRate(loanDetails) {
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

export function calculateClassicMonthlyPayment(loanDetails) {
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

export function calculateClassicTotalPayment(loanDetails) {
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
