const totalCostInput= document.querySelector('#total-cost');
const advancePaymentInput= document.querySelector('#advance-payment');
const creditTermInput= document.querySelector('#credit-term-range');

totalCostInput.addEventListener('input', function() {
      const thumbPercent = (this.value - this.min) / (this.max - this.min);
      document.documentElement.style.setProperty('--thumb-percent', thumbPercent);
});
advancePaymentInput.addEventListener('input', function() {
      const thumbPercent = (this.value - this.min) / (this.max - this.min);
      document.documentElement.style.setProperty('--thumb-percent-2', thumbPercent);
});
creditTermInput.addEventListener('input', function() {
      const thumbPercent = (this.value - this.min) / (this.max - this.min);
      document.documentElement.style.setProperty('--thumb-percent-3', thumbPercent);
});