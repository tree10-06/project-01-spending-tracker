import categoryData from '../data/spending_data.json';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
dayjs.extend(weekOfYear);

export const getSpendings = () =>
  JSON.parse(localStorage.getItem('spendings') || '[]');

export const addSpending = (entry) => {
  const entries = getSpendings();
  entries.push(entry);
  localStorage.setItem('spendings', JSON.stringify(entries));
};

export const getCategories = () => {
  const baseCategories = Array.from(new Set(categoryData.map(item => item.category)));
  const userCategories = JSON.parse(localStorage.getItem('categories') || '[]');
  return [...new Set([...baseCategories, ...userCategories])];
};

export const addCategory = (newCategory) => {
  const list = JSON.parse(localStorage.getItem('categories') || '[]');
  if (!list.includes(newCategory)) {
    list.push(newCategory);
    localStorage.setItem('categories', JSON.stringify(list));
  }
};

export const getSummaryData = (period) => {
  const data = getSpendings();
  const grouped = {};
  const chartMap = {};
  let totalAll = 0;
  let totalPeriod = 0;
  const now = dayjs();

  const getLabel = (date) => {
    const d = dayjs(date);
    if (period === 'daily') return d.format('YYYY-MM-DD');
    if (period === 'weekly') return `Week ${d.week()} ${d.year()}`;
    if (period === 'monthly') return d.format('MMMM YYYY');
    return d.format('YYYY-MM-DD');
  };

  data.forEach(({ date, category = 'Uncategorized', amount }) => {
    const entryDate = dayjs(date);
    totalAll += amount;

    grouped[category] = (grouped[category] || 0) + amount;

    const label = getLabel(entryDate);
    if (!chartMap[label]) chartMap[label] = [];
    chartMap[label].push({ category, amount });

    const isSame =
      (period === 'daily' && entryDate.isSame(now, 'day')) ||
      (period === 'weekly' && entryDate.isSame(now, 'week')) ||
      (period === 'monthly' && entryDate.isSame(now, 'month'));

    if (isSame) totalPeriod += amount;
  });

  const chart = [];
  Object.entries(chartMap).forEach(([label, entries]) => {
    entries.forEach(({ category, amount }) => {
      chart.push({ label, category, amount });
    });
  });

  return {
    totalAll,
    totalPeriod,
    grouped: Object.entries(grouped).map(([category, amount]) => ({ category, amount })),
    chart,
  };
};
