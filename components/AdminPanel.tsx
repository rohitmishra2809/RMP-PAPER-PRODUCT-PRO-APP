
import React from 'react';
import { Inventory } from '../types';
import GlassCard from './GlassCard';
import { Settings, Save } from 'lucide-react';

interface AdminPanelProps {
  inventory: Inventory;
  onUpdate: (gsm: string, color: 'Green' | 'Silver', value: boolean) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ inventory, onUpdate }) => {
  return (
    <GlassCard className="p-8 border-l-8 border-indigo-600">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <Settings className="w-6 h-6 text-indigo-600" />
          Manufacturer Control Panel
        </h3>
        <span className="bg-indigo-100 text-indigo-700 text-xs font-black px-3 py-1 rounded-full">MASTER MODE</span>
      </div>

      <p className="text-gray-600 mb-8 italic">Changes made here are visible to all customers in real-time.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.entries(inventory).map(([gsm, colors]) => (
          <div key={gsm} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h4 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">{gsm} Stock</h4>
            
            <div className="space-y-6">
              <ToggleItem 
                label="Green" 
                isOn={colors.Green} 
                onToggle={(val) => onUpdate(gsm, 'Green', val)} 
                colorClass="bg-green-500"
              />
              <ToggleItem 
                label="Silver" 
                isOn={colors.Silver} 
                onToggle={(val) => onUpdate(gsm, 'Silver', val)} 
                colorClass="bg-slate-400"
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
        <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-100">
          <Save className="w-5 h-5" /> 
          Auto-Saved to Cloud
        </button>
      </div>
    </GlassCard>
  );
};

interface ToggleProps {
  label: string;
  isOn: boolean;
  onToggle: (val: boolean) => void;
  colorClass: string;
}

const ToggleItem: React.FC<ToggleProps> = ({ label, isOn, onToggle, colorClass }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${colorClass}`} />
      <span className="font-semibold text-gray-700">{label}</span>
    </div>
    <button
      onClick={() => onToggle(!isOn)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ring-2 ring-offset-1 ${
        isOn ? 'bg-indigo-600 ring-indigo-600' : 'bg-gray-200 ring-transparent'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isOn ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export default AdminPanel;
