import RecipeCard from "./RecipeCard";

function MyRecipes() {
  return (
    <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' , gap: '18px', alignItems:'start'}}>
      <h2 style={{ color: '#ffffff' , marginBottom: '16px' }}>🍽️ My Recipes</h2>
    </div>
  );
}

export default MyRecipes;
