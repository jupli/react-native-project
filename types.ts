
export type Screen = 'home' | 'analytics' | 'scanner' | 'nutritionDetail' | 'settings';

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Meal extends Nutrition {
  id: string;
  name: string;
  time: string;
  imageUrl: string;
  healthScore?: number;
  servings?: number;
}
