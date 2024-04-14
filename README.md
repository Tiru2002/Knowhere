# Knowhere Translator Project

Welcome to the Knowhere Translator Project! This project is designed to unlock the world's knowledge by providing language translation services for text and documents. It uses Google Cloud's Translation API to translate between various languages.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [License](#license)
- [Demo Video](#demo-video)

## Features

- **Text Translation**: Translate text from one language to another.
- **Document Translation**: Translate documents (PDF, DOCX, TXT) while preserving layout.
- **Library Section**: Browse and translate selected books' content into different languages.
- **Help Section**: Instructions on how to use the application.

## Getting Started

### Prerequisites

- Node.js (v14 or later) installed
- Google Cloud account and credentials for the Translation API

### Installation

1. Clone this repository:

    ```bash
    git clone <repository-url>
    ```

2. Navigate to the project directory:

    ```bash
    cd <project-directory>
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set the path to your Google Cloud service account key file in `process.env.GOOGLE_APPLICATION_CREDENTIALS` in `server.js`.

5. Start the server:

    ```bash
    npm start
    ```

The server should now be running on `http://localhost:3000`.

## Usage

- **Text Translation**: Go to the "Text Translator" section, input the text you want to translate, select the source and target languages, and click "Translate".
  
- **Document Translation**: Go to the "Document Translator" section, upload the document file you want to translate, select the source and target languages, and click "Translate". Download the translated document when available.

- **Library**: Browse through the library of books and translate content as desired.

- **Help**: Refer to the "Help" section for instructions on how to use the application.

## API Endpoints

- **POST /translate/text**: Endpoint for translating text. Expects a JSON request body with the fields `text`, `sourceLanguage`, and `targetLanguage`.
  
- **POST /translate/document**: Endpoint for translating documents. Expects a form data request with a file upload (`documentFile`), `sourceLanguage`, and `targetLanguage`.

## Technologies Used

- **Backend**:
  - Node.js
  - Express.js
  - Google Cloud Translation API
  - pdfmake for PDF generation
  - pdf-parse for PDF file parsing
  - unzipper for DOCX file parsing

- **Frontend**:
  - HTML/CSS/JavaScript
  - [pdfmake](https://pdfmake.github.io/docs/) for generating PDF files

## License

This project is open-source and available under the [MIT License](LICENSE). Please refer to the `LICENSE` file for details.

## Demo Video

For a demonstration of the application and its features, watch the [demo video](<demo-video-link>).

