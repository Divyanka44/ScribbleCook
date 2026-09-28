import { useState, useEffect } from 'react';

import Header from './components/Header';
import { db } from './supabase';
import TabNav from './components/TabNav';
import MyRecipes from './components/MyRecipes';
import FamilyRecipes from './components/FamilyRecipes';
import RecipeCollection from './components/RecipeCollection';
import AuthModal from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import AddRecipeModal from './components/AddRecipeModal';
import RecipeDetailModal from './components/RecipeDetailModal';
import UploadModal from './components/UploadModal';
import ShoppingListModal from './components/ShoppingListModal';

function App() {
 
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my');
  const [myRecipes, setMyRecipes] = useState([]);
  const [familyRecipes, setFamilyRecipes] = useState([]);
  const [collectionRecipes, setCollectionRecipes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [extractedRecipe, setExtractedRecipe] = useState(null);
  const [isShoppingModalOpen, setIsShoppingModalOpen] = useState(false);
 
  useEffect(() => {
    // Simulating a Supabase fetch for now
    console.log('Component loaded! Fetching recipes...');

    const fetchRecipes = async () => {
      if(!currentUser)
      {
        setMyRecipes([]);
        setFamilyRecipes([]);
        setCollectionRecipes([]);
        setIsLoading(false);
        return;
      }
      else
      {
        const { data, error } = await db.from('recipes').select('*');
        if (error) {
          console.error('Error fetching recipes:', error);
        } else {
          console.log('All recipes:', data); // ← add this
          console.log('Family recipes:', data.filter(r => r.is_family_recipe || r.is_mummy_recipe)); // ← add this
        setMyRecipes(data.filter(r=> !r.is_family_recipe && !r.is_mummy_recipe));
        setFamilyRecipes(data.filter(r=> r.is_family_recipe || r.is_mummy_recipe));
        setCollectionRecipes([]);

        }
        setIsLoading(false);
      }
      
    };

    fetchRecipes();

  }, [currentUser,refreshKey]); // ← run once on load
const handleSaveRecipe = async (recipeData) => {
  
  if (!currentUser) return;
  console.log('extractedRecipe:', extractedRecipe); // ← add this
  console.log('recipeData:', recipeData); // ← add this
  if (extractedRecipe) {
    console.log('Saving correction...'); // ← add this
    await saveCorrection(
      {
        title: extractedRecipe.title,
        ingredients: extractedRecipe.ingredients?.join('\n'),
        instructions: extractedRecipe.instructions?.join('\n')
      },
      {
        title: recipeData.title,
        ingredients: recipeData.ingredients?.join('\n'),
        instructions: recipeData.instructions?.join('\n')
      }
    );
  }
  const { error } = await db.from('recipes').insert({
    ...recipeData,
    user_id: currentUser.id,
    ingredients: JSON.stringify(recipeData.ingredients),
    instructions: JSON.stringify(recipeData.instructions),
  });
  if (error) {
    console.error('Save error:', error);
  } else {
    console.log('Saved! Triggering refresh...'); // ← add this
    setRefreshKey(prev => prev + 1);
    setIsAddModalOpen(false);
    setExtractedRecipe(null);
  }
};
const saveCorrection = async (original, corrected) => {
  if (!currentUser) return;
  
  // Only save if something changed
  const hasChanged = 
    original.title !== corrected.title ||
    original.ingredients !== corrected.ingredients ||
    original.instructions !== corrected.instructions;

  if (!hasChanged) return;

  await db.from('ai_corrections').insert({
    user_id: currentUser.id,
    original_title: original.title,
    corrected_title: corrected.title,
    original_ingredients: original.ingredients,
    corrected_ingredients: corrected.ingredients,
    original_instructions: original.instructions,
    corrected_instructions: corrected.instructions
  });
  
  console.log('Correction saved! 🧠');
};

  // Show loading while fetching
  if (isLoading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>🧺 ScribbleCook</h1>
        <p>Loading recipes...</p>
      </div>
    );
  }
  const handleDeleteRecipe = async (recipeId) => {
  if (!window.confirm('Delete this recipe?')) return;
  
  const { error } = await db
    .from('recipes')
    .delete()
    .eq('id', recipeId);
    
  if (error) {
    console.error(error);
  } else {
    setRefreshKey(prev => prev + 1); // ← refresh list
  }
};
  console.log('isAddModalOpen state:', isAddModalOpen); 
  console.log('selectedRecipe:', selectedRecipe);
  return (
    <div style={{  background: '#36230aff', minHeight: '100vh',width: '100%', margin: '0',
    padding: '0'}}>
      <Header onSignInClick={() => setIsModalOpen(true)} onShoppingList={() => setIsShoppingModalOpen(true)} />
      <TabNav activeTab={activeTab}  onTabChange={setActiveTab}  />
     {activeTab === 'my' && (
        <MyRecipes recipes={myRecipes} onSelectRecipe={setSelectedRecipe} onDeleteRecipe={handleDeleteRecipe} onShoppingList={() => setIsShoppingModalOpen(true)}/>
      )}
     {activeTab === 'family' && (
       <FamilyRecipes recipes={familyRecipes} onAddRecipe={() => {
    setExtractedRecipe(null);  // ← clear first!
    setIsAddModalOpen(true);
  }} onSelectRecipe={setSelectedRecipe} onDeleteRecipe={handleDeleteRecipe} onUploadPhoto={() => setIsUploadModalOpen(true)} />
      )}
     {activeTab === 'collection' && (
        <RecipeCollection />
      )}
      {isModalOpen && (
        <AuthModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {/* Add Recipe Modal — goes here */}
      <AddRecipeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveRecipe}
        initialData={extractedRecipe} 
      />
      <RecipeDetailModal
        recipe={selectedRecipe}
         onClose={() => setSelectedRecipe(null)}
      />
     <UploadModal
  isOpen={isUploadModalOpen}
  onClose={() => setIsUploadModalOpen(false)}
  currentUser={currentUser}
  onExtracted={(recipe) => {
    setExtractedRecipe(recipe);
    setIsUploadModalOpen(false);
    setIsAddModalOpen(true);
  }}
/>
<ShoppingListModal
  isOpen={isShoppingModalOpen}
  onClose={() => setIsShoppingModalOpen(false)}
  recipes={[...myRecipes, ...familyRecipes]}
/>


    </div>
  );
}

export default App;