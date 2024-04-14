const express = require('express');
const { TranslationServiceClient } = require('@google-cloud/translate');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs').promises;
const pdfParse = require('pdf-parse');
const unzipper = require('unzipper');
const pdf = require('pdf-creator-node');
const path = require('path');

// Set the path to your Google Cloud service account key file
process.env.GOOGLE_APPLICATION_CREDENTIALS = 'C:\\Users\\THIS PC\\OneDrive\\Desktop\\projectK\\backend\\projectk-419921-38943fba3e97.json';

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Set up Google Cloud Translation client
const translationClient = new TranslationServiceClient();

// Middleware configuration
app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.json()); // Alternative JSON parsing
app.use(express.static(__dirname + "/../public")); // Serve static files

// Middleware for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Function to extract text from DOCX file
async function extractTextFromDOCX(filePath) {
    try {
        const docxFile = await unzipper.Open.file(filePath);
        const textContent = [];

        for (const entry of docxFile.files) {
            if (entry.path === 'word/document.xml') {
                const xmlContent = await entry.buffer();
                const text = xmlContent.toString().replace(/<[^>]+>/g, '');
                textContent.push(text);
            }
        }

        return textContent.join('\n');
    } catch (error) {
        console.error('Error extracting text from DOCX:', error);
        throw error;
    }
}

// Function to translate text in chunks while preserving basic layout
async function translateTextWithLayout(text, sourceLanguage, targetLanguage) {
    const chunkSize = 10000; // Adjust chunk size as needed
    const chunks = [];

    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.substring(i, i + chunkSize));
    }

    const translations = [];

    for (let i = 0; i < chunks.length; i++) {
        const [translation] = await translationClient.translateText({
            parent: `projects/${process.env.GOOGLE_CLOUD_PROJECT_ID || 'projectk-419921'}/locations/global`,
            contents: [chunks[i]],
            mimeType: 'text/plain',
            sourceLanguageCode: sourceLanguage,
            targetLanguageCode: targetLanguage,
        });

        translations.push(translation.translations[0].translatedText);
    }

    return translations.join('\n\n'); // Add extra line breaks between chunks for paragraph separation
}

// Translation endpoint for documents
app.post('/translate/document', upload.single('documentFile'), async (req, res) => {
    const { sourceLanguage, targetLanguage } = req.body;
    const filePath = req.file.path;

    try {
        if (!sourceLanguage || !targetLanguage) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const fileType = req.file.mimetype;
        let textToTranslate;

        if (fileType === 'application/pdf') {
            const dataBuffer = await fs.readFile(filePath);
            const pdfText = await pdfParse(dataBuffer);
            textToTranslate = pdfText.text;
        } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            textToTranslate = await extractTextFromDOCX(filePath);
        } else if (fileType === 'text/plain') {
            textToTranslate = await fs.readFile(filePath, 'utf8');
        } else {
            return res.status(400).json({ error: 'Unsupported file format' });
        }

        const translatedText = await translateTextWithLayout(textToTranslate, sourceLanguage, targetLanguage);

        // Return the translated text
        res.json({ translatedDocument: translatedText });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while translating document' });
    }
});
// Translation endpoint for text
app.post('/translate/text', async (req, res) => {
    const { text, sourceLanguage, targetLanguage } = req.body;

    try {
        if (!text || !sourceLanguage || !targetLanguage) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const [translation] = await translationClient.translateText({
            parent: `projects/${process.env.GOOGLE_CLOUD_PROJECT_ID || 'projectk-419921'}/locations/global`,
            contents: [text],
            mimeType: 'text/plain',
            sourceLanguageCode: sourceLanguage,
            targetLanguageCode: targetLanguage,
        });

        res.json({ translatedText: translation.translations[0].translatedText });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while translating text' });
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
