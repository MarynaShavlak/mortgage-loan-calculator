function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function generateMonthsArray(startDate, numberOfMonths) {
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
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return months;
}
