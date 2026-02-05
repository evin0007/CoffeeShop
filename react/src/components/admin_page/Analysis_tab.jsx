import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Coffee, Users } from 'lucide-react';

const PIE_COLORS = ['#2D1B14', '#D4A373'];

const Analysis = () => {
  const [latest, setLatest] = useState(null);
  const [yesterday, setYesterday] = useState(null);
  const [lineData, setLineData] = useState([]);
  const [customers, setCustomers] = useState(0);
  const [pieData, setPieData] = useState([]);

  const percentChange = (today, yesterday) => {
    const t = parseFloat(today) || 0;
    const y = parseFloat(yesterday) || 0;
    if (y === 0) return '0%';
    return (((t - y) / y) * 100).toFixed(1) + '%';
  };

  useEffect(() => {
    fetch(window.location.origin + "/api/revenue")
      .then(res => res.json())
      .then(({ latest, history }) => {
        setLatest(latest);
        if (history && history.length > 0) {
          setYesterday(history[1] || history[0]);
          const formattedHistory = [...history].reverse().map(i => ({
            name: new Date(i.created_at).toLocaleDateString('en-US', {
              weekday: 'short',
            }),
            sales: Number(i.total_price),
          }));
          setLineData(formattedHistory);
        }
      })
      .catch(err => console.error('Error fetching revenue:', err));

    fetch(window.location.origin + "/api/customers-records")
      .then(res => res.json())
      .then(orders => {
        if (!Array.isArray(orders)) return;

        const normalize = s => s?.toUpperCase().trim();
        const dineIn = orders.filter(o => normalize(o.status) === 'DINE-IN').length;
        const takeOut = orders.filter(o =>
          ['TAKE-OUT', 'TAKE OUT'].includes(normalize(o.status))
        ).length;

        setCustomers(orders.length);
        setPieData([
          { name: 'Dine-In', value: dineIn },
          { name: 'Take-Out', value: takeOut },
        ]);
      })
      .catch(err => console.error('Error fetching customers:', err));
  }, []);

  return (
    <div className="p-5 bg-[#F8F5F2] rounded-2xl min-h-screen text-[#2D1B14]">
      <header className="mb-8">
        <h2 className="text-3xl font-serif italic font-bold">Analysis.</h2>
        <p className="text-stone-400 text-[10px] tracking-widest uppercase">
          Visual Performance Insights
        </p>  
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Daily Revenue"
          value={`₱${latest?.total_price ?? '0.00'}`}
          trend={percentChange(latest?.total_price, yesterday?.total_price)}
          icon="₱"
          color="bg-orange-50"
          iconColor="text-orange-500"
        />

        <StatCard
          title="Total Orders"
          value={latest?.quantity ?? 0}
          trend={percentChange(latest?.quantity, yesterday?.quantity)}
          icon={<Coffee size={20} />}
          color="bg-blue-50"
          iconColor="text-blue-500"
        />

        <StatCardStatic
          title="Total Customers"
          value={customers}
          icon={<Users size={20} />}
          color="bg-purple-50"
          iconColor="text-purple-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <ChartCard title="Revenue Velocity" span>
          {lineData.length > 0 ? (
            <LineChart
              data={lineData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#A8A29E' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#A8A29E' }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#2D1B14"
                strokeWidth={4}
                dot={{ r: 4, fill: '#2D1B14' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          ) : (
            <div className="h-full flex items-center justify-center text-stone-400">
              Loading chart…
            </div>
          )}
        </ChartCard>

        <ChartCard title="Order Type Split">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              label={({ percent }) =>
                percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''
              }
            >
              {pieData.map((_, index) => (
                <Cell
                  key={index}
                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                  stroke="none"
                />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} />
            <Tooltip />
          </PieChart>
        </ChartCard>
      </div>
    </div>
  );
};
const CardBase = ({ title, children, icon, color, iconColor }) => (
  <div className="bg-white p-6 rounded-[2.5rem] shadow-sm flex justify-between items-start">
    <div className="flex-1">
      <p className="text-stone-400 text-xs font-bold uppercase mb-2 tracking-tight">
        {title}
      </p>
      {children}
    </div>
    <div
      className={`p-4 ${color} ${iconColor} rounded-2xl flex items-center justify-center min-w-[50px] font-bold text-lg`}
    >
      {icon}
    </div>
  </div>
);

const StatCard = ({ title, value, trend, ...props }) => (
  <CardBase title={title} {...props}>
    <h4 className="text-3xl font-serif font-bold mb-1">{value}</h4>
    <span
      className={`text-xs font-bold ${
        trend.includes('-') ? 'text-red-500' : 'text-emerald-500'
      }`}
    >
      {trend}
      <span className="text-stone-300 font-normal ml-1">vs yesterday</span>
    </span>
  </CardBase>
);

const StatCardStatic = ({ title, value, ...props }) => (
  <CardBase title={title} {...props}>
    <h4 className="text-3xl font-serif font-bold">{value}</h4>
  </CardBase>
);

/* 🔥 FIXED CHART CONTAINER */
const ChartCard = ({ title, children, span }) => (
  <div
    className={`bg-white p-8 rounded-[2.5rem] shadow-sm flex flex-col min-w-0 ${
      span ? 'xl:col-span-2' : ''
    }`}
  >
    <h3 className="text-xl font-serif font-bold mb-6">{title}</h3>

    {/* IMPORTANT: flex-1 + min-h */}
    <div className="flex-1 min-h-[320px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);

export default Analysis;
