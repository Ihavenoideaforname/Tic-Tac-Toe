import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import shared from '../styles/SharedStyles.module.css';
import loginStyles from '../styles/LoginPageStyles.module.css';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem('user') || '{}');

  const [username, setUsername] = useState(stored.username || '');
  const [email, setEmail] = useState(stored.email || '');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    if (avatar) formData.append('avatar', avatar);

    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/profile');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={shared['page-container']}>
      <div className={shared['page-card']}>
        <button className={shared['back-button']} onClick={() => navigate('/profile')}>
          ← Back
        </button>

        <h1 className={shared['page-title']}>Edit Profile</h1>

        <form onSubmit={handleSave} className={loginStyles['form-container']}>
          <FormInput type="text" placeholder="Username" value={username} onChange={setUsername} />
          <FormInput type="email" placeholder="Email" value={email} onChange={setEmail} />

          <input
            type="file"
            className={loginStyles['input-field']}
            onChange={(e) => setAvatar(e.target.files?.[0] || null)}
          />

          {error && <p className={loginStyles['error-message']}>{error}</p>}

          <FormButton text="💾 Save" loadingText="Saving..." isLoading={loading} type="submit" />
        </form>
      </div>
    </div>
  );
}
