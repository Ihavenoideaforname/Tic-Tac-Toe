import { Routes, Route, Navigate } from 'react-router-dom';
import Background from './components/Background';

import AuthPage from './pages/AuthPage';
import GameTypeSelectionPage from './pages/GameTypeSelectionPage';
import OnlineRoomSelectionPage from './pages/OnlineRoomSelectionPage';
import GameModeSelectionPage from './pages/GameModeSelectionPage';
import GamePage from './pages/GamePage';
import ErrorPage from './pages/ErrorPage';

export default function App() {
  return (
    <>
      <Background />

      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/type" element={<GameTypeSelectionPage />} />
        <Route path="/room" element={<OnlineRoomSelectionPage />} />
        <Route path="/mode/:type" element={<GameModeSelectionPage />} />
        <Route path="/mode/:type/:roomCode" element={<GameModeSelectionPage />} />
        <Route path="/game/:type/:mode" element={<GamePage />} />
        <Route path="/game/:type/:mode/:roomCode" element={<GamePage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<Navigate to="/error?code=404&message=Page not found" replace />} />
      </Routes>
    </>
  );
}
