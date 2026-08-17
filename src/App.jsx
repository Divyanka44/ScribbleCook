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
  const { error } = await db.from('recipes').insert({
    ...recipeData,
    user_id: currentUser.id,
    ingredients: JSON.stringify(recipeData.ingredients),
    instructions: JSON.stringify(recipeData.instructions),
  });
  if (error) console.error(error);
  else {
    setRefreshKey(prev => prev + 1); // ← triggers refetch!
    setIsAddModalOpen(false);        // ← close modal
  }
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
  console.log('isAddModalOpen state:', isAddModalOpen); 
  console.log('selectedRecipe:', selectedRecipe);
  return (
    <div style={{  background: '#36230aff', minHeight: '100vh',width: '100%', margin: '0',
    padding: '0'}}>
      <Header onSignInClick={() => setIsModalOpen(true)} />
      <TabNav activeTab={activeTab}  onTabChange={setActiveTab}  />
     {activeTab === 'my' && (
        <MyRecipes recipes={myRecipes} onSelectRecipe={setSelectedRecipe}/>
      )}
     {activeTab === 'family' && (
       <FamilyRecipes recipes={familyRecipes} onAddRecipe={() => setIsAddModalOpen(true)} onSelectRecipe={setSelectedRecipe} onUploadPhoto={() => setIsUploadModalOpen(true)}/>
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
  onExtracted={(recipe) => {
    setExtractedRecipe(recipe);
    setIsUploadModalOpen(false);
    setIsAddModalOpen(true);
  }}
/>


    </div>
  );
}

export default App;