import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import ConnectionModal from '../components/ConnectionModal';
import shared from '../styles/SharedStyles.module.css';
import styles from '../styles/OnlineRoomSelectionStyles.module.css';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function OnlineRoomSelection() {
  const [roomCode, setRoomCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (roomCode.length === 6) {
      setIsValidating(true);
      setError(null);

      const socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling']
      });

      socket.on('connect', () => {
        socket.emit('validate-room', { code: roomCode });
      });

      socket.on('room-valid', () => {
        socket.close();
        setIsValidating(false);
        navigate(`/mode/online/${roomCode}?action=join`);
      });

      socket.on('room-error', ({ message }: { message: string }) => {
        socket.close();
        setIsValidating(false);
        setError(message);
      });

      setTimeout(() => {
        if (socket.connected) {
          socket.close();
          setIsValidating(false);
          setError('Connection timeout. Please try again.');
        }
      }, 5000);
    }
  };

  const handleCreateRoom = async () => {
    try {
      const response = await fetch(`${SOCKET_URL}/generate-room-code`);
      const data = await response.json();
      navigate(`/mode/online/${data.code}?action=create`);
    } 
    catch (error) {
      console.error('Failed to generate room code:', error);
      const code = Math.random().toString(36).substr(2, 6).toUpperCase();
      navigate(`/mode/online/${code}?action=create`);
    }
  };

  return (
    <div className={shared['page-container']}>
      <div className={shared['page-card']}>
        <button className={shared['back-button']} onClick={() => navigate('/type')}>
          ← Back
        </button>
        <h1 className={shared['page-title']}>Online Multiplayer</h1>
        <button
          className={`${shared['primary-button']} ${styles['create-room-button']}`}
          onClick={handleCreateRoom}
        >
          🎮 Create Room
        </button>
        <div className={styles['or-text']}>OR</div>
        <div className={styles['input-wrapper']}>
          <input
            className={styles['input']}
            placeholder="Enter Room Code"
            value={roomCode}
            maxLength={6}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          />
          <button
            className={
              roomCode.length === 6
                ? `${shared['primary-button']} ${styles['join-room-button']}`
                : shared['disabled-button']
            }
            onClick={handleJoinRoom}
            disabled={isValidating}
          >
            Join Room
          </button>
        </div>
      </div>

      <ConnectionModal
        open={isValidating}
        type="waiting"
        message="Validating room..."
      />

      <ConnectionModal
        open={!!error}
        type="error"
        message={error || undefined}
        onReject={() => setError(null)}
      />
    </div>
  );
}