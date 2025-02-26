# HNG12 Front-End Task 3: AI Text Processor

## Overview
AI Text Processor is a React-based web application that allows users to process text using AI-powered tools. It can detect the language of the input text, translate it into multiple target languages, and summarize long English texts.

## Features
- **Language Detection**: Automatically detects the language of the provided text.
- **Translation**: Supports translation to multiple languages including English, Spanish, Portuguese, Russian, Turkish, and French.
- **Summarization**: Provides a summary of long English texts.
- **User-friendly UI**: Simple and interactive interface.

## Technologies Used
- React.js (with Hooks)
- JavaScript (ES6+)
- AI APIs for language detection, translation, and summarization

## Installation
To set up the project locally, follow these steps:

1. **Clone the repository**:
   ```sh
   git clone https://github.com//your-repo.git
   cd your-repo
   ```

2. **Install dependencies**:
   ```sh
   yarn install
   ```

3. **Run the development server**:
   ```sh
   yarn start
   ```
   The app will be available at `http://localhost:3000`.

## Usage
1. Type or paste your text into the input field.
2. Click **Send** to process the text.
3. The app will detect the language and display it.
4. Choose a target language from the dropdown and click **Translate** to translate the text.
5. If the detected language is English and the text is long enough, click **Summarize** to generate a summary.

## Project Structure
```
.
├── src
│   ├── components
│   │   ├── TextProcessor.js  # Main component
│   │   ├── languagedetector.js  # API integrations for language detection, translation, and summarization
│   ├── styles
│   ├── App.js
│   ├── index.js
│   ├── ...
└── package.json
```

## API Integration
This project relies on AI-powered APIs for language detection, translation, and summarization. Ensure that the required AI services are available before using the app.

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Add new feature"`).
4. Push to your branch (`git push origin feature-branch`).
5. Open a pull request.

