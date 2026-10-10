import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto">
      <div className="neu-card p-8 w-full text-center">
        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
        <p className="text-text-muted mb-8">Join the Nexus ecosystem today.</p>

        <p className="mb-8 text-sm">
          Currently, registration is seamlessly handled via Telegram.
        </p>

        <button
          onClick={() => navigate('/login')}
          className="w-full py-3 rounded-xl neu-button font-bold text-primary"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
