import { updateSelectedFees } from "./script.js";

export function renderFees(loanFees) {
  const feesListElement = document.querySelector('.feesList');

  for (const feeKey in loanFees) {
    if (loanFees.hasOwnProperty(feeKey)) {
      const fee = loanFees[feeKey];
      const listItem = createFeeListItem(feeKey, fee);
      feesListElement.appendChild(listItem);
    }
  }
}

function createFeeListItem(feeKey, fee) {
  const listItem = document.createElement('li');
  listItem.className = 'feesList__item';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'fee__checkbox';
  checkbox.id = feeKey;
  checkbox.addEventListener('change', function () {
    updateSelectedFees(feeKey, checkbox.checked);
  })
  const label = document.createElement('label');
  label.className = 'feesList__label';
  const span = document.createElement('span');
  span.textContent = `${fee.name}`;
  const checkIcon = document.createElement('i');
  checkIcon.className = 'fa-solid fa-check fee__checkbox--custom';
  label.appendChild(checkbox);
  label.appendChild(checkIcon);
  label.appendChild(span);

  listItem.appendChild(label);

  return listItem;
}