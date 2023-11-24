const inputs = {
      totalCost: document.querySelector('#total-cost'),
      advancePayment: document.querySelector('#advance-payment'),
      creditTerm: document.querySelector('#credit-term-range'),
};

const inputsBadges = {
      totalCost: document.querySelector('#total-cost-badge'),
      advancePayment: document.querySelector('#advance-payment-badge'),
      creditTerm: document.querySelector('#credit-term-range-badge'),
}
const thumbs = {
      totalCost: '--thumb-percent',
      advancePayment: '--thumb-percent-2',
      creditTerm: '--thumb-percent-3',
};

const loanAmountEl = document.querySelector('.loan-amount__value');

    
Object.keys(inputs).forEach((inputKey) => {
      inputs[inputKey].addEventListener('input', () => updateThumb(inputKey));
});
    
    
Object.entries(inputsBadges).forEach(([inputKey, inputElement]) => {
      let minValue, maxValue;
   
      switch (inputKey) {
        case 'totalCost':
          minValue = 100000;
          maxValue = 10000000;
          break;
        case 'advancePayment':
          minValue = 30;
          maxValue = 90;
          break;
        case 'creditTerm':
          minValue = 12;
          maxValue = 240;
          break;
        default:
          minValue = 0;
          maxValue = Infinity;
      }
    
      inputElement.addEventListener('blur', handleBlur(inputKey, minValue, maxValue));
});

function updateThumb(inputKey) {
      const thumbPercent = (inputs[inputKey].value - inputs[inputKey].min) / (inputs[inputKey].max - inputs[inputKey].min);
      document.documentElement.style.setProperty(thumbs[inputKey], thumbPercent);
      inputsBadges[inputKey].value = numberWithSpaces(inputs[inputKey].value);
      if (inputKey === 'totalCost' || inputKey === 'advancePayment') {
            updateLoanAmount();
      }

}

function updateLoanAmount() {
      const totalCost = parseFloat(inputs.totalCost.value) || 0;
      const advancePayment = parseFloat(inputs.advancePayment.value) || 0;
      const loanAmount = totalCost - (totalCost * advancePayment / 100);
      loanAmountEl.textContent = numberWithSpaces(loanAmount);
}

function numberWithSpaces(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
     
function  handleBlur(inputKey, minValue, maxValue) {
         return function () {
        const cleanedValue = this.value.replace(/[^\d\s]/g, '');
        const trimmedValue = cleanedValue.replace(/\s/g, '');
        const clampedValue = Math.min(Math.max(parseInt(trimmedValue, 10), minValue), maxValue);
        console.log('clampedValue: ', clampedValue);
        console.log('inputKey: ', inputKey);
        inputsBadges[inputKey].value = numberWithSpaces(clampedValue);
        inputs[inputKey].value = clampedValue;
        updateThumb(inputKey);
      };
};

