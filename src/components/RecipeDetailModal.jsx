import { useState } from 'react';

function RecipeDetailModal({ recipe, onClose }) {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = async () => {
  if (!message.trim()) return;

  // 1. add user message to history
  const userMessage = { role: 'user', content: message };
  setChatHistory(prev => [...prev, userMessage]);
  setMessage('');
  setIsTyping(true);

  try {
    // 2. send to Claude with recipe context
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: `You are a helpful cooking assistant for the recipe "${recipe.title}". 
          Ingredients: ${ingredients.join(', ')}. 
          Answer questions concisely and helpfully.`,
        messages: [...chatHistory, userMessage]
      })
    });

    const data = await response.json();
    const reply = data.content[0].text;

    // 3. add AI response to history
    setChatHistory(prev => [...prev, { role: 'assistant', content: reply }]);
  } catch(e) {
    console.error('Chat error:', e);
  } finally {
    setIsTyping(false);
  }
};
  if (!recipe) return null;

  const ingredients = typeof recipe.ingredients === 'string'
    ? JSON.parse(recipe.ingredients)
    : (recipe.ingredients || []);

  const instructions = typeof recipe.instructions === 'string'
    ? JSON.parse(recipe.instructions)
    : (recipe.instructions || []);

  return (
    <div style={{ position:'fixed', inset:'0', background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:'200' }}>
      <div style={{ background:'#fdf5ec', borderRadius:'20px', width:'680px', maxHeight:'90vh', overflowY:'auto', color:'#241208' }}>
        
        {/* Close button */}
        <div style={{ display:'flex', justifyContent:'flex-end', padding:'16px 24px 0' }}>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:'20px', cursor:'pointer', color:'#b8896a' }}>✕</button>
        </div>

        {/* Image */}
        {recipe.image_url 
          ? <img src={recipe.image_url} alt={recipe.title} className="detail-img" />
          : <div className="detail-img-placeholder">🍳</div>
        }

        {/* Title */}
        <div style={{ padding:'16px 24px 0' }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'24px' }}>{recipe.title}</h2>
        </div>

        {/* Stats */}
        <div className="detail-stats">
          <div className="stat">
            <div className="stat-val">{recipe.cook_time || '?'}</div>
            <div className="stat-lbl">minutes</div>
          </div>
          <div className="stat">
            <div className="stat-val">{recipe.servings || '?'}</div>
            <div className="stat-lbl">servings</div>
          </div>
          <div className="stat">
            <div className="stat-val">{recipe.difficulty || '?'}</div>
            <div className="stat-lbl">difficulty</div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="detail-section">
          <h3>🛒 Ingredients</h3>
          <ul className="ingredient-list">
            {ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="detail-section">
          <h3>👨‍🍳 Instructions</h3>
          {instructions.map((step, i) => (
            <div key={i} className="step">
              <div className="step-num">{i + 1}</div>
              <div className="step-text">{step}</div>
            </div>
          ))}
        </div>
          {/* Cooking Assistant Chat */}
<div className="detail-section">
  <h3>🤖 Cooking Assistant</h3>
  
  {/* Chat messages */}
  <div style={{
    height: '220px',
    overflowY: 'auto',
    border: '1.5px solid rgba(61,32,16,0.2)',
    borderRadius: '12px',
    padding: '14px',
    marginBottom: '10px',
    background: '#f5ece0',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  }}>
    {chatHistory.length === 0 && (
      <p style={{ color: '#b8896a', fontStyle: 'italic', fontSize: '14px' }}>
        Ask me anything about this recipe! 🍳
      </p>
    )}
    {chatHistory.map((msg, i) => (
      <div key={i} style={{
        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
        background: msg.role === 'user' ? '#3d2010' : '#fdf5ec',
        color: msg.role === 'user' ? '#f0c060' : '#241208',
        padding: '10px 14px',
        borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
        maxWidth: '80%',
        fontSize: '14px',
        border: msg.role === 'assistant' ? '1px solid rgba(61,32,16,0.15)' : 'none'
      }}>
        {msg.content}
      </div>
    ))}
    {isTyping && (
      <div style={{ color: '#b8896a', fontStyle: 'italic', fontSize: '13px' }}>
        Thinking...
      </div>
    )}
  </div>

  {/* Input row */}
  <div style={{ display: 'flex', gap: '8px' }}>
    <input
      type="text"
      placeholder="Can I substitute an ingredient?..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
      style={{
        flex: '1',
        padding: '10px 14px',
        border: '1.5px solid rgba(61,32,16,0.2)',
        borderRadius: '20px',
        fontFamily: 'Lora, serif',
        fontSize: '14px',
        outline: 'none',
        background: '#fdf5ec',
        color: '#241208'
      }}
    />
    <button
      onClick={handleSendMessage}
      style={{
        padding: '10px 18px',
        background: '#3d2010',
        color: '#e8a840',
        border: 'none',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '14px'
      }}
    >
      Send
    </button>
  </div>
</div>
      </div>
      
    </div>
  );
}

export default RecipeDetailModal;