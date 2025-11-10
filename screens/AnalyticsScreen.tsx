import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell } from 'recharts';
import Icon from '../components/Icon';
import type { Meal } from '../types';

const weightData = [
  { name: '1', kg: 70 },
  { name: '7', kg: 69 },
  { name: '14', kg: 68 },
  { name: '21', kg: 67.5 },
  { name: '28', kg: 67 },
  { name: '31', kg: 67 },
];

const nutritionData = [
  { name: 'M', protein: 120, carbs: 200, fats: 50, calories: (120 * 4) + (200 * 4) + (50 * 9) },
  { name: 'T', protein: 130, carbs: 220, fats: 55, calories: (130 * 4) + (220 * 4) + (55 * 9) },
  { name: 'W', protein: 110, carbs: 180, fats: 60, calories: (110 * 4) + (180 * 4) + (60 * 9) },
  { name: 'T', protein: 140, carbs: 250, fats: 45, calories: (140 * 4) + (250 * 4) + (45 * 9) },
  { name: 'F', protein: 150, carbs: 230, fats: 65, calories: (150 * 4) + (230 * 4) + (65 * 9) },
  { name: 'S', protein: 160, carbs: 280, fats: 70, calories: (160 * 4) + (280 * 4) + (70 * 9) },
  { name: 'S', protein: 100, carbs: 150, fats: 40, calories: (100 * 4) + (150 * 4) + (40 * 9) },
];

const CustomWeightTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white p-2 rounded-md shadow-lg border border-gray-700">
        <p className="font-bold">{`${payload[0].value}kg`}</p>
      </div>
    );
  }
  return null;
};

const CustomNutritionTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0);
      return (
        <div className="bg-gray-900 text-white p-2 px-3 rounded-md shadow-lg border border-gray-700">
          <p className="font-bold text-lg">{total} Kcal</p>
        </div>
      );
    }
    return null;
  };

const AnalyticsScreen: React.FC = () => {
  const [weightPeriod, setWeightPeriod] = useState('90 Days');
  const [nutritionPeriod, setNutritionPeriod] = useState('1 Week');
  const [focusedBar, setFocusedBar] = useState(3);

  return (
    <div className="p-6 space-y-6 text-white">
      <div className="bg-gray-800 rounded-3xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Goal Progress</h2>
          <p className="text-green-400 text-sm">80% Goal achieved</p>
        </div>
        <div className="flex space-x-2 bg-gray-700 p-1 rounded-full mb-6">
          {['90 Days', '6 Months', '1 Year', 'All time'].map(p => (
            <button key={p} onClick={() => setWeightPeriod(p)} className={`flex-1 py-1.5 text-sm rounded-full ${weightPeriod === p ? 'bg-gray-600' : ''}`}>{p}</button>
          ))}
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightData} margin={{ top: 5, right: 20, left: -25, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomWeightTooltip />} cursor={{ stroke: '#4A5568', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Line type="monotone" dataKey="kg" stroke="#A78BFA" strokeWidth={3} dot={false} activeDot={{ r: 8, fill: '#A78BFA', stroke: '#1F2937', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-800 rounded-3xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Nutritions</h2>
          <p className="text-green-400 text-sm">90% This week vs last week</p>
        </div>
        <div className="flex space-x-2 bg-gray-700 p-1 rounded-full mb-6">
          {['1 Week', '2 Week', '3 Week', '1 Month'].map(p => (
            <button key={p} onClick={() => setNutritionPeriod(p)} className={`flex-1 py-1.5 text-sm rounded-full ${nutritionPeriod === p ? 'bg-gray-600' : ''}`}>{p}</button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4 text-center">
            <div>
                <p className="text-3xl font-bold">12780</p>
                <p className="text-sm text-gray-400">Total calories</p>
            </div>
             <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-full px-6 py-2">
                 <p className="text-2xl font-bold">Carbs</p>
             </div>
            <div>
                <p className="text-3xl font-bold">1952</p>
                <p className="text-sm text-gray-400">Daily avg.</p>
            </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={nutritionData} margin={{ top: 20, right: 0, left: -30, bottom: 5 }} onMouseMove={(state) => {
                if (state.isTooltipActive) {
                    // FIX: The activeTooltipIndex from recharts can be a string, so we cast it to a number to match the state type.
                    setFocusedBar(Number(state.activeTooltipIndex ?? -1));
                } else {
                    setFocusedBar(3); // Reset to default focus
                }
            }}>
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomNutritionTooltip />} cursor={{fill: 'transparent'}}/>
              <Bar dataKey="protein" stackId="a" fill="#F87171" radius={[5, 5, 0, 0]} barSize={15} />
              <Bar dataKey="fats" stackId="a" fill="#60A5FA" barSize={15} />
              <Bar dataKey="carbs" stackId="a" fill="#FBBF24" barSize={15}>
              {
                nutritionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === focusedBar ? '#FF8C00' : '#FBBF24'}/>
                ))
              }
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsScreen;