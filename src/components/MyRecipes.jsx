import RecipeCard from "./RecipeCard";
import { useState } from 'react';

const sampleRecipes = [
  {
    id: 's1',
    title: 'Classic Spaghetti Carbonara',
    cook_time: 25,
    servings: 4,
    difficulty: 'Medium',
    category: 'pasta',
    image_url: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500'
  },
  {
    id: 's2',
    title: 'Chocolate Chip Cookies',
    cook_time: 30,
    servings: 24,
    difficulty: 'Easy',
    category: 'dessert',
    image_url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500'
  }
];

function MyRecipes({ recipes, onSelectRecipe, onDeleteRecipe, onShoppingList }) {
  const allRecipes = [...sampleRecipes, ...(recipes || [])];
  const [search, setSearch] = useState('');
  const filtered = allRecipes.filter(r =>
  r.title.toLowerCase().includes(search.toLowerCase())
);
  return (
    <div style={{ padding: '20px', color: '#ffffff' }}>
      
      {/* Header row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
        <h2>🍽️ My Recipes</h2>
        <button className="btn-primary" onClick={onShoppingList}>
          🛒 Shopping List
        </button>
      </div>

      <input
      placeholder="Search recipes..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="search-input"
      />
      {/* Recipe grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '18px',
        alignItems: 'start'
      }}>
        {filtered.map(recipe => (
          <RecipeCard
            key={recipe.id}
            title={recipe.title}
            cookTime={recipe.cook_time}
            servings={recipe.servings}
            difficulty={recipe.difficulty}
            category={recipe.category}
            imageUrl={recipe.image_url}
            onClick={() => onSelectRecipe && onSelectRecipe(recipe)}
            onDelete={() => onDeleteRecipe && onDeleteRecipe(recipe.id)}
          />
        ))}
        
      </div>

    </div>
  );
}

export default MyRecipes;