const { Translate } = require('@google-cloud/translate').v2;
const path = require('path');

// Set the path to your service account key file
const serviceAccountKeyFile = path.join(__dirname, 'tncpl165-cee50316b4bf.json');

// Create a new instance of the Translate class with authentication
const translate = new Translate({
    keyFilename: serviceAccountKeyFile
});

// Function to translate text
async function translateText() {
    const text = 'Hello, world!';
    const targetLanguage = 'fr'; 

    try {
        const [translation] = await translate.translate(text, targetLanguage);
        console.log('Translated text:', translation);
    } catch (err) {
        console.error('Error translating text:', err);
    }
}

// Call the function to translate sample text
translateText();
