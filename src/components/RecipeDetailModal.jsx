function RecipeDetailModal({ recipe, onClose }) {
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

      </div>
    </div>
  );
}

export default RecipeDetailModal;