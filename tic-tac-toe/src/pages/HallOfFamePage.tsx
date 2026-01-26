import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import shared from '../styles/SharedStyles.module.css';

interface Player {
  username: string;
  avatar?: string;
  wins: number;
  losses: number;
  draws: number;
}

export default function HallOfFamePage() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch('/api/hall-of-fame')
    .then(res => res.json())
    .then(setPlayers);
}, []);


  return (
    <div className={shared['page-container']}>
      <div className={shared['page-card']}>
        <button
          className={shared['back-button']}
          onClick={() => navigate('/main-menu')}
        >
          ← Back
        </button>

        <h1 className={shared['page-title']}>🏆 Hall of Fame</h1>

        {loading && <p>Loading...</p>}

        {!loading && players.length === 0 && (
          <p>No games played yet.</p>
        )}

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {players.map((p, index) => (
            <li
              key={p.username}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: 12,
                marginBottom: 10,
                borderRadius: 12,
                background:
                  index === 0 ? '#fde68a'
                  : index === 1 ? '#e5e7eb'
                  : index === 2 ? '#fbcfe8'
                  : '#f3f4f6',
              }}
            >
              <strong style={{ width: 24 }}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
              </strong>

              <img
                src={p.avatar || '/default-avatar.jpg'}
                alt="avatar"
                style={{ width: 40, height: 40, borderRadius: '50%' }}
              />

              <div style={{ flex: 1 }}>
                <strong>{p.username}</strong>
              </div>

              <div>
                🏆 {p.wins} | ❌ {p.losses} | 🤝 {p.draws}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}