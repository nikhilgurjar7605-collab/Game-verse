import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LinkIcon } from 'lucide-react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { loginWithTelegram, isDemoMode } = useAuth();
  const navigate = useNavigate();

  const handleTelegramLogin = async () => {
    setLoading(true);
    try {
      await loginWithTelegram();
      navigate('/');
    } catch (error) {
      console.error(error);
      alert("Login failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto">
      <div className="neu-card p-8 w-full text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-text-muted mb-8">Sign in to sync your progress across devices.</p>

        {isDemoMode && (
          <div className="mb-6 p-4 rounded-lg bg-surface-secondary border border-white/10 text-sm text-text-muted">
            Running in Demo Mode. Login flows are simulated.
          </div>
        )}

        <button
          onClick={handleTelegramLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl neu-button flex items-center justify-center gap-2 font-bold text-[#0088cc] mb-4"
        >
          <LinkIcon className="w-5 h-5" />
          {loading ? 'Authenticating...' : 'Login with Telegram'}
        </button>

        <p className="text-sm text-text-muted">
          Don't have an account? <span className="text-primary cursor-pointer hover:underline" onClick={() => navigate('/register')}>Register here</span>
        </p>
      </div>
    </div>
  );
}
