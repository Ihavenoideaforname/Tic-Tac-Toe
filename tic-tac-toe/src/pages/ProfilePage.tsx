import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import shared from '../styles/SharedStyles.module.css';
import loginStyles from '../styles/LoginPageStyles.module.css';


interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/login');
    return;
  }

    const fetchMe = async () => {
      const res = await fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        navigate('/login');
      return;
      }

      const me = await res.json();
      setUser(me);
      localStorage.setItem('user', JSON.stringify(me));
    };

    fetchMe();
  }, [navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;

    const token = localStorage.getItem('token');

    await fetch('/api/users/me', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    localStorage.clear();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className={shared['page-container']}>
      <div className={shared['page-card']}>
        <button className={shared['back-button']} onClick={() => navigate('/main-menu')}>
          ← Back
        </button>

        <h1 className={shared['page-title']}>Profile</h1>

        <img
          src={user.avatar || '/default-avatar.jpg'}
          alt="avatar"
          style={{ width: 120, borderRadius: '50%', marginBottom: 20 }}
        />

        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>

        <button className={loginStyles['login-button']} onClick={() => navigate('/profile/edit')}>
          ✏️ Edit Profile
        </button>

        <button className={loginStyles['login-button']} style={{ background: '#ef4444' }} onClick={handleDelete}>
          🗑 Delete Account
        </button>
      </div>
    </div>
  );
}
