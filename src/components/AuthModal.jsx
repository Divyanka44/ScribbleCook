import {useState} from 'react';
import { useAuth} from '../context/AuthContext';

function AuthModal({isOpen, onClose}){
const [isSignUp, setIsSignUp] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const { signIn, signUp } = useAuth(); 

    const handleSubmit = async () => {
        if(!isOpen) return null;
        setError('');
        setIsLoading(true);
        
        try{
            if(isSignUp) {
                await signUp(email, password);
        } else {
            await signIn(email, password);
        } onClose();}catch(e) {
            setError(e.message);
        }finally {
            setIsLoading(false);
        }
    };
    return (
  <div style={{
    position: 'fixed',
    inset: '0',
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '200'
  }}>
    <div style={{
      background: '#fdf5ec',
      borderRadius: '20px',
      padding: '32px',
      width: '420px',
      position: 'relative'
    }}>
      {/* Close button */}
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'none',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
          color: '#b8896a'
        }}>
        ✕
      </button>

      {/* Title */}
      <h2 style={{ 
        color: '#241208', 
        marginBottom: '20px',
        fontFamily: "'Playfair Display', serif"
      }}>
        {isSignUp ? 'Create Account' : 'Sign In'}
      </h2>

      {/* Email */}
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: '100%',
          padding: '11px 14px',
          border: '1.5px solid rgba(61,32,16,0.2)',
          borderRadius: '10px',
          marginBottom: '12px',
          fontSize: '15px',
          fontFamily: 'DM Sans, sans-serif',
          background: '#f5ece0',
          color: '#241208'
        }}
      />

      {/* Password */}
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: '100%',
          padding: '11px 14px',
          border: '1.5px solid rgba(61,32,16,0.2)',
          borderRadius: '10px',
          marginBottom: '12px',
          fontSize: '15px',
          fontFamily: 'DM Sans, sans-serif',
          background: '#f5ece0',
          color: '#241208'
        }}
      />

      {/* Error */}
      {error && (
        <p style={{ color: '#b5502a', fontSize: '13px', marginBottom: '12px' }}>
          {error}
        </p>
      )}

      {/* Submit button */}
      <button 
        onClick={handleSubmit}
        style={{
          width: '100%',
          padding: '13px',
          background: '#b5502a',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
          marginBottom: '16px',
          fontFamily: 'DM Sans, sans-serif'
        }}>
        {isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
      </button>

      {/* Toggle */}
      <p 
        onClick={() => setIsSignUp(!isSignUp)} 
        style={{ 
          cursor: 'pointer', 
          color: '#b5502a', 
          textAlign: 'center',
          fontSize: '14px'
        }}>
        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
      </p>
    </div>
  </div>
);

}
export default AuthModal;