const initializeLanguageDetector = async () => {
    try {
      const languageDetectorCapabilities = await self.ai.languageDetector.capabilities();
      const canDetect = languageDetectorCapabilities.capabilities;
  
      let detector;
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
      const detector = await initializeLanguageDetector();
      if (!detector) {
        throw new Error("Language detector is not available.");
      }
      const [bestResult] = await detector.detect(text);
      if (bestResult.detectedLanguage === "und" || bestResult.confidence < 0.4) {
        throw new Error("Language detection result is unreliable.");
      }
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

const summarizeText = async (text) => {
    if (!("ai" in self) || !("summarizer" in self.ai)) {
        console.warn("Summarizer API is not available.");
        return text;
    }

    const sourceLanguage = await detectLanguage(text);
    if (sourceLanguage !== "en") {
        console.warn("Summarization is only available for English text.");
        return text;
    }

    try {
        // Check summarizer capabilities
        const summarizerCapabilities = await self.ai.summarizer.capabilities();
        const canSummarize = summarizerCapabilities.available;

        if (canSummarize === "no") {
            console.warn("Summarization is not available.");
            return text;
        }

        let summarizer;
        if (canSummarize === "after-download") {
            summarizer = await self.ai.summarizer.create({
                monitor(m) {
                    m.addEventListener("downloadprogress", (e) => {
                        console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
                    });
                },
            });
            await summarizer.ready;
        } else {
            summarizer = await self.ai.summarizer.create();
        }
        const summary = await summarizer.summarize(text);
        return summary;
    } catch (error) {
        console.error("Summarization failed:", error);
        return text;
    }
};



// Translator
const checkLanguagePairSupport = async (sourceLanguage, targetLanguage) => {
    try {
      // Check if the Translator API is supported
      if (!('ai' in self && 'translator' in self.ai)) {
        throw new Error("Translator API is not supported.");
      }
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
      const translator = await initializeTranslator(sourceLanguage, targetLanguage);
      const translatedText = await translator.translate(text);
      return translatedText;
    } catch (err) {
      console.error("Translation failed:", err);
      throw err;
    }
  };




  export {summarizeText, translateText, detectLanguage};