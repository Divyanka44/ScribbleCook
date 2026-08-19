import RecipeCard from "./RecipeCard";


function FamilyRecipes({ recipes, onAddRecipe, onSelectRecipe, onUploadPhoto, onDeleteRecipe }) {
  return (
    <div style={{ padding: '20px', color: '#ffffff' }}>

      <h2 style={{ marginBottom: '16px' }}>🥘 Family Recipes</h2>
      <div style={{ display:'flex', gap:'10px', marginBottom:'16px' }}>
     <button className="btn-primary" onClick={onAddRecipe}>
  ✏️  Add Recipe
     </button>
     <button className="btn-primary" onClick={onUploadPhoto}>
      📷 Upload Photo
     </button>
     </div>
      {recipes.length === 0 ? (
        <p style={{ color: '#b8896a' }}>No recipes found.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '18px'
        }}>
          {recipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              title={recipe.title}
              cookTime={recipe.cook_time}
              servings={recipe.servings}
              difficulty={recipe.difficulty}
              category={recipe.category}
              imageUrl={recipe.image_url}
              onClick={() => onSelectRecipe(recipe)}
              onDelete={() => onDeleteRecipe(recipe.id)}
            />
          ))}
        </div>

      )}

    </div>
  );
}

export default FamilyRecipes;