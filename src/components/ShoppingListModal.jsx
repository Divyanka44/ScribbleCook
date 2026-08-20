import { useState } from 'react';

function ShoppingListModal({ isOpen, onClose, recipes }) {
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [view, setView] = useState('select');
  const [isGenerating, setIsGenerating] = useState(false);
  const [shoppingList, setShoppingList] = useState(null);

  const toggleRecipe = (recipeId) => {
    setSelectedRecipes(prev =>
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const handleGenerate = async () => {
    const selected = recipes.filter(r => selectedRecipes.includes(r.id));
    const allIngredients = selected.flatMap(r => {
      const ings = typeof r.ingredients === 'string'
        ? JSON.parse(r.ingredients)
        : (r.ingredients || []);
      return ings.map(i => `${r.title}: ${i}`);
    });

    setIsGenerating(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Combine these ingredients into a shopping list grouped by category. Remove duplicates. Return ONLY valid JSON with no markdown: {"listName":"...","items":{"Produce":["..."],"Dairy":["..."],"Meat":["..."],"Pantry":["..."],"Spices":["..."]}}
            
Ingredients:
${allIngredients.join('\n')}`
          }]
        })
      });

      const data = await response.json();
      const text = data.content[0].text;
      const list = JSON.parse(text.replace(/```json|```/g, '').trim());
      setShoppingList(list);
      setView('list');
    } catch(e) {
      console.error('Error generating list:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

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
        width: '480px',
        maxHeight: '90vh',
        overflowY: 'auto',
        color: '#241208'
      }}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif" }}>🛒 Shopping List</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:'20px', cursor:'pointer', color:'#b8896a' }}>✕</button>
        </div>

        {/* View 1 — Select Recipes */}
        {view === 'select' && (
          <div>
            <p style={{ color:'#b8896a', marginBottom:'16px', fontSize:'14px' }}>
              Select recipes to generate a shopping list:
            </p>

            {recipes.map(recipe => (
              <label key={recipe.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                borderRadius: '10px',
                cursor: 'pointer',
                marginBottom: '6px',
                background: selectedRecipes.includes(recipe.id) ? '#f0e0c8' : 'transparent'
              }}>
                <input
                  type="checkbox"
                  checked={selectedRecipes.includes(recipe.id)}
                  onChange={() => toggleRecipe(recipe.id)}
                  style={{ accentColor: '#b5502a' }}
                />
                <span>{recipe.title}</span>
              </label>
            ))}

            <button
              onClick={handleGenerate}
              disabled={selectedRecipes.length === 0 || isGenerating}
              className="form-submit"
              style={{ marginTop: '16px' }}
            >
              {isGenerating ? '✨ Generating...' : '✨ Generate with AI'}
            </button>
          </div>
        )}

        {/* View 2 — Generated List */}
        {view === 'list' && shoppingList && (
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
              <button
                onClick={() => setView('select')}
                style={{ background:'none', border:'none', color:'#b5502a', cursor:'pointer', fontSize:'13px' }}
              >
                ← Back
              </button>
              <h3 style={{ fontFamily:"'Playfair Display',serif" }}>{shoppingList.listName}</h3>
            </div>

            {Object.entries(shoppingList.items).map(([category, items]) => (
              items.length > 0 && (
                <div key={category} style={{ marginBottom:'16px' }}>
                  <h4 style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#b8896a',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '8px'
                  }}>
                    {category}
                  </h4>
                  {items.map((item, i) => (
                    <label key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 0',
                      borderBottom: '1px solid rgba(61,32,16,0.06)',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        style={{ accentColor: '#b5502a' }}
                      />
                      <span style={{ fontSize:'15px' }}>{item}</span>
                    </label>
                  ))}
                </div>
              )
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default ShoppingListModal;