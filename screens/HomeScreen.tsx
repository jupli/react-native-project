
import React from 'react';
import type { Meal } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Icon from '../components/Icon';

interface HomeScreenProps {
  recentMeals: Meal[];
}

const dailyGoal = {
    calories: 2000,
    protein: 150, // in grams
    carbs: 250, // in grams
    fats: 60, // in grams
};

const DonutChart: React.FC<{ value: number; total: number; color: string; label: string; unit: string; icon: string; iconBg: string }> = ({ value, total, color, label, unit, icon, iconBg }) => {
    const data = [{ name: 'A', value: value }, { name: 'B', value: Math.max(0, total - value) }];
    const percentage = Math.round((value / total) * 100);

    return (
        <div className="bg-gray-800 rounded-2xl p-4 flex flex-col items-center text-center w-full">
            <div className="relative w-20 h-20">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} cx="50%" cy="50%" dataKey="value" innerRadius={28} outerRadius={36} startAngle={90} endAngle={450} >
                            <Cell fill={color} stroke={color}/>
                            <Cell fill="#4A5568" stroke="#4A5568"/>
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}>
                   <Icon name={icon} className="w-6 h-6 text-white"/>
                </div>
            </div>
            <p className="mt-2 text-lg font-bold text-white">{value.toFixed(0)} <span className="text-sm font-normal text-gray-400">{unit}</span></p>
            <p className="text-sm text-gray-400">{label}</p>
        </div>
    );
};

const HomeScreen: React.FC<HomeScreenProps> = ({ recentMeals }) => {
    const consumed = recentMeals.reduce((acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fats: acc.fats + meal.fats,
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

    const caloriesLeft = dailyGoal.calories - consumed.calories;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Cal AI</h1>
          <p className="text-gray-400">Today</p>
        </div>
        <button className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a1 1 0 00-2 0v.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>

      <div className="bg-gray-800 rounded-3xl p-6 text-center shadow-lg">
        <div className="flex items-center justify-center space-x-4">
            <div className="flex-1">
                <p className="text-5xl font-bold text-white">{Math.round(caloriesLeft)}</p>
                <p className="text-gray-400">Calories left</p>
            </div>
             <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path className="text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    <path className="text-green-400" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${(consumed.calories / dailyGoal.calories) * 100}, 100`} strokeDashoffset="0" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center">
                        <Icon name="calories" className="w-6 h-6 text-orange-500" />
                    </div>
                </div>
            </div>
        </div>
      </div>
      
       <div className="grid grid-cols-3 gap-4">
            <DonutChart value={consumed.protein} total={dailyGoal.protein} color="#F87171" label="Protein" unit="g" icon="protein" iconBg="bg-red-500/80"/>
            <DonutChart value={consumed.carbs} total={dailyGoal.carbs} color="#FBBF24" label="Carbs" unit="g" icon="carbs" iconBg="bg-amber-500/80"/>
            <DonutChart value={consumed.fats} total={dailyGoal.fats} color="#60A5FA" label="Fats" unit="g" icon="fats" iconBg="bg-blue-500/80"/>
        </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-4">Recently uploaded</h2>
        <div className="space-y-3">
          {recentMeals.length > 0 ? recentMeals.map((meal) => (
            <div key={meal.id} className="bg-gray-800 rounded-2xl p-4 flex items-center space-x-4">
              <img src={meal.imageUrl} alt={meal.name} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-white">{meal.name}</p>
                <div className="flex items-center text-sm text-gray-400 space-x-3 mt-1">
                  <span className="flex items-center"><Icon name="calories" className="w-4 h-4 mr-1 text-red-400" />{meal.calories} kcal</span>
                  <span className="flex items-center"><Icon name="protein" className="w-4 h-4 mr-1 text-amber-400" />{meal.protein}g</span>
                  <span className="flex items-center"><Icon name="fats" className="w-4 h-4 mr-1 text-blue-400" />{meal.fats}g</span>
                </div>
              </div>
              <span className="text-sm text-gray-500">{meal.time}</span>
            </div>
          )) : <p className="text-gray-500 text-center py-4">No meals logged yet today.</p> }
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
