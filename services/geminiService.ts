
import { GoogleGenAI, Type } from "@google/genai";

// Safe access to API Key
const getApiKey = () => {
    try {
        // @ts-ignore
        if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
            // @ts-ignore
            return process.env.API_KEY;
        }
    } catch (e) {
        // Ignore error
    }
    return '';
};

// Lazy initialization to prevent module-level crashes
let aiInstance: GoogleGenAI | null = null;

const getAi = () => {
    if (!aiInstance) {
        const key = getApiKey();
        if (key) {
            aiInstance = new GoogleGenAI({ apiKey: key });
        } else {
            console.warn("Gemini API Key is missing. AI features will not work.");
        }
    }
    return aiInstance;
};

// Helper to check for key in demo environment for paid models
const ensureApiKey = async () => {
  if (typeof window !== 'undefined' && (window as any).aistudio) {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
      // Re-init with new key if possible, or just return existing if env var was set
      return new GoogleGenAI({ apiKey: getApiKey() });
    }
  }
  return getAi();
};

// --- Text & Reasoning ---

export const generatePostEnhancement = async (draftText: string): Promise<string> => {
  const ai = getAi();
  if (!ai) return draftText;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Rewrite this for social media (engaging, professional): "${draftText}"`,
    });
    return response.text || draftText;
  } catch (error) {
    console.error("Enhance Error:", error);
    return draftText;
  }
};

export const draftPostFromTopic = async (topic: string): Promise<string> => {
    const ai = getAi();
    if (!ai) return "";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Write a short, engaging social media post about this topic: "${topic}". Include emojis.`
        });
        return response.text || "";
    } catch (e) {
        console.error("Drafting error", e);
        return "";
    }
}

export const summarizeText = async (text: string): Promise<string> => {
    const ai = getAi();
    if (!ai) return "AI unavailable";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: `Summarize this text in 2 short sentences: "${text}"`
        });
        return response.text || "Could not summarize.";
    } catch (e) {
        return "Summary unavailable.";
    }
}

export const chatWithBot = async (
  history: {role: 'user' | 'model', parts: [{text: string}]}[], 
  message: string,
  mode: 'fast' | 'smart' | 'creative' = 'fast'
): Promise<string> => {
  const ai = getAi();
  if (!ai) return "I am unable to connect to my brain (API Key missing).";

  try {
    let modelName = 'gemini-2.5-flash-lite'; // Default Fast
    let config: any = {
      systemInstruction: "You are WTBot, a helpful AI assistant for WTConnect. You were created by Akin S. Sokpah from Liberia. You are professional, witty, and extremely capable.",
    };

    if (mode === 'smart') {
      modelName = 'gemini-3-pro-preview';
      // Enable thinking for complex tasks with max budget
      config.thinkingConfig = { thinkingBudget: 32768 }; 
      // Add tools for smart mode
      config.tools = [{ googleSearch: {} }, { googleMaps: {} }];
    } 

    const chat = ai.chats.create({
      model: modelName,
      config,
      history: history
    });

    const result = await chat.sendMessage({ message });
    
    // Check for grounding
    const grounding = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
    let text = result.text || "I didn't catch that.";
    
    if (grounding && grounding.length > 0) {
      text += "\n\nSources:\n";
      grounding.forEach((chunk: any) => {
        if (chunk.web?.uri) text += `- [${chunk.web.title}](${chunk.web.uri})\n`;
      });
    }

    return text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm having trouble connecting right now. Please try again.";
  }
};

// --- Vision & Media Understanding ---

export const analyzeImage = async (base64Image: string, prompt: string): Promise<string> => {
    const ai = getAi();
    if (!ai) return "AI unavailable";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/png', data: base64Image } },
                    { text: prompt || "Describe this image in detail." }
                ]
            }
        });
        return response.text || "Could not analyze image.";
    } catch (e) {
        console.error(e);
        return "Error analyzing image.";
    }
}

// --- Image Generation & Editing ---

export const generateImage = async (prompt: string, aspectRatio: '1:1' | '16:9' | '4:3' | '3:4' | '9:16' = '1:1'): Promise<string | null> => {
    const activeAi = await ensureApiKey();
    if (!activeAi) return null;
    try {
        const response = await activeAi.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: { parts: [{ text: prompt }] },
            config: {
                imageConfig: { aspectRatio, imageSize: '2K' }
            }
        });
        
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (e) {
        console.error("Image Gen Error:", e);
        return null;
    }
}

export const editImage = async (base64Image: string, prompt: string): Promise<string | null> => {
    const ai = getAi();
    if (!ai) return null;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/png', data: base64Image } },
                    { text: prompt }
                ]
            }
        });
        
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (e) {
        console.error("Image Edit Error", e);
        return null;
    }
}

// --- Video Generation (Veo) ---

export const generateVideo = async (prompt: string, aspectRatio: '16:9' | '9:16' = '16:9'): Promise<string | null> => {
    const activeAi = await ensureApiKey();
    if (!activeAi) return null;
    try {
        let operation = await activeAi.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio
            }
        });

        // Poll for completion
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s
            operation = await activeAi.operations.getVideosOperation({ operation });
        }

        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (videoUri) {
            // Fetch the actual bytes
            const res = await fetch(`${videoUri}&key=${getApiKey()}`);
            const blob = await res.blob();
            return URL.createObjectURL(blob);
        }
        return null;

    } catch (e) {
        console.error("Veo Error:", e);
        return null;
    }
}

// --- Audio Services ---

export const textToSpeech = async (text: string): Promise<ArrayBuffer | null> => {
    const ai = getAi();
    if (!ai) return null;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-tts',
            contents: { parts: [{ text }] },
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
                }
            }
        });

        const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64) {
            const binaryString = atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        }
        return null;
    } catch (e) {
        console.error("TTS Error:", e);
        return null;
    }
}

export const transcribeAudio = async (base64Audio: string): Promise<string> => {
    const ai = getAi();
    if (!ai) return "";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { mimeType: 'audio/mp3', data: base64Audio } }, // Assuming mp3/wav
                    { text: "Transcribe this audio exactly." }
                ]
            }
        });
        return response.text || "";
    } catch (e) {
        console.error("Transcription Error:", e);
        return "";
    }
}

// --- Grounding (News/Weather) ---

export const getGroundingInfo = async (query: string): Promise<any> => {
    const ai = getAi();
    if (!ai) return { text: "AI unavailable", chunks: [] };
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: query,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });
        
        // Basic parsing of the result for display
        return {
            text: response.text,
            chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
        };
    } catch (e) {
        return { text: "Unavailable", chunks: [] };
    }
}
