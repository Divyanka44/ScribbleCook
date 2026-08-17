import { useState } from 'react';

function UploadModal({ isOpen, onClose, onExtracted }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  console.log('File selected:', file); // ← add this
  if (!file) return;

  setIsProcessing(true);
  setError('');

  try {
    const base64 = await fileToBase64(file);
    console.log('Base64 converted, length:', base64.length); // ← add this

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
  model: 'claude-haiku-4-5-20251001',
  max_tokens: 1000,
  messages: [{
    role: 'user',
    content: [
      {
        type: 'image',
        source: {
          type: 'base64',
          media_type: file.type,
          data: base64
        }
      },
      {
        type: 'text',
        text: 'Extract this recipe and return ONLY valid JSON with no markdown: {"title":"...","ingredients":["..."],"instructions":["..."],"cook_time":30,"servings":4}'
      }
    ]
  }]
})
    });

    console.log('Response status:', response.status); // ← add this
   
   
      const data = await response.json();
       console.log('Claude response:', data); // ← add this
      const text = data.content[0].text;
      const recipe = JSON.parse(text.replace(/```json|```/g, '').trim());
      onExtracted(recipe);
      onClose();
    } catch(e) {
      setError('Could not extract recipe. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position:'fixed', inset:'0', background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:'200' }}>
      <div style={{ background:'#fdf5ec', borderRadius:'20px', padding:'32px', width:'420px', color:'#241208' }}>
        
        <h2 style={{ marginBottom:'20px', fontFamily:"'Playfair Display',serif" }}>📷 Upload Recipe</h2>

        {/* Upload zone */}
        {!isProcessing ? (
          <div style={{ border:'2px dashed #b8896a', borderRadius:'14px', padding:'36px', textAlign:'center', cursor:'pointer' }}
            onClick={() => document.getElementById('fileInput').click()}>
            <div style={{ fontSize:'42px', marginBottom:'12px' }}>📸</div>
            <p style={{ color:'#b8896a', fontStyle:'italic' }}>Click to upload a photo</p>
            <input 
              type="file" 
              id="fileInput"
              accept="image/*"
              style={{ display:'none' }}
              onChange={handleFileUpload}
            />
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'30px' }}>
            <p style={{ color:'#b8896a' }}>🤖 Reading recipe with AI...</p>
          </div>
        )}

        {error && <p style={{ color:'#b5502a', marginTop:'12px' }}>{error}</p>}

        <button onClick={onClose} style={{ width:'100%', padding:'10px', marginTop:'16px', background:'transparent', border:'1.5px solid #b8896a', borderRadius:'12px', cursor:'pointer', color:'#b8896a' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default UploadModal;