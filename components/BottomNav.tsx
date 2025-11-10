
import React from 'react';
import type { Screen } from '../types';
import Icon from './Icon';

interface BottomNavProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
  onAdd: () => void;
}

const NavItem: React.FC<{
  name: Screen;
  label: string;
  icon: string;
  isActive: boolean;
  onClick: (screen: Screen) => void;
}> = ({ name, label, icon, isActive, onClick }) => (
  <button
    onClick={() => onClick(name)}
    className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${
      isActive ? 'text-white' : 'text-gray-400'
    }`}
  >
    <Icon name={icon} className="w-6 h-6 mb-1" />
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen, onAdd }) => {
  return (
    <div className="sticky bottom-0 left-0 right-0 max-w-sm mx-auto bg-gray-900 border-t border-gray-700">
      <div className="flex h-16">
        <NavItem
          name="home"
          label="Home"
          icon="home"
          isActive={activeScreen === 'home'}
          onClick={setActiveScreen}
        />
        <NavItem
          name="analytics"
          label="Analytics"
          icon="analytics"
          isActive={activeScreen === 'analytics'}
          onClick={setActiveScreen}
        />
        <div className="w-full flex items-center justify-center">
            <button onClick={onAdd} className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-full w-14 h-14 flex items-center justify-center text-white -mt-6 shadow-lg shadow-orange-500/30">
                <Icon name="add" className="w-8 h-8"/>
            </button>
        </div>
        <NavItem
          name="settings"
          label="Settings"
          icon="settings"
          isActive={activeScreen === 'settings'}
          onClick={setActiveScreen}
        />
        <div className="w-full"></div>
      </div>
    </div>
  );
};

export default BottomNav;
