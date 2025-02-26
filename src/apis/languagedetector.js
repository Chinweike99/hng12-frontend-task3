

 const initializeLanguageDetector = async() =>{
    try {
        const languageDetectorCapability = await self.ai.languageDetetcor.capabilities();
        const canDetect = languageDetectorCapability.capabilities

        let detector;
        if(canDetect === "no"){
            console.warn("The language detector is not detectable.");
        }
        if(canDetect === "readily"){
            console.log("The language detector can be used immediately");
            detector = await self.ai.languageDetetcor.create();
        }else{
            console.log("Language detector requires a model download");
            detector = await self.ai.languageDetetcor.create({
                monitor(m){
                    m.addEventListener('downloadprogress', (e)=>{
                        console.log(`Download ${e.loaded} of ${e.total} bytes`)
                    });
                },
            });
            await detector.ready;
        }
        return detector;
    } catch (error) {
        console.error("Error initializing language detector", error);
        throw error
    }
}

//Detect Language
export const detectLanguage = async (text) =>{
    try {
        const detector = await initializeLanguageDetector();
        if(!detector){
            throw new Error("Language detector is not available.")
        }
        const [bestResult] = await detector.detect(text);
        if(bestResult.detectedLanguage === "und" || bestResult.confidence < 0.4){
            throw new Error("Language detection result is unavailable");
        }
        return bestResult.detectedLanguage;

    } catch (error) {
        console.error("Language detection failed", error);
        return "Unknwon";
    }
}







// Summerize Text
export const SummerizeText = async(text) =>{
    const sourceLanguage = await detectLanguage(text);
    if(sourceLanguage !== "en" ){
        console.warn("summerization is only available for english text");
        return text;
    }
    
    const summarizerAvailability = await ai.summerizer.availability();
    if(summarizerAvailability === "unavailable"){
        console.warn("Summerization is unavailable");
        return text;
    }

    if(summarizerAvailability !== "available"){
        console.log("Summerization is available, but you need to download something")
    }
    const summerizer = await ai.summerizer.create();
    const summary = await summerizer.summerize(text);
    return summary;
}



// Translate Text
const checkLanguagePairSupport = async(sourceLanguage, targetLanguage)=>{
    try {
        if((!'ai' in self && 'translator' in self.ai)){
            throw new Error("Translator API is not supported");
        }

        const translatorCapabilities = await self.ai.translator.capabilities();
        const languagePairAvailability =  translatorCapabilities.languagePairAvailability(sourceLanguage, targetLanguage);
        return languagePairAvailability;

    } catch (error) {
        console.error("Error checking language pair support", err);
        throw error
    }
}



 const initializeTranslator = async(sourceLanguage, targetLanguage)=>{
    try {
        const languagePairAvailability = await checkLanguagePairSupport(sourceLanguage, targetLanguage);
        if(languagePairAvailability === "no"){
            throw new Error("Translation is not supported for the selected Language pair");
        }
        let translator;

        if(languagePairAvailability === "after-download"){
            translator = await self.ai.translator.create({
                sourceLanguage,
                targetLanguage,
                monitor(m){
                    m.addEventListener('downloadprogress', (e) => {
                        console.log(`Download ${e.loaded} of ${e.target} bytes`);
                    });
                }
            });
            await translator.ready;
        }else{
            translator = await self.ai.translator.create({sourceLanguage, targetLanguage});
        }
        return translator;
    } catch (error) {
        console.error("Error initialzing translator:", err);
        throw error;
    }
}
export const translateText = async (text, targetLanguage) => {
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