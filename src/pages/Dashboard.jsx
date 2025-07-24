import React, { useEffect, useState } from 'react';
import {Typography,ToggleButtonGroup,ToggleButton,Paper,Box,Tooltip} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { getSummaryData } from '../utils/storage';
import dayjs from 'dayjs';
import { TextField, MenuItem } from '@mui/material'; 


const Dashboard = () => {
  const [period, setPeriod] = useState('monthly');
  const [data, setData] = useState({ grouped: [], chart: [], totalAll: 0, totalPeriod: 0 });
  const [selectedMonth, setSelectedMonth] = useState('All');

  useEffect(() => {
    setData(getSummaryData(period));
  }, [period]);

  const allMonths = Array.from(
    new Set(data.chart.map(item => dayjs(item.label).format('MMMM YYYY')))
  );
  const monthOptions = ['All', ...allMonths];
  const filteredChart = [];
  const aggregated = {};
  const pieCategoryMap = {};
  let totalSelectedMonth = 0;

  data.chart.forEach(entry => {
    const entryDate = dayjs(entry.label);
    const entryMonth = entryDate.format('MMMM YYYY');
    const targetMonth = selectedMonth;

    const isInMonth = targetMonth === 'All' || entryMonth === targetMonth;
    if (isInMonth) {
      filteredChart.push(entry);
      totalSelectedMonth += entry.amount;

      const xLabel = entry.label;
      aggregated[xLabel] = (aggregated[xLabel] || 0) + entry.amount;
      const category = entry.category || 'Uncategorized';
      pieCategoryMap[category] = (pieCategoryMap[category] || 0) + entry.amount;
    }
  });

  const lineData = Object.entries(aggregated).map(([x, y]) => ({ x, y }));
  const pieData = Object.entries(pieCategoryMap).map(([category, amount], index) => ({
    id: index,
    value: amount,
    label: category,
  }));

  return (
    <Box sx={{ p: 3 ,bgcolor: '#e3f1d0ff', minHeight: '100vh' }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#2e7d32', fontWeight: 600 }}>📊 Dashboard</Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 , justifyContent: 'center', width: 1840}}>
        <Paper elevation={2} sx={{ p: 3, minWidth: 250, bgcolor: '#e8f5e9' }}>
            <ToggleButtonGroup
                value={period}
                exclusive
                onChange={(e, val) =>{
                  if (!val) return;
                  setPeriod(val);
                  if (val === 'weekly'){
                    setSelectedMonth('All');
                  }
                }}
                color="success"
                >
                <Tooltip title='View Daily Spending'>
                  <ToggleButton value="daily">Daily</ToggleButton>
                </Tooltip> 
                <Tooltip title='View Weekly Spending'>
                <ToggleButton value="weekly">Weekly</ToggleButton>
                </Tooltip>
                <Tooltip title='View Monthly Spending'>
                <ToggleButton value="monthly">Monthly</ToggleButton>
                </Tooltip>
            </ToggleButtonGroup>
        </Paper>
        <Paper elevation={2} sx={{ p: 2, minWidth: 240, bgcolor: '#e8f5e9' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Total Spending (All-Time)
            </Typography>
            <Typography variant="h5" sx={{ color: '#2e7d32', fontWeight: 600 }}>
            ฿{(data?.totalAll ?? 0).toFixed(2)}
            </Typography>
        </Paper>
        <Paper elevation={2} sx={{ p: 2, minWidth: 240, bgcolor: '#f1f8e9' }}>
          <TextField
          disabled={period === 'weekly'}
          fullWidth
          select
          label="Filter by Month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {monthOptions.map((month, idx) => (
            <MenuItem key={idx} value={month}>
              {month}
            </MenuItem>
          ))}
          </TextField>
        </Paper>
        <Paper elevation={2} sx={{ p: 2, minWidth: 250, bgcolor: '#f1f8e9' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Total This Monthly
            </Typography>
            <Typography variant="h5" sx={{ color: '#558b2f', fontWeight: 600 }}>
              ฿{totalSelectedMonth.toFixed(2)}
            </Typography>

        </Paper>
        </Box>

    
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center', mt: 4 }}>
        <Paper elevation={2} sx={{ p: 3, minWidth: 520, bgcolor: '#f1f8e9' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32',fontWeight: 600  }}>
            📈 Spending Over Time
            </Typography>
            {selectedMonth === 'All' || period === 'daily' ? (
              <LineChart
                xAxis={[{ scaleType: 'point', data: lineData.map(item => item.x) }]}
                series={[{ data: lineData.map(item => item.y), color: '#4caf50', area: true }]}
                width={500}
                height={300}
              />
            ) : (
              <BarChart
                xAxis={[{ data: lineData.map(item => item.x), scaleType: 'band' }]}
                series={[{ data: lineData.map(item => item.y), color: '#81c784' }]}
                width={500}
                height={300}
              />
            )}

        </Paper>

        <Paper elevation={2} sx={{ p: 3, minWidth: 420, bgcolor: '#e8f5e9' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32',fontWeight: 600  }}>
            🥧 Spending by Category
            </Typography>
            <PieChart
            series={[{
                data: pieData,
                highlightScope: { faded: 'global', highlighted: 'item' },
                innerRadius: 50,
                outerRadius: 100,
            }]}
            width={400}
            height={300}
            />
        </Paper>
        </Box>

      </Box>
  );
};

export default Dashboard;
