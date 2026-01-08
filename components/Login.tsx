
import React, { useState } from 'react';
import { Role } from '../types';
import GlassCard from './GlassCard';
import { User, Phone, Key, ChevronRight } from 'lucide-react';

interface LoginProps {
  onLogin: (name: string, phone: string, role: Role) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === "RMP123") {
      onLogin('Admin', '0000000000', 'Admin');
      return;
    }

    if (!name || !phone) {
      setError('Please enter both Name and Phone number.');
      return;
    }

    if (phone.length < 10) {
        setError('Please enter a valid 10-digit phone number.');
        return;
    }

    onLogin(name, phone, 'Customer');
  };

  return (
    <GlassCard className="w-full max-w-md p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Secure Access</h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. John Doe"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="10-digit number"
            />
          </div>
        </div>

        <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/50 px-2 text-gray-500">OR MANUFACTURER</span>
            </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password</label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="Only for RMP Staff"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
        >
          Enter Portal <ChevronRight className="w-5 h-5" />
        </button>
      </form>
    </GlassCard>
  );
};

export default Login;
