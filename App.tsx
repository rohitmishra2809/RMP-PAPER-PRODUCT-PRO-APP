
import React, { useState, useEffect } from 'react';
import { Factory, Lock, User, LogOut, ShoppingCart, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { Inventory, UserSession, Role } from './types';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import CustomerPanel from './components/CustomerPanel';
import GlassCard from './components/GlassCard';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession>({
    role: 'Guest',
    name: '',
    phone: '',
  });

  const [inventory, setInventory] = useState<Inventory>({
    "120 GSM": { Green: true, Silver: true },
    "200 GSM": { Green: true, Silver: false },
    "300 GSM": { Green: true, Silver: true },
  });

  const handleLogin = (name: string, phone: string, role: Role) => {
    setSession({ role, name, phone });
  };

  const handleLogout = () => {
    setSession({ role: 'Guest', name: '', phone: '' });
  };

  const updateInventory = (gsm: string, color: 'Green' | 'Silver', value: boolean) => {
    setInventory(prev => ({
      ...prev,
      [gsm]: {
        ...prev[gsm],
        [color]: value
      }
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {session.role === 'Guest' ? (
        <div className="flex flex-col items-center">
          <GlassCard className="mb-8 w-full max-w-lg text-center p-10">
            <div className="flex justify-center mb-4">
              <Factory className="w-16 h-16 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">RMP Paper Products</h1>
            <p className="text-gray-600">Premium Quality Plates, Thalis & Bowls</p>
          </GlassCard>
          <Login onLogin={handleLogin} />
        </div>
      ) : (
        <div className="space-y-6">
          <header className="flex flex-col md:flex-row justify-between items-center gap-4">
            <GlassCard className="w-full flex justify-between items-center py-4 px-6">
              <div className="flex items-center gap-3">
                <Factory className="w-8 h-8 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-800 hidden md:block">RMP Dashboard</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500">{session.role === 'Admin' ? 'MANUFACTURER' : 'CUSTOMER'}</p>
                  <p className="text-gray-800 font-bold">{session.name || 'Admin User'}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </div>
            </GlassCard>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-12">
              <GlassCard className="p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-indigo-600" />
                  Live Inventory Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(inventory).map(([gsm, status]) => (
                    <div key={gsm} className="border border-gray-100 rounded-xl p-4 bg-white/50">
                      <h4 className="text-lg font-bold text-gray-700 mb-3 text-center border-b pb-2">{gsm}</h4>
                      <div className="space-y-3">
                        <StockIndicator label="Green" isAvailable={status.Green} />
                        <StockIndicator label="Silver" isAvailable={status.Silver} />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            <div className="lg:col-span-12">
              {session.role === 'Admin' ? (
                <AdminPanel 
                  inventory={inventory} 
                  onUpdate={updateInventory} 
                />
              ) : (
                <CustomerPanel 
                  session={session} 
                  inventory={inventory} 
                />
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

const StockIndicator: React.FC<{ label: string; isAvailable: boolean }> = ({ label, isAvailable }) => (
  <div className={`flex items-center justify-between p-3 rounded-lg border-2 ${
    isAvailable 
      ? 'bg-green-50 border-green-100 text-green-700' 
      : 'bg-red-50 border-red-100 text-red-700'
  }`}>
    <span className="font-semibold flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
      {label}
    </span>
    {isAvailable ? (
      <span className="text-xs font-bold uppercase flex items-center gap-1">
        <CheckCircle className="w-3 h-3" /> Available
      </span>
    ) : (
      <span className="text-xs font-bold uppercase flex items-center gap-1">
        <XCircle className="w-3 h-3" /> Out of Stock
      </span>
    )}
  </div>
);

export default App;
