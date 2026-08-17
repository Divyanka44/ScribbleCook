function RecipeCard({title, cookTime, servings, difficulty, category, imageUrl, onClick }){
    return (
        <div onClick = {onClick}
       style={{
    background: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer'
  }}
        >
            console.log('RecipeCard onClick:', onClick);
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
