import { Routes, Route, Navigate } from 'react-router-dom';
import Background from './components/Background';

import AuthPage from './pages/AuthPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GameTypeSelectionPage from './pages/GameTypeSelectionPage';
import OnlineRoomSelectionPage from './pages/OnlineRoomSelectionPage';
import GameModeSelectionPage from './pages/GameModeSelectionPage';
import GamePage from './pages/GamePage';
import ErrorPage from './pages/ErrorPage';
import MainMenuPage from './pages/MainMenuPage';
import ProfilePage from './pages/ProfilePage';
import EditPage from './pages/EditPage';
import HallOfFamePage from './pages/HallOfFamePage';

export default function App() {
  return (
    <>
      <Background />

      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile/edit" element={<EditPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/type" element={<GameTypeSelectionPage />} />
        <Route path="/room" element={<OnlineRoomSelectionPage />} />
        <Route path="/main-menu" element={<MainMenuPage />} />
        <Route path="/mode/:type" element={<GameModeSelectionPage />} />
        <Route path="/mode/:type/:roomCode" element={<GameModeSelectionPage />} />
        <Route path="/game/:type/:mode" element={<GamePage />} />
        <Route path="/game/:type/:mode/:roomCode" element={<GamePage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/hall-of-fame" element={<HallOfFamePage />} />
        <Route path="*" element={<Navigate to="/error?code=404&message=Page not found" replace />} />
      </Routes>
    </>
  );
}
