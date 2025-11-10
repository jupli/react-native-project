
import React, { useState, useEffect } from 'react';
import type { Meal } from '../types';
import Icon from '../components/Icon';

interface NutritionDetailScreenProps {
  mealData: Omit<Meal, 'id' | 'time'>;
  onDone: (finalMeal: Omit<Meal, 'id' | 'time'>) => void;
  onBack: () => void;
}

const NutrientCard: React.FC<{ icon: string; label: string; value: number; unit: string; color: string; onEdit: () => void;}> = ({ icon, label, value, unit, color, onEdit }) => (
    <div className="bg-gray-800 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center">
            <div className={`p-2 rounded-lg ${color}`}>
                <Icon name={icon} className="w-6 h-6 text-white"/>
            </div>
            <div className="ml-4">
                <p className="text-gray-400">{label}</p>
                <p className="text-white font-bold">{value}{unit}</p>
            </div>
        </div>
        <button onClick={onEdit}><Icon name="edit" className="w-5 h-5 text-gray-500"/></button>
    </div>
);


const NutritionDetailScreen: React.FC<NutritionDetailScreenProps> = ({ mealData, onDone, onBack }) => {
  const [meal, setMeal] = useState(mealData);
  const [servings, setServings] = useState(1);

  useEffect(() => {
    setMeal(mealData);
  }, [mealData]);

  const handleServingsChange = (amount: number) => {
    setServings(prev => Math.max(1, prev + amount));
  };
  
  const handleDone = () => {
    onDone({
      ...meal,
      calories: meal.calories * servings,
      protein: meal.protein * servings,
      carbs: meal.carbs * servings,
      fats: meal.fats * servings,
      servings: servings,
    });
  };

  const healthScorePercentage = (meal.healthScore || 0) * 10;

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="relative">
        <img src={meal.imageUrl} alt={meal.name} className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <button onClick={onBack} className="bg-black/30 rounded-full p-2">
            <Icon name="back" className="w-6 h-6" />
          </button>
          <button className="bg-black/30 rounded-full p-2">
            <Icon name="more" className="w-6 h-6" />
          </button>
        </div>
        <h1 className="absolute bottom-4 left-4 text-2xl font-bold">Nutrition</h1>
      </div>

      <div className="flex-grow p-6 -mt-8 bg-gray-900 rounded-t-3xl z-10 space-y-4">
        <div className="bg-gray-800 rounded-2xl p-4">
          <p className="text-xs text-gray-400">BREAKFAST</p>
          <div className="flex justify-between items-center mt-1">
            <h2 className="text-2xl font-bold text-white">{meal.name}</h2>
            <div className="flex items-center space-x-3 bg-gray-700 rounded-full p-1">
              <button onClick={() => handleServingsChange(-1)} className="bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center"><Icon name="minus" className="w-5 h-5"/></button>
              <span className="font-bold text-lg w-8 text-center">{servings}</span>
              <button onClick={() => handleServingsChange(1)} className="bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center"><Icon name="plus" className="w-5 h-5"/></button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <NutrientCard icon="calories" label="Calories" value={meal.calories * servings} unit=" Kcal" color="bg-red-500" onEdit={() => {}}/>
            <NutrientCard icon="carbs" label="Carbs" value={meal.carbs * servings} unit="g" color="bg-amber-500" onEdit={() => {}}/>
            <NutrientCard icon="protein" label="Protein" value={meal.protein * servings} unit="g" color="bg-pink-500" onEdit={() => {}}/>
            <NutrientCard icon="fats" label="Fats" value={meal.fats * servings} unit="g" color="bg-blue-500" onEdit={() => {}}/>
        </div>

        <div className="bg-gray-800 rounded-2xl p-4">
            <div className="flex items-center">
                 <div className="p-2 rounded-lg bg-rose-500">
                    <Icon name="heart" className="w-6 h-6 text-white"/>
                </div>
                 <p className="ml-4 text-white font-bold">Health score</p>
                 <span className="ml-auto text-gray-400">{meal.healthScore}/10</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                <div className="bg-green-500 h-2 rounded-full" style={{width: `${healthScorePercentage}%`}}></div>
            </div>
        </div>
      </div>
      
      <div className="p-6 pt-2 sticky bottom-0 bg-gray-900">
        <div className="flex space-x-4">
          <button className="flex-1 bg-gray-700 py-4 rounded-full font-semibold">Fix Results</button>
          <button onClick={handleDone} className="flex-1 bg-white text-black py-4 rounded-full font-semibold">Done</button>
        </div>
      </div>
    </div>
  );
};

export default NutritionDetailScreen;
