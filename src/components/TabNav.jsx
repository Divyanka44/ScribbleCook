function TabNav({ activeTab, onTabChange }) {
  const tabStyle = (tab) => ({
   background: 'transparent',
  color: activeTab === tab ? '#e8a840' : 'rgba(255,255,255,0.7)',
  padding: '13px 22px',
  border: 'none',
  borderBottom: activeTab === tab ? '2px solid #e8a840' : '2px solid transparent',
  cursor: 'pointer',
  fontSize: '13px',
  fontFamily: 'DM Sans, sans-serif',
  transition: 'all 0.2s',
  fontWeight: activeTab === tab ? '600' : '400'
  });
  return (

    <div style={{
      display: 'flex',
      background: '#1a0e06',
      padding: '0 24px',
      borderBottom: '1px solid rgba(232,168,64,0.15)',
      width: '100%',
      gap: '8px'    // ← small gap between tabs
    }}>
      <button  style={tabStyle('my')} onClick={() => onTabChange('my')}>
        📖 My Recipes
      </button>
      <button style={tabStyle('family')}onClick={() => onTabChange('family')}>
        🥘 Family Recipes
      </button>
      <button style={tabStyle('collection')} onClick={() => onTabChange('collection')}>
        🧺 Recipe Collection
      </button>
    </div>
  );
}

export default TabNav;