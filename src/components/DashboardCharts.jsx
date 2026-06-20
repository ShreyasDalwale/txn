import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useCategories } from '../hooks/useCategories';
import { TRANSACTION_CATEGORIES } from '../constants/categories';

// Helper to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Helper to format date label
const formatChartDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const TrendChart = ({ transactions }) => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Group transactions by date
  const getTrendData = () => {
    if (!transactions || transactions.length === 0) return [];

    // Sort transactions oldest to newest for trend line
    const sortedTxns = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Group by day
    const dayMap = {};
    sortedTxns.forEach((t) => {
      const dateKey = t.date.split('T')[0];
      if (!dayMap[dateKey]) {
        dayMap[dateKey] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        dayMap[dateKey].income += parseFloat(t.amount || 0);
      } else if (t.type === 'expense') {
        dayMap[dateKey].expense += parseFloat(t.amount || 0);
      }
    });

    const dates = Object.keys(dayMap).sort();
    if (dates.length === 0) return [];

    // If we have very few dates, let's pad them or just display
    let runningBalance = 0;
    const points = dates.map((date) => {
      const dayData = dayMap[date];
      runningBalance += (dayData.income - dayData.expense);
      return {
        date,
        label: formatChartDate(date),
        income: dayData.income,
        expense: dayData.expense,
        balance: runningBalance,
      };
    });

    return points;
  };

  const points = getTrendData();

  if (points.length < 2) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 text-center backdrop-blur-sm">
        <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">Need at least 2 days of transactions to show trends.</p>
      </div>
    );
  }

  // Dimensions
  const svgWidth = 500;
  const svgHeight = 220;
  const margin = { top: 20, right: 20, bottom: 35, left: 45 };
  const chartWidth = svgWidth - margin.left - margin.right;
  const chartHeight = svgHeight - margin.top - margin.bottom;

  // Max values for scale
  const maxIncome = Math.max(...points.map((p) => p.income), 10);
  const maxExpense = Math.max(...points.map((p) => p.expense), 10);
  const maxBalance = Math.max(...points.map((p) => p.balance), 0);
  const minBalance = Math.min(...points.map((p) => p.balance), 0);
  
  // Find extreme value for Y scale
  const absMaxY = Math.max(maxIncome, maxExpense, Math.abs(maxBalance), Math.abs(minBalance), 100);
  const minYVal = minBalance < 0 ? minBalance * 1.1 : 0;
  const maxYVal = absMaxY * 1.1;
  const yRange = maxYVal - minYVal;

  // Calculate coordinates for points
  const coords = points.map((p, idx) => {
    const x = margin.left + (idx / (points.length - 1)) * chartWidth;
    
    // Y scaling helper
    const getY = (val) => {
      return margin.top + chartHeight - ((val - minYVal) / yRange) * chartHeight;
    };

    return {
      x,
      yIncome: getY(p.income),
      yExpense: getY(p.expense),
      yBalance: getY(p.balance),
      raw: p,
    };
  });

  // Build SVG Paths
  const buildLinePath = (yKey) => {
    return coords.reduce((path, curr, idx) => {
      const y = curr[yKey];
      return idx === 0 ? `M ${curr.x} ${y}` : `${path} L ${curr.x} ${y}`;
    }, '');
  };

  const buildAreaPath = (yKey) => {
    const linePath = buildLinePath(yKey);
    if (!linePath) return '';
    const bottomY = margin.top + chartHeight - ((0 - minYVal) / yRange) * chartHeight;
    return `${linePath} L ${coords[coords.length - 1].x} ${bottomY} L ${coords[0].x} ${bottomY} Z`;
  };

  const incomeLinePath = buildLinePath('yIncome');
  const incomeAreaPath = buildAreaPath('yIncome');
  const expenseLinePath = buildLinePath('yExpense');
  const expenseAreaPath = buildAreaPath('yExpense');
  const balanceLinePath = buildLinePath('yBalance');

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    
    // Scale container coord to SVG space (500 width viewBox)
    const svgX = (clientX / rect.width) * svgWidth;
    
    // Find closest point by X coordinate
    let closestIdx = 0;
    let minDiff = Infinity;
    coords.forEach((coord, idx) => {
      const diff = Math.abs(coord.x - svgX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    setHoverIndex(closestIdx);

    // Tooltip position (keep within SVG coordinates)
    const xOffset = coords[closestIdx].x > svgWidth - 160 ? -150 : 15;
    setTooltipPos({
      x: coords[closestIdx].x + xOffset,
      y: Math.min(coords[closestIdx].yBalance - 10, svgHeight - 110),
    });
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  // Generate grid values for Y-axis (4 levels)
  const gridLines = [];
  for (let i = 0; i <= 3; i++) {
    const ratio = i / 3;
    const val = minYVal + ratio * yRange;
    const y = margin.top + chartHeight - ratio * chartHeight;
    gridLines.push({ y, val });
  }

  // Generate X-axis labels (max 5 items)
  const xLabelsCount = Math.min(points.length, 5);
  const xLabels = [];
  for (let i = 0; i < xLabelsCount; i++) {
    const idx = Math.round((i / (xLabelsCount - 1)) * (points.length - 1));
    if (coords[idx]) {
      xLabels.push({
        x: coords[idx].x,
        label: coords[idx].raw.label,
      });
    }
  }

  return (
    <div className="relative rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 backdrop-blur-sm shadow-none transition-all hover:border-slate-300 dark:hover:border-zinc-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Financial Performance</p>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 tracking-tight">Cash Flow Trend</h3>
        </div>
        <div className="flex gap-4 text-xs font-bold">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Income
          </span>
          <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
            <span className="h-2 w-2 rounded-full bg-rose-500"></span> Expense
          </span>
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-350">
            <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-zinc-300"></span> Net Balance
          </span>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full cursor-crosshair select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
          <defs>
            {/* Gradients */}
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>
            {/* Glow Filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#11998e" floodOpacity="0.3" />
            </filter>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#f43f5e" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* Grid lines */}
          {gridLines.map((line, i) => (
            <g key={i}>
              <line 
                x1={margin.left} 
                y1={line.y} 
                x2={svgWidth - margin.right} 
                y2={line.y} 
                className="stroke-slate-100 dark:stroke-zinc-800/80 stroke-1"
                strokeDasharray="4 4"
              />
              <text 
                x={margin.left - 8} 
                y={line.y + 4} 
                className="fill-slate-400 dark:fill-slate-500 font-mono text-[9px] font-bold text-right"
                textAnchor="end"
              >
                ${Math.abs(line.val) >= 1000 ? `${(line.val / 1000).toFixed(1)}k` : Math.round(line.val)}
              </text>
            </g>
          ))}

          {/* Area under Income and Expense */}
          {incomeAreaPath && (
            <path d={incomeAreaPath} fill="url(#incomeGrad)" />
          )}
          {expenseAreaPath && (
            <path d={expenseAreaPath} fill="url(#expenseGrad)" />
          )}

          {/* Trend Lines */}
          {incomeLinePath && (
            <path 
              d={incomeLinePath} 
              fill="none" 
              className="stroke-emerald-500 dark:stroke-emerald-400 stroke-2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {expenseLinePath && (
            <path 
              d={expenseLinePath} 
              fill="none" 
              className="stroke-rose-500 dark:stroke-rose-400 stroke-2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {balanceLinePath && (
            <path 
              d={balanceLinePath} 
              fill="none" 
              className="stroke-slate-900 dark:stroke-white stroke-2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
            />
          )}

          {/* X Axis Labels */}
          {xLabels.map((l, i) => (
            <g key={i}>
              <text 
                x={l.x} 
                y={svgHeight - 12} 
                className="fill-slate-450 dark:fill-slate-500 text-[9px] font-bold"
                textAnchor="middle"
              >
                {l.label}
              </text>
              <line 
                x1={l.x} 
                y1={svgHeight - 32} 
                x2={l.x} 
                y2={svgHeight - 36} 
                className="stroke-slate-200 dark:stroke-zinc-800 stroke-1"
              />
            </g>
          ))}

          {/* Interactive Guide Line and Hover Points */}
          {hoverIndex !== null && coords[hoverIndex] && (
            <g>
              <line 
                x1={coords[hoverIndex].x} 
                y1={margin.top} 
                x2={coords[hoverIndex].x} 
                y2={svgHeight - margin.bottom} 
                className="stroke-slate-350 dark:stroke-zinc-700 stroke-1.5"
                strokeDasharray="2 2"
              />
              
              {/* Highlight Circle for Running Balance */}
              <circle 
                cx={coords[hoverIndex].x} 
                cy={coords[hoverIndex].yBalance} 
                r="6" 
                className="fill-slate-900 dark:fill-white stroke-2 stroke-slate-50 dark:stroke-zinc-900"
              />

              {/* Highlight Circle for Income */}
              <circle 
                cx={coords[hoverIndex].x} 
                cy={coords[hoverIndex].yIncome} 
                r="4.5" 
                className="fill-emerald-500 stroke-1.5 stroke-white dark:stroke-zinc-900"
              />

              {/* Highlight Circle for Expense */}
              <circle 
                cx={coords[hoverIndex].x} 
                cy={coords[hoverIndex].yExpense} 
                r="4.5" 
                className="fill-rose-500 stroke-1.5 stroke-white dark:stroke-zinc-900"
              />
            </g>
          )}
        </svg>

        {/* HTML Tooltip overlaid inside chart bounds */}
        {hoverIndex !== null && coords[hoverIndex] && (
          <div 
            className="absolute z-30 pointer-events-none rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 p-3.5 shadow-xl backdrop-blur-md min-w-[145px]"
            style={{ 
              left: `${(tooltipPos.x / svgWidth) * 100}%`,
              top: `${(tooltipPos.y / svgHeight) * 100}%` 
            }}
          >
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
              {coords[hoverIndex].raw.date}
            </p>
            <div className="space-y-1 text-[11px] font-semibold text-slate-650 dark:text-slate-300">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400 dark:text-slate-500">Income:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                  {formatCurrency(coords[hoverIndex].raw.income)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400 dark:text-slate-500">Expense:</span>
                <span className="text-rose-600 dark:text-rose-400 font-extrabold">
                  {formatCurrency(coords[hoverIndex].raw.expense)}
                </span>
              </div>
              <div className="border-t border-slate-100 dark:border-zinc-850 my-1 pt-1 flex items-center justify-between gap-4">
                <span className="text-slate-500 dark:text-slate-400">Net Bal:</span>
                <span className={`font-extrabold ${coords[hoverIndex].raw.balance >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-500'}`}>
                  {formatCurrency(coords[hoverIndex].raw.balance)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

TrendChart.propTypes = {
  transactions: PropTypes.array.isRequired,
};

export const CategoryBreakdownDonut = ({ userId, transactions }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const { categories } = useCategories(userId);

  // Group transactions by category and calculate total expense
  const getCategoryData = () => {
    const expensesOnly = transactions.filter((t) => t.type === 'expense');
    const totalExpenses = expensesOnly.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
    if (totalExpenses === 0) return { data: [], total: 0 };

    const catSums = {};
    expensesOnly.forEach((t) => {
      const catId = t.categoryId || t.category || 'other';
      catSums[catId] = (catSums[catId] || 0) + parseFloat(t.amount || 0);
    });

    const getDetails = (catId) => {
      const fsCategory = categories?.find((c) => c.id === catId);
      if (fsCategory) {
        return {
          name: fsCategory.name,
          icon: fsCategory.icon || '📦',
          color: fsCategory.color || '#9b9b9b',
        };
      }
      
      const staticCat = TRANSACTION_CATEGORIES.find((cat) => cat.value === catId);
      if (staticCat) {
        const emojiMatch = staticCat.label.match(/^([^\s]+)/);
        const labelText = staticCat.label.replace(/^([^\s]+)\s+/, '');
        return {
          name: labelText,
          icon: emojiMatch ? emojiMatch[0] : '📦',
          color: staticCat.value === 'other' ? '#9b9b9b' : '#11998e',
        };
      }

      return {
        name: catId.charAt(0).toUpperCase() + catId.slice(1),
        icon: '📦',
        color: '#9b9b9b',
      };
    };

    const data = Object.keys(catSums).map((catId) => {
      const amount = catSums[catId];
      const percent = (amount / totalExpenses) * 100;
      const details = getDetails(catId);
      return {
        id: catId,
        amount,
        percent,
        ...details,
      };
    }).sort((a, b) => b.amount - a.amount);

    return { data, total: totalExpenses };
  };

  const { data: chartData, total: totalExpenses } = getCategoryData();

  if (totalExpenses === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 text-center backdrop-blur-sm">
        <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">No expense records found to generate category breakdowns.</p>
      </div>
    );
  }

  // Draw SVG Donut segments
  // Center: 50, 50. Radius: 36. Circumference: 2 * pi * 36 = 226.195
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 backdrop-blur-sm shadow-none transition-all hover:border-slate-300 dark:hover:border-zinc-700">
      <div className="mb-6">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Expense Distribution</p>
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 tracking-tight">Category Breakdown</h3>
      </div>

      <div className="grid gap-6 md:grid-cols-5 items-center">
        {/* SVG Donut Chart */}
        <div className="md:col-span-2 relative flex justify-center items-center">
          <svg viewBox="0 0 100 100" className="w-40 h-40 transform -rotate-90">
            {/* Background Circle */}
            <circle 
              cx="50" 
              cy="50" 
              r={radius} 
              fill="transparent" 
              className="stroke-slate-100 dark:stroke-zinc-800 stroke-[9]" 
            />
            {/* Segments */}
            {chartData.map((seg, idx) => {
              const dashArray = `${(seg.percent / 100) * circ} ${circ}`;
              const dashOffset = circ - (accumulatedPercent / 100) * circ;
              accumulatedPercent += seg.percent;

              const isHovered = hoveredIdx === idx;

              return (
                <circle
                  key={seg.id}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={isHovered ? 12 : 9.5}
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>

          {/* Central Label */}
          <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none text-center">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
              ${totalExpenses >= 10000 ? `${(totalExpenses / 1000).toFixed(1)}k` : totalExpenses.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Legend Panel */}
        <div className="md:col-span-3 space-y-3 max-h-60 overflow-y-auto pr-1">
          {chartData.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div 
                key={item.id}
                className={`flex flex-col gap-1.5 p-2 rounded-xl transition duration-150 ${
                  isHovered ? 'bg-slate-50 dark:bg-zinc-850/40' : ''
                }`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2 min-w-0">
                    <span 
                      className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-400 dark:text-slate-500 mr-0.5">{item.icon}</span>
                    <span className="text-slate-705 dark:text-slate-200 truncate">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-900 dark:text-white">{formatCurrency(item.amount)}</span>
                    <span className="text-slate-400 dark:text-slate-500 text-[10px] ml-1.5 font-mono">
                      {item.percent.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Progress bar visual indicator */}
                <div className="w-full h-1 bg-slate-100 dark:bg-zinc-850 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${item.percent}%`,
                      backgroundColor: item.color 
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

CategoryBreakdownDonut.propTypes = {
  userId: PropTypes.string,
  transactions: PropTypes.array.isRequired,
};
