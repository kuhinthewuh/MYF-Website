'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function AnalyticsChart({ data }: { data: any[] }) {
  // If no data, show a flat line or empty state
  if (!data || data.length === 0) {
    return (
      <div className="h-72 w-full flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100">
        <p className="text-gray-400 font-medium">No traffic data available yet.</p>
      </div>
    );
  }

  return (
    <div className="h-80 w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00C9B1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00C9B1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            allowDecimals={false}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
            cursor={{ stroke: '#00C9B1', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Area 
            type="monotone" 
            dataKey="views" 
            stroke="#00C9B1" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorViews)" 
            activeDot={{ r: 6, fill: '#00C9B1', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
