import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { DemoProvider } from './context/DemoContext';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Games from './pages/Games';
import GamePlayer from './pages/GamePlayer';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import Feedback from './pages/Feedback';

// Placeholder Pages
const Inventory = () => <div className="p-8 neu-card text-center"><h1 className="text-2xl font-bold mb-4">Inventory</h1><p className="text-text-muted">Coming soon...</p></div>;
const Achievements = () => <div className="p-8 neu-card text-center"><h1 className="text-2xl font-bold mb-4">Achievements</h1><p className="text-text-muted">Coming soon...</p></div>;
const Rewards = () => <div className="p-8 neu-card text-center"><h1 className="text-2xl font-bold mb-4">Rewards</h1><p className="text-text-muted">Coming soon...</p></div>;
const Settings = () => <div className="p-8 neu-card text-center"><h1 className="text-2xl font-bold mb-4">Settings</h1><p className="text-text-muted">Coming soon...</p></div>;
const NotFound = () => <div className="p-8 text-center"><h1 className="text-4xl font-bold mb-4 text-primary">404</h1><p>Page not found</p></div>;

function App() {
  return (
    <AuthProvider>
      <DemoProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="games" element={<Games />} />
              <Route path="games/:gameId" element={<GamePlayer />} />

              <Route path="profile" element={<Profile />} />
              <Route path="profile/:username" element={<Profile />} />

              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="shop" element={<Shop />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="achievements" element={<Achievements />} />
              <Route path="rewards" element={<Rewards />} />
              <Route path="settings" element={<Settings />} />
              <Route path="feedback" element={<Feedback />} />

              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              <Route path="404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DemoProvider>
    </AuthProvider>
  );
}

export default App;
