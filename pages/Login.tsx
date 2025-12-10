import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Lock, Smartphone } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ mobilePhone: '', password: '' });

  if (isAuthenticated) {
    return <Navigate to="/dashboard/users" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mobilePhone || !formData.password) return;
    
    setLoading(true);
    try {
      await login(formData);
    } catch (err) {
      // Error is handled in context/toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
        <div className="p-8 text-center bg-slate-900 text-white">
          <h1 className="text-2xl font-bold mb-2">Admin Portal</h1>
          <p className="text-slate-400 text-sm">Please sign in to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <Input
            label="Mobile Phone"
            type="tel"
            placeholder="e.g. +1234567890"
            value={formData.mobilePhone}
            onChange={(e) => setFormData(prev => ({ ...prev, mobilePhone: e.target.value }))}
            required
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            required
          />

          <Button 
            type="submit" 
            className="w-full" 
            isLoading={loading}
            icon={<Lock className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </form>

        <div className="px-8 py-4 bg-slate-50 text-center text-xs text-slate-500 border-t border-slate-100">
          Protected System. Authorized Personnel Only.
        </div>
      </div>
    </div>
  );
};
