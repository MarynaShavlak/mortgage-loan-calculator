export function createFeeItem(feeKey, fee) {
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