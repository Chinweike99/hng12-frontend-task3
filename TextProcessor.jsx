import React, { useState, useEffect, useRef } from "react";
import {
  detectLanguage,
  summarizeText,
  translateText,
} from "./src/apis/languagedetector.js";

const TextProcessor = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  if ("ai" in self && "languageDetector" in self.ai) {
    console.log("Language Detector API is available!");
  } else {
    console.warn("Language Detector API is not available.");
  }

  if ("ai" in self && "translator" in self.ai) {
    console.log("Translator API is supported.");
  } else {
    console.warn("Translator API is not supported.");
  }

  useEffect(() => {
    if (outputText) {
      detectLanguage(outputText).then((language) =>
        setDetectedLanguage(language)
      );
    }
  }, [outputText]);

  const handleSend = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text.");
      return;
    }
    setError("");
    setOutputText(inputText);
    try {
      const language = await detectLanguage(inputText);
      setDetectedLanguage(language);
    } catch (err) {
      console.error("Language detection failed:", err);
      setError("Failed to detect language. Please try again.");
    }
    setInputText("");
  };

  useEffect(() => {
    if (outputText) {
      detectLanguage(outputText).then((language) =>
        setDetectedLanguage(language)
      );
    }
  }, [outputText]);

  const handleTranslate = async () => {
    try {
      const translated = await translateText(outputText, targetLanguage);
      setTranslatedText(translated);
    } catch (err) {
      console.error("Translation failed:", err);
      setError("Failed to translate text. Please try again.");
    }
  };

  const handleSummarize = async () => {
    try {
        const summarized = await summarizeText(outputText);
        setSummary(summarized);
        if(!summarized){
            setError("Summarization is not available.")
        }
    } catch (error) {
        console.error("Summerization failed:", error);
      setError("Failed to summarize text..");
    }
  };



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [outputText]);

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  return (
    <div className="container">
      <div className="Textprocessor-container">
        <header>
          <h1>AI Text Processor</h1>
        </header>

        {error && (
          <div className="error-container" role="alert">
            <p>{error}</p>
            <button aria-label="Dismiss error" onClick={() => setError(null)}>
              ×
            </button>
          </div>
        )}

        <main>
          <div className="chat-container">
            <div className="messages-container">
              {outputText && (
                <div className="message">
                  <div className="message-content">
                    <p>{outputText}</p>
                    {detectedLanguage && (
                      <span className="language-tag">
                        Detected Language: {detectedLanguage}
                      </span>
                    )}
                  </div>

                  <div className="message-actions">
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="pt">Portuguese</option>
                      <option value="es">Spanish</option>
                      <option value="ru">Russian</option>
                      <option value="tr">Turkish</option>
                      <option value="fr">French</option>
                    </select>
                    <button onClick={handleTranslate}>Translate</button>
                  </div>

                  {translatedText && (
                    <div className="processed-results">
                      <div className="processed-item">
                        <div className="processed-tag">
                          Translation ({targetLanguage})
                        </div>
                        <p>{translatedText}</p>
                      </div>
                    </div>
                  )}

                  {/* Summarization Section */}
                  <div className="summerize">
                    {outputText.length > 150 && detectedLanguage === "en" && (
                      <button
                        onClick={handleSummarize}
                        className="p-2 bg-green-500 text-white rounded"
                      >
                        Summarize
                      </button>
                    )}
                    {summary && (
                      <div className="mt-2 p-4 border rounded bg-gray-100">
                        {summary}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="input-container">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste text here..."
                aria-label="Input text for processing"
                onKeyDown={handleKeyDown}
              />
              <button className="send-button" onClick={handleSend}>
                Send
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TextProcessor;
