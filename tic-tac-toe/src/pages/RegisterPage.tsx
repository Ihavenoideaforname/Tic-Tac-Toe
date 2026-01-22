import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import shared from '../styles/SharedStyles.module.css';
import loginStyles from '../styles/LoginPageStyles.module.css';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Registration failed');
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
        <button className={shared['back-button']} onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1 className={shared['page-title']}>Register</h1>

        <form onSubmit={handleRegister} className={loginStyles['form-container']}>
          <FormInput type="text" placeholder="Username" value={username} onChange={setUsername} required />
          <FormInput type="email" placeholder="Email" value={email} onChange={setEmail} required />
          <FormInput type="password" placeholder="Password" value={password} onChange={setPassword} required />
          <FormInput type="password" placeholder="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} required />

          {error && <p className={loginStyles['error-message']}>{error}</p>}

          <FormButton text="🪪 Register" loadingText="Creating Account..." isLoading={loading} type="submit" />
        </form>

        <button
          className={loginStyles['login-button']}
          onClick={() => navigate('/login')}
        >
          Already have an account?
        </button>
      </div>
    </div>
  );
}