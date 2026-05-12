import { GoogleGenAI, Type } from '@google/genai';

// Initialize the Gemini API client
// The GEMINI_API_KEY environment variable is automatically injected
// by the AI Studio platform.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface GeneratedScene {
  sceneNumber: string;
  narration: string;
  imagePrompt: string;
  videoPrompt: string;
}

export interface GeneratedResult {
  overview: string;
  scenes: GeneratedScene[];
}

export interface FactItem {
  title: string;
  description: string;
}

export async function generateFactsList(systemInstruction: string, userInput: string): Promise<FactItem[]> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing. Please configure it in the AI Studio Secrets panel.');
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: [
        {
          role: 'user',
          parts: [{ text: userInput }]
        }
      ],
      config: {
        systemInstruction: systemInstruction + `\n\nReturn the output exactly as JSON according to the schema.`,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: 'A list of interesting facts',
          items: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: 'The title of the fact'
              },
              description: {
                type: Type.STRING,
                description: 'A brief explanation of the fact'
              }
            },
            required: ['title', 'description']
          }
        }
      }
    });

    const textOutput = response.text || '[]';
    const parsed = JSON.parse(textOutput) as FactItem[];
    return parsed;
  } catch (error) {
    console.error('Error generating facts:', error);
    throw error;
  }
}

export async function generateSinglePrompt(systemInstruction: string, parts: any[]): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing. Please configure it in the AI Studio Secrets panel.');
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: [
        {
          role: 'user',
          parts: parts
        }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || '';
  } catch (error) {
    console.error('Error generating single prompt:', error);
    throw error;
  }
}

export async function generatePrompt(systemInstruction: string, userInput: string): Promise<GeneratedResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing. Please configure it in the AI Studio Secrets panel.');
  }

  try {
    const response = await ai.models.generateContent({
      // We use the modern gemini-3.1-pro-preview which is excellent for structured tasks
      model: 'gemini-3.1-pro-preview',
      contents: [
        {
          role: 'user',
          parts: [{ text: userInput }]
        }
      ],
      config: {
        systemInstruction: systemInstruction + `\n\nReturn the output exactly as JSON according to the schema.`,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: {
              type: Type.STRING,
              description: 'General summary, hook explanation, or introductory markdown text for this generation.'
            },
            scenes: {
              type: Type.ARRAY,
              description: 'An array of generated segments, scenes, facts, or storyboard parts.',
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: {
                    type: Type.STRING,
                    description: 'Title or number of the scene (e.g. "Scene 1", "Fact 1", "Hook", "Body")'
                  },
                  narration: {
                    type: Type.STRING,
                    description: 'The script, voiceover, text, dialogue, or narration for this scene. Can contain markdown.'
                  },
                  imagePrompt: {
                    type: Type.STRING,
                    description: 'English prompt for AI image generation (Midjourney/DALL-E) for this scene.'
                  },
                  videoPrompt: {
                    type: Type.STRING,
                    description: 'English prompt for AI video generation (Kling/Sora/Runway) for this scene. MUST include the spoken narration or dialogue text inside the video prompt.'
                  }
                },
                required: ['sceneNumber', 'narration', 'imagePrompt', 'videoPrompt']
              }
            }
          },
          required: ['overview', 'scenes']
        }
      }
    });

    const textOutput = response.text || '{}';
    const parsed = JSON.parse(textOutput) as GeneratedResult;
    return parsed;
  } catch (error) {
    console.error('Error generating prompt:', error);
    throw error;
  }
}
