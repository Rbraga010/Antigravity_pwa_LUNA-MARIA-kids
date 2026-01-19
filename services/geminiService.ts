
import { GoogleGenAI } from "@google/genai";

// Always use new GoogleGenAI({apiKey: process.env.API_KEY}) as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateColoringImage = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Desenho infantil para colorir em preto e branco (contorno linear simples): ${prompt}. Sem sombras, apenas linhas pretas no fundo branco.` }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    // Iterate through candidates and parts to find the image part.
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Erro ao gerar imagem para colorir:", error);
    return null;
  }
};

export const generateStorySnippet = async (theme: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Conte uma história curta e mágica para crianças sobre ${theme}. Máximo 100 palavras.`,
      config: {
        systemInstruction: "Você é um contador de histórias gentil da Luna Maria Kids. Use palavras simples e acolhedoras."
      }
    });
    // .text is a property, not a method.
    return response.text || "Era uma vez em um reino encantado...";
  } catch (error) {
    console.error("Erro ao gerar história:", error);
    return "Era uma vez em um reino de nuvens de algodão doce...";
  }
};
