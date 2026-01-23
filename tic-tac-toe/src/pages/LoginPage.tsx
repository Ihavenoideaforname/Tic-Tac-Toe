import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import shared from '../styles/SharedStyles.module.css';
import loginStyles from '../styles/LoginPageStyles.module.css';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

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
      navigate('/main-menu');
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
        <button className={shared['back-button']} onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1 className={shared['page-title']}>Login</h1>

        <form onSubmit={handleLogin} className={loginStyles['form-container']}>
          <FormInput type="email" placeholder="Email" value={email} onChange={setEmail} required />
          <FormInput type="password" placeholder="Password" value={password} onChange={setPassword} required />

          {error && <p className={loginStyles['error-message']}>{error}</p>}

          <FormButton text="🔑 Login" loadingText="Logging in..." isLoading={loading} type="submit" />

        </form>

        <button
          className={loginStyles['login-button']}
          onClick={() => navigate('/register')}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}