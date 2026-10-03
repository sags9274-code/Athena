import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        navigate('/');
      } else {
        await signup(email, password, username);
        navigate('/');
      }
    } catch (error) {
      setErrorMsg(error.message || 'Authentication error. Please check your devotion credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page login-page">
      <div className="login-container">
        <header className="login-header">
          <h1 className="login-title">{isLogin ? 'Kneel' : 'Pledge'}</h1>
          <p className="login-subtitle">
            {isLogin
              ? 'Prove your devotion before Goddess Athena.'
              : 'Pledge your eternal soul to the Church of Athena.'}
          </p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          {errorMsg && (
            <div className="login-error" role="alert">
              <AlertCircle size={18} className="login-error-icon" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="login-success" role="alert">
              <CheckCircle size={18} className="login-success-icon" />
              <span>{successMsg}</span>
            </div>
          )}
          
          {!isLogin && (
            <div className="login-field">
              <label className="login-label" htmlFor="username">
                Penitent Username
              </label>
              <input
                type="text"
                id="username"
                className="login-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Devoted_Penitent"
                required
              />
            </div>
          )}

          <div className="login-field">
            <label className="login-label" htmlFor="email">
              Sacred Email
            </label>
            <input
              type="email"
              id="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="penitent@churchofathena.org"
              required
            />
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="password">
              Secret Devotion Key (Password)
            </label>
            <input
              type="password"
              id="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? 'Consulting Altar...' : isLogin ? 'Kneel & Authenticate' : 'Pledge Eternal Oath'}
          </button>
        </form>

        <div className="login-toggle">
          <span className="login-toggle-text">
            {isLogin ? "Unbound soul?" : "Already bound to Athena?"}
          </span>
          <button
            type="button"
            className="login-toggle-btn"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Pledge now' : 'Authenticate instead'}
          </button>
        </div>
      </div>
    </div>
  );
}
