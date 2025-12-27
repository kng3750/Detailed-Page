
import { GoogleGenAI, Type } from "@google/genai";
import { ProductDetail } from "../types";

export const geminiService = {
  async analyzeAndCopywrite(base64Image: string): Promise<ProductDetail> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image.split(',')[1],
      },
    };

    const prompt = `
      Analyze this product and create a professional Korean e-commerce detail page design strategy.
      1. Identify product category and core features.
      2. Define target audience in Korea.
      3. Create Korean copywriting (Name, Tagline, Description, 3 Benefits).
      4. Suggest a Brand Color Palette (Hex codes) that matches the product aesthetic.
      
      Respond STRICTLY in JSON format without markdown code blocks.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              productName: { type: Type.STRING },
              tagline: { type: Type.STRING },
              description: { type: Type.STRING },
              targetAudience: { type: Type.STRING },
              keyBenefits: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                  },
                },
              },
              specifications: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    value: { type: Type.STRING },
                  },
                },
              },
              marketingCopy: { type: Type.STRING },
              brandColors: {
                type: Type.OBJECT,
                properties: {
                  primary: { type: Type.STRING },
                  secondary: { type: Type.STRING },
                  accent: { type: Type.STRING },
                },
              }
            },
            required: ["productName", "tagline", "description", "targetAudience", "keyBenefits", "specifications", "marketingCopy", "brandColors"]
          },
        },
      });

      const jsonStr = response.text;
      if (!jsonStr) throw new Error("응답 결과가 비어있습니다.");
      
      // Remove potential markdown blocks just in case
      const cleaned = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (error) {
      console.error("Analysis Error:", error);
      throw new Error("제품 분석 중 문제가 발생했습니다.");
    }
  },

  async generateImage(base64Image: string, prompt: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image.split(',')[1],
                mimeType: 'image/jpeg',
              },
            },
            { text: prompt },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
      throw new Error("이미지 생성 결과가 없습니다.");
    } catch (error) {
      console.error("Image Gen Error:", error);
      throw new Error("이미지 생성 중 문제가 발생했습니다.");
    }
  }
};
