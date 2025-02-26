const initializeLanguageDetector = async () => {
    try {
      // Step 1: Check capabilities
      const languageDetectorCapabilities = await self.ai.languageDetector.capabilities();
      const canDetect = languageDetectorCapabilities.capabilities;
  
      let detector;
  
      // Step 2: Handle different capability states
      if (canDetect === 'no') {
        console.warn("The language detector isn't usable.");
        return null;
      }
  
      if (canDetect === 'readily') {
        console.log("The language detector can be used immediately.");
        detector = await self.ai.languageDetector.create();
      } else {
        console.log("The language detector requires a model download.");
        detector = await self.ai.languageDetector.create({
          monitor(m) {
            m.addEventListener('downloadprogress', (e) => {
              console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
            });
          },
        });
        await detector.ready;
      }
  
      return detector;
    } catch (err) {
      console.error("Error initializing language detector:", err);
      throw err;
    }
  };

  const detectLanguage = async (text) => {
    try {
      // Initialize the language detector
      const detector = await initializeLanguageDetector();
  
      if (!detector) {
        throw new Error("Language detector is not available.");
      }
  
      // Detect the language of the text
      const [bestResult] = await detector.detect(text);
  
      // Check if the detection result is reliable
      if (bestResult.detectedLanguage === "und" || bestResult.confidence < 0.4) {
        throw new Error("Language detection result is unreliable.");
      }
  
      // Return the detected language
      return bestResult.detectedLanguage;
    } catch (err) {
      console.error("Language detection failed:", err);
      return "Unknown";
    }
  };
  
  // Test the function
  const text = "Hollo my dearest mother";
  detectLanguage(text).then((language) => {
    console.log(`Detected language: ${language}`);
  });


  // Summarize text
  const summarizeText = async (text) => {
    const sourceLanguage = await detectLanguage(text);

    if (sourceLanguage !== "en") {
      console.warn("Summarization is only available for English text.");
      return text;
    }

    const summarizerAvailability = await ai.summarizer.availability();

    if (summarizerAvailability === "unavailable") {
      console.warn("Summarization is unavailable.");
      return text;
    }

    if (summarizerAvailability !== "available") {
      console.log("Summarization is available, but something will have to be downloaded. Hold tight!");
    }

    const summarizer = await ai.summarizer.create();
    const summary = await summarizer.summarize(text);

    return summary;
  };

  // Handle summarization
  const handleSummarize = async () => {
    const summarized = await summarizeText(outputText);
    setSummary(summarized);
  };



// Translator
const checkLanguagePairSupport = async (sourceLanguage, targetLanguage) => {
    try {
      // Check if the Translator API is supported
      if (!('ai' in self && 'translator' in self.ai)) {
        throw new Error("Translator API is not supported.");
      }
  
      // Check if the language pair is available
      const translatorCapabilities = await self.ai.translator.capabilities();
      const languagePairAvailability = translatorCapabilities.languagePairAvailable(sourceLanguage, targetLanguage);
  
      return languagePairAvailability;
    } catch (err) {
      console.error("Error checking language pair support:", err);
      throw err;
    }
  };


  const initializeTranslator = async (sourceLanguage, targetLanguage) => {
    try {
      // Check language pair support
      const languagePairAvailability = await checkLanguagePairSupport(sourceLanguage, targetLanguage);
  
      if (languagePairAvailability === "no") {
        throw new Error("Translation is not supported for the selected language pair.");
      }
  
      let translator;
  
      if (languagePairAvailability === "after-download") {
        // Handle model download progress
        translator = await self.ai.translator.create({
          sourceLanguage,
          targetLanguage,
          monitor(m) {
            m.addEventListener('downloadprogress', (e) => {
              console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
            });
          },
        });
        await translator.ready;
      } else {
        // Create the translator directly
        translator = await self.ai.translator.create({ sourceLanguage, targetLanguage });
      }
  
      return translator;
    } catch (err) {
      console.error("Error initializing translator:", err);
      throw err;
    }
  };


  const translateText = async (text, targetLanguage) => {
    try {
      // Detect the source language of the text
      const sourceLanguage = await detectLanguage(text);
  
      if (sourceLanguage === "Unknown") {
        throw new Error("Could not detect source language.");
      }
  
      // Initialize the translator
      const translator = await initializeTranslator(sourceLanguage, targetLanguage);
  
      // Translate the text
      const translatedText = await translator.translate(text);
  
      return translatedText;
    } catch (err) {
      console.error("Translation failed:", err);
      throw err;
    }
  };




  export {summarizeText, translateText, detectLanguage};