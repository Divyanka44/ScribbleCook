
import { useState, useEffect } from 'react'; 
function AddRecipeModal({isOpen, onClose, onSave,initialData}) {
    const [title, setTitle] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [servings, setServings] = useState('');
    const [ingredients, setIngredients] = useState('');
const [instructions, setInstructions] = useState('');
   
    const handleSave = async () => {
         
        if (!title) return;
            await onSave({
                        title,
                        cook_time: parseInt(cookTime) || null,
                        servings: parseInt(servings) || null,
                        ingredients: ingredients.split('\n').filter(i => i.trim()),
                        instructions: instructions.split('\n').filter(s => s.trim()),
                        is_family_recipe: true
                        });
                     onClose();
    };
    useEffect(() => {
  if (initialData) {
    setTitle(initialData.title || '');
    setCookTime(initialData.cook_time || '');
    setServings(initialData.servings || '');
    setIngredients(initialData.ingredients?.join('\n') || '');
    setInstructions(initialData.instructions?.join('\n') || '');
  }
  else {
    // ← add this else block
    setTitle('');
    setCookTime('');
    setServings('');
    setIngredients('');
    setInstructions('');
  }
}, [initialData]);

  // 3. early return ↓
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
      width: '420px',
      color: '#241208'
    }}>
            <div className="modal-header">
            <div className="modal-title">✏️ Add Recipe</div>
             <button className="modal-close" onClick={onClose}>✕</button>
            </div>
            <div className="form-group">
            <label className="form-label">Recipe Title *</label>
            </div>
            <div className="form-group">
            <input 
                placeholder="Recipe Title"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            </div> 
            <div className="form-group">
            <label className="form-label">Cook Time (mins)</label>
            <input 
                placeholder="Cook Time"
                className="form-input"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
            />
            </div>
            <div className="form-group">
            <label className="form-label">Ingredients (one per line) *</label>
            <textarea 
                placeholder="Ingredients"
                className="form-input"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
            />
            </div>
            <div className="form-group">
            <label className="form-label">Servings</label>
            <input 
                placeholder="Servings"
                className="form-input"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
            />
            </div>
            <div className="form-group">
            <label className="form-label">Instructions (one step per line) *</label>
            <textarea
                placeholder="Add one step per line..."
                className="form-input"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
            />
            </div>
            
            <button onClick={handleSave} className="form-submit">Save Recipe</button>

            </div>
            </div>
    );

}
export default AddRecipeModal;