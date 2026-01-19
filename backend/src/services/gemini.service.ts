import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const generateTryOn = async (userImageBase64: string, productImagePath: string) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Aja como um provador virtual inteligente. Pegue a imagem da criança e 'vista' nela o produto de roupa infantil fornecido. Mantenha as características da criança e as proporções da roupa de forma realista. Retorne apenas a imagem processada.";

        // Nota: A API do Gemini Flash aceita imagens via base64 nos 'inlineData'.
        // Aqui estamos simulando a estrutura, em uma implementação real você passaria os buffers formatados.
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: userImageBase64,
                    mimeType: "image/jpeg"
                }
            },
            {
                inlineData: {
                    data: productImagePath, // Poderia ser a URL ou base64 do produto
                    mimeType: "image/jpeg"
                }
            }
        ]);

        const response = await result.response;
        return response.text(); // Ou o formato de imagem retornado pela API
    } catch (error) {
        console.error("Gemini Error:", error);
        throw new Error("Falha ao gerar simulação com Gemini");
    }
};
