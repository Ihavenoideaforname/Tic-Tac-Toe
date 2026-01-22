import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import shared from '../styles/SharedStyles.module.css';
import authStyles from '../styles/AuthPageStyles.module.css';
import loginStyles from '../styles/LoginPageStyles.module.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/type');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={shared['page-container']}>
      <div className={shared['page-card']}>
        <h1 className={shared['page-title']}>Login</h1>

        <form onSubmit={handleLogin} className={loginStyles['form-container']}>
          <input
            className={loginStyles['input-field']}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={loginStyles['input-field']}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className={loginStyles['error-message']}>{error}</p>}

          <div className={loginStyles['button-group']}>
            <button
              type="submit"
              disabled={loading}
              className={loginStyles['login-button']}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        <div className={authStyles['or-text']}>OR</div>

        <button
          className={loginStyles['login-button']}
          onClick={() => navigate('/register')}
        >
          Create Account
        </button>

        <button
          className={loginStyles['login-button']}
          onClick={() => navigate('/')}
        >
          Back
        </button>
      </div>
    </div>
  );
}
