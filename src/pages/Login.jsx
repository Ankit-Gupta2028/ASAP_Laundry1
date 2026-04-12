import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, LogIn, UserPlus, MailCheck } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'verify'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // for signup
  const [studentId, setStudentId] = useState('');
  const [bagNumber, setBagNumber] = useState('');
  const [role, setRole] = useState('user'); // 'user' or 'admin'
  const [otp, setOtp] = useState(''); // for verify
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register, verifyEmail } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    const result = await login(username, password);
    
    setIsLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Invalid username or password');
      if (result.error && result.error.includes('verify your email')) {
        setMode('verify');
      }
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    const result = await register({ username, password, email, role, studentId, bagNumber });
    setIsLoading(false);
    
    if (result.success) {
      setSuccessMsg('Account created successfully! Please verify your email.');
      setMode('verify');
    } else {
      setError(result.error || 'Failed to create account');
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    const result = await verifyEmail(username, otp);
    setIsLoading(false);
    
    if (result.success) {
      setSuccessMsg('Email verified successfully! You can now log in.');
      setMode('login');
      setOtp(''); // clear OTP field
    } else {
      setError(result.error || 'Verification failed');
    }
  };

  const resetState = () => {
    setError('');
    setSuccessMsg('');
    setUsername('');
    setPassword('');
    setEmail('');
    setStudentId('');
    setBagNumber('');
    setRole('user');
    setOtp('');
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel animate-fade-in">
        <div className="login-header">
          <div className="logo-icon">
            {mode === 'login' && <LogIn size={40} className="text-indigo-400" />}
            {mode === 'signup' && <UserPlus size={40} className="text-indigo-400" />}
            {mode === 'verify' && <MailCheck size={40} className="text-indigo-400" />}
          </div>
          <h1 className="login-title">Laundry Manager</h1>
          <p className="login-subtitle">
            {mode === 'login' && 'Sign in to your account'}
            {mode === 'signup' && 'Create a new account'}
            {mode === 'verify' && 'Verify your email'}
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMsg && <div className="success-message text-green-500 text-sm text-center mb-4">{successMsg}</div>}

        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin or user"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary login-btn" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
            </button>
            <p className="text-center text-sm mt-4 text-gray-400">
              Don't have an account?{' '}
              <button 
                type="button" 
                className="text-indigo-400 hover:text-indigo-300"
                onClick={() => { resetState(); setMode('signup'); }}
              >
                Sign Up
              </button>
            </p>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="new-username">Username</label>
              <input
                id="new-username"
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="new-password">Password</label>
              <input
                id="new-password"
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="studentId">Student ID</label>
              <input
                id="studentId"
                type="text"
                className="form-input"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. EN12345"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="bagNumber">Bag Number</label>
              <input
                id="bagNumber"
                type="text"
                className="form-input"
                value={bagNumber}
                onChange={(e) => setBagNumber(e.target.value)}
                placeholder="e.g. B-42"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="role">Account Type</label>
              <div className="relative">
                <select
                  id="role"
                  className="form-input appearance-none w-full cursor-pointer dark:bg-slate-800 dark:text-white"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary login-btn" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign Up'}
            </button>
            <p className="text-center text-sm mt-4 text-gray-400">
              Already have an account?{' '}
              <button 
                type="button" 
                className="text-indigo-400 hover:text-indigo-300"
                onClick={() => { resetState(); setMode('login'); }}
              >
                Sign In
              </button>
            </p>
          </form>
        )}

        {mode === 'verify' && (
          <form onSubmit={handleVerifySubmit} className="login-form">
            <p className="text-sm text-gray-300 mb-4 text-center">
              Please enter the 6-digit OTP sent to your email. (For demo purposes, use OTP: <strong>123456</strong>)
            </p>
            <div className="form-group">
              <label className="form-label" htmlFor="otp">OTP Code</label>
              <input
                id="otp"
                type="text"
                className="form-input text-center tracking-widest text-lg"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary login-btn" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Verify Email'}
            </button>
            <p className="text-center text-sm mt-4 text-gray-400">
              <button 
                type="button" 
                className="text-indigo-400 hover:text-indigo-300"
                onClick={() => setMode('login')}
              >
                Back to Login
              </button>
            </p>
          </form>
        )}
        
        {mode === 'login' && (
          <div className="demo-credentials mt-6">
            <p><strong>Demo Accounts:</strong></p>
            <p>Admin: admin / password</p>
            <p>User: user / password</p>
          </div>
        )}
      </div>
    </div>
  );
}
