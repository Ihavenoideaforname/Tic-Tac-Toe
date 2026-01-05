import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import shared from '../styles/SharedStyles.module.css';
import styles from '../styles/OnlineRoomSelectionStyles.module.css';

export default function OnlineRoomSelection() {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if(roomCode.length === 6) {
      navigate(`/mode/online/${roomCode}`);
    }
  };

  const handleCreateRoom = () => {
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    console.log(code)
    navigate(`/mode/online/${code}`);
  };

  return (
    <div className={shared["page-container"]}>
      <div className={shared["page-card"]}>
        <button className={shared["back-button"]} onClick={() => navigate("/type")}>← Back</button>
        <h1 className={shared["page-title"]}>Online Multiplayer</h1>
        <button
          className={`${shared["primary-button"]} ${styles["create-room-button"]}`} onClick={handleCreateRoom}>
          🎮 Create Room
        </button>
        <div className={styles["or-text"]}>OR</div>
        <div className={styles["input-wrapper"]}>
          <input className={styles["input"]} placeholder="Enter Room Code" value={roomCode} maxLength={6} onChange={(e) => setRoomCode(e.target.value.toUpperCase())} />
          <button className={roomCode.length === 6 ? `${shared["primary-button"]} ${styles["join-room-button"]}` : shared["disabled-button"]} onClick={handleJoinRoom}>
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}
