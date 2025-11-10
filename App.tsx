import React, { useState, useCallback } from 'react';
import type { Screen, Meal } from './types';
import HomeScreen from './screens/HomeScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import ScannerScreen from './screens/ScannerScreen';
import NutritionDetailScreen from './screens/NutritionDetailScreen';
import SettingsScreen from './screens/SettingsScreen';
import BottomNav from './components/BottomNav';

// Mock initial data
const initialMeals: Meal[] = [
    {
        id: '1',
        name: 'Caesar Salad',
        calories: 133,
        protein: 12,
        carbs: 10,
        fats: 8,
        time: '9:00am',
        imageUrl: 'https://picsum.photos/seed/caesarsalad/200/200'
    },
    {
        id: '2',
        name: 'Sweet Corn Paneer',
        calories: 456,
        protein: 26,
        carbs: 66,
        fats: 16,
        time: '9:00am',
        imageUrl: 'https://picsum.photos/seed/cornpaneer/200/200'
    }
];


const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [meals, setMeals] = useState<Meal[]>(initialMeals);
  const [scannedMeal, setScannedMeal] = useState<Omit<Meal, 'id' | 'time'> | null>(null);

  const handleNavigate = (screen: Screen) => {
    setActiveScreen(screen);
  };
  
  const handleAddMeal = (newMeal: Omit<Meal, 'id' | 'time'>) => {
    const mealWithId: Meal = {
        ...newMeal,
        id: new Date().toISOString(),
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    };
    setMeals(prev => [mealWithId, ...prev]);
    setScannedMeal(null);
    setActiveScreen('home');
  };

  const handleAnalysisComplete = useCallback((mealData: Omit<Meal, 'id' | 'time'>) => {
    setScannedMeal(mealData);
    setActiveScreen('nutritionDetail');
  }, []);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen recentMeals={meals} />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'scanner':
        return <ScannerScreen onBack={() => setActiveScreen('home')} onAnalysisComplete={handleAnalysisComplete} />;
      case 'nutritionDetail':
        // FIX: Replaced a state update during render with a safe fallback.
        // If scannedMeal is null (e.g., on a page refresh or state loss),
        // render the ScannerScreen instead of causing an infinite render loop.
        if (scannedMeal) {
            return <NutritionDetailScreen mealData={scannedMeal} onDone={handleAddMeal} onBack={() => setActiveScreen('scanner')} />;
        }
        return <ScannerScreen onBack={() => setActiveScreen('home')} onAnalysisComplete={handleAnalysisComplete} />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen recentMeals={meals} />;
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-gray-900 text-white min-h-screen flex flex-col font-sans shadow-2xl">
      <main className="flex-grow overflow-y-auto">
        {renderScreen()}
      </main>
      { (activeScreen === 'home' || activeScreen === 'analytics' || activeScreen === 'settings') && 
        <BottomNav 
          activeScreen={activeScreen} 
          setActiveScreen={handleNavigate} 
          onAdd={() => setActiveScreen('scanner')} 
        />
      }
    </div>
  );
};

export default App;
