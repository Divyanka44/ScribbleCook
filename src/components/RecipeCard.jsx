function RecipeCard({title, cookTime, servings, difficulty, category, imageUrl, onClick, onDelete }){
    return (
        <div onClick = {onClick}
       style={{
    background: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    position: 'relative'
  }}
        >
            {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();  // ← stop card click firing too!
          onDelete();
        }}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(36,18,8,0.7)',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          cursor: 'pointer',
          fontSize: '14px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '10'
        }}
      >
        🗑️
      </button>
           
            {imageUrl && (<img src={imageUrl} alt={title} style={{ width: '100%', height: '180px', objectFit: 'cover', color: '#ffffff' }} /> )}
            <div style={{ padding: '16px',color: '#241208'}}>
            <h3>{title}</h3>
            <p>Cook Time: {cookTime} minutes</p>
            <p>Servings: {servings}</p>
            <p>Difficulty: {difficulty}</p>
            <p>Category: {category}</p>
           
            </div>
        </div>
    );
}
export default RecipeCard; 
