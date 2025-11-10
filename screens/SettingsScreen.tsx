
import React from 'react';
import Icon from '../components/Icon';

const SettingsScreen: React.FC = () => {
    
  const SettingItem: React.FC<{icon: string, label: string, value?: string, hasArrow?: boolean}> = ({icon, label, value, hasArrow = true}) => (
    <button className="w-full flex items-center py-4 text-left">
      <div className="bg-gray-700 p-2 rounded-lg">
        <Icon name={icon} className="w-6 h-6 text-white" />
      </div>
      <span className="ml-4 flex-grow text-white font-medium">{label}</span>
      {value && <span className="text-gray-400 mr-2">{value}</span>}
      {hasArrow && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
    </button>
  );

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="flex items-center bg-gray-800 p-4 rounded-2xl mb-8">
        <img src="https://picsum.photos/seed/user/100/100" alt="User" className="w-16 h-16 rounded-full object-cover" />
        <div className="ml-4">
          <p className="font-bold text-xl">Jane Doe</p>
          <p className="text-gray-400">jane.doe@example.com</p>
        </div>
      </div>
      
      <div className="space-y-2 bg-gray-800 p-4 rounded-2xl">
         <h2 className="text-lg font-semibold text-gray-300 px-2 pt-2">Profile</h2>
         <div className="divide-y divide-gray-700">
            <SettingItem icon="protein" label="My Goal" value="Weight Loss" />
            <SettingItem icon="analytics" label="Activity Level" value="Active" />
            <SettingItem icon="settings" label="Units" value="Metric" />
         </div>
      </div>

      <div className="space-y-2 bg-gray-800 p-4 rounded-2xl mt-6">
         <h2 className="text-lg font-semibold text-gray-300 px-2 pt-2">Application</h2>
         <div className="divide-y divide-gray-700">
            <SettingItem icon="home" label="Notifications" />
            <SettingItem icon="carbs" label="Theme" value="Dark" />
            <SettingItem icon="heart" label="Help & Support" />
         </div>
      </div>
      
       <div className="mt-8 bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-2xl text-center">
            <h3 className="text-xl font-bold">Go Premium</h3>
            <p className="mt-2 text-gray-200">Unlock all features and get unlimited scans!</p>
            <button className="mt-4 bg-white text-black font-bold py-3 px-8 rounded-full">Upgrade Now</button>
       </div>

    </div>
  );
};

export default SettingsScreen;
