import styles from './Header.module.css';
import { useAuth } from '../context/AuthContext';

function Header({ onSignInClick }) {
  const { currentUser, signOut } = useAuth();

  return (
    <header style={{ 
      padding: '14px 24px', 
      background: '#241208',
      color: '#ffffff',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      borderBottom: '2px solid rgba(232,168,64,0.3)'
    }}>
      
      {/* Logo */}
      <div>
        <div className={styles.logo}>
          <span>🧺 </span>Scribble<span className={styles.logoAccent}>Cook</span>
        </div>
        <div className={styles.logoTagline}>your kitchen stories</div>
      </div>

      {/* Auth buttons */}
      {currentUser ? (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ color: '#fdf5ec', fontSize: '14px' }}>
            Hello, {currentUser.user_metadata?.name || currentUser.email}
          </span>
          <button 
            onClick={signOut}
            style={{ 
              background: 'transparent', 
              color: '#fdf5ec', 
              border: '1px solid rgba(255,255,255,0.3)', 
              padding: '6px 14px', 
              borderRadius: '20px', 
              fontSize: '13px', 
              cursor: 'pointer' 
            }}>
            Sign Out
          </button>
        </div>
      ) : (
        <button 
          onClick={onSignInClick}
          style={{ 
            background: '#b5502a', 
            color: 'white', 
            border: 'none', 
            padding: '8px 18px', 
            borderRadius: '20px', 
            fontSize: '14px', 
            cursor: 'pointer'
          }}>
          Sign In
        </button>
        
      )}

    </header>
  );
}

export default Header;