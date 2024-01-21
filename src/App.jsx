import React, { useState } from 'react';

const API_KEY = 'BhulyjVqTbpJypEET6UXJA==HvIrI1U0QMxLpAYJ'

// TOdo: optimize with one api call per word

// Styles
const oddBackgroundStyle = { backgroundColor: '#c1c1c1', padding: '7px' };
const evenBackgroundStyle = { backgroundColor: '#a1a1a1', padding: '7px' };

function App() {
  // The text to output
  const [synonymyzedText, setSynonymyzedText] = useState(['...']);

  // When the 'Synonymyze' button is clicked
  const handleSynonymize = async (baseText) => {
    const splittedText = baseText.split('\n');
    let newText = '';
  
    // For each line
    for (let i = 0; i < splittedText.length; i++) {
      // Split it into words
      const words = splittedText[i].split(/ +|,|\(|\)|"|'/);
      // Remove empty characters
      const filteredWords = words.filter(Boolean);

      // Get a synonym for each word
      const synonymsPromises = filteredWords.map(word => genSynonym(word));
      const synonyms = await Promise.all(synonymsPromises);
  
      // Add synonyms to the new text
      newText += synonyms.join(' ');
  
      // New line
      newText += '\n';
    }
  
    // Change the output text
    setSynonymyzedText(newText.split('\n'));
  };

  return (
    <>
      <Presentation />
      <Input onSynonymize={handleSynonymize} />
      <Output synonymyzedText={synonymyzedText} />
    </>
  );
}

// React components
function Presentation() {
  return (
    <div style={oddBackgroundStyle}>
      <h1>Synonymiseur</h1>
      <p>Entre un texte, clique sur le bouton, et attend que la magie opère !</p>
    </div>
  );
}

function Input({ onSynonymize }) {
  const [inputValue, setInputValue] = useState('');

  const handleOnClick = () => {
    // When the button is clicked, send the content of the area to the upper function
    onSynonymize(inputValue);
  };

  return (
    <div style={evenBackgroundStyle}>
      <h3>Texte à transformer</h3>
      <form>
        <textarea
          value={inputValue} // Base value
          onChange={(e) => setInputValue(e.target.value)} // Update 'inputValue'
        />
      </form>
      <button onClick={handleOnClick}>
        Synonymiser !
      </button>
    </div>
  );
}

function Output({ synonymyzedText }) {
  return (
    <div style={oddBackgroundStyle}>
      <h3>Résultat</h3>
      {synonymyzedText.map((line, index) => (
        <React.Fragment key={index}>
          {line} <br />
        </React.Fragment>
      ))}
    </div>
  );
}

// Useful functions
async function genSynonym(word) {
  try {
    const synonyms = await getSynonyms(word);

    if (synonyms && synonyms.length > 0) {
      const randomIndex = Math.floor(Math.random() * synonyms.length);
      return synonyms[randomIndex];
    } else {
      // If no synonym was found return the word as is
      return word;
    }
  } catch (error) {
    console.error('Error while generating synonym for ' + word + ": " + error);
  }
}

async function getSynonyms(word) {
  const requestURL = `https://api.api-ninjas.com/v1/thesaurus?word=${word}&X-Api-Key=${API_KEY}`;

  try {
    const response = await fetch(requestURL);

    // Check if answer is okay
    if (!response.ok) {
      throw new Error(`Erreur HTTP! Statut: ${response.status}`);
    }

    const data = await response.json();
    return data.synonyms;
  } catch (error) {
    // Catch errors
    console.error('Erreur lors de la requête de la liste des synonymes:', error);
    throw error;
  }
}

export default App;
