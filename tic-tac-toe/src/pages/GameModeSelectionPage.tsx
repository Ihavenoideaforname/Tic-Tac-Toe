import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import io from 'socket.io-client';
import ConnectionModal from '../components/ConnectionModal';
import shared from '../styles/SharedStyles.module.css';
import styles from '../styles/GameModeSelectionStyles.module.css';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function GameModeSelection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { type, roomCode } = useParams<{
    type?: string;
    roomCode?: string;
  }>();

  const action = searchParams.get('action');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (type !== 'local' && type !== 'online') {
      navigate('/error?code=404&message=Page not found', { replace: true });
      return;
    }

    if (type === 'online' && !roomCode) {
      navigate('/error?code=404&message=Page not found', { replace: true });
      return;
    }

    if (type === 'online' && action === 'join' && roomCode) {
      setIsJoining(true);
      
      const socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling']
      });

      socket.on('connect', () => {
        socket.emit('get-room-info', { code: roomCode });
      });

      socket.on('room-info', ({ mode }: { mode: 'regular' | 'timed' }) => {
        socket.close();
        setIsJoining(false);
        navigate(`/game/online/${mode}/${roomCode}?action=join`, { replace: true });
      });

      socket.on('room-error', ({ message }: { message: string }) => {
        socket.close();
        setIsJoining(false);
        setError(message);
      });

      setTimeout(() => {
        if (socket.connected) {
          socket.close();
          setIsJoining(false);
          setError('Connection timeout. Please try again.');
        }
      }, 5000);
    }
  }, [type, roomCode, action, navigate]);

  if (type !== 'local' && type !== 'online') {
    return null;
  }

  if (type === 'online' && action === 'join') {
    return (
      <div className={shared['page-container']}>
        <div className={shared['page-card']}>
          <h1 className={shared['page-title']}>Joining Room...</h1>
        </div>
        
        <ConnectionModal
          open={isJoining}
          type="waiting"
          message="Joining room..."
        />

        <ConnectionModal
          open={!!error}
          type="error"
          message={error || undefined}
          onReject={() => navigate('/room')}
        />
      </div>
    );
  }

  const goToGame = (mode: 'regular' | 'timed') => {
    if(type === 'online') {
      navigate(`/game/online/${mode}/${roomCode}?action=${action}`);
    } 
    else {
      navigate(`/game/local/${mode}`);
    }
  };

  const backClick = () => {
    if(type === 'online') {
      navigate('/room');
    } 
    else {
      navigate('/type');
    }
  };

  return (
    <div className={shared['page-container']}>
      <div className={shared['page-card']}>
        <button className={shared['back-button']} onClick={() => backClick()}>
          ← Back
        </button>
        <h1 className={shared['page-title']}>Select Game Mode</h1>

        {type === 'online' && roomCode && (
          <p style={{ color: '#9ca3af', marginBottom: '20px', textAlign: 'center' }}>
            Room Code: <strong style={{ color: '#0bdbd0' }}>{roomCode}</strong>
          </p>
        )}

        <div className={shared['button-container']}>
          <button
            className={`${shared['primary-button']} ${styles['game-mode-regular']}`}
            onClick={() => goToGame('regular')}
          >
            ⚡ Regular Mode
          </button>

          <button
            className={`${shared['primary-button']} ${styles['game-mode-timed']}`}
            onClick={() => goToGame('timed')}
          >
            ⏱️ Timed Mode
          </button>
        </div>
      </div>
    </div>
  );
}