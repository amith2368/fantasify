
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { CharacterProfile, StoryChapter } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

if (!API_KEY) {
  // This check is a safeguard. The polyfill in index.html prevents a crash,
  // but a real API key must be provided in the environment for this to work.
  console.warn("API_KEY is not set. Story generation will fail.");
}

if (!UNSPLASH_ACCESS_KEY) {
    console.warn("UNSPLASH_ACCESS_KEY is not set. Falling back to basic random images. For better results, provide a key.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const STORY_MODEL = 'gemini-2.5-flash-preview-04-17';

const parseStoryResponse = (responseText: string): { chapterTitle: string, story: string, imagePrompt: string } => {
  const titleMatch = responseText.match(/Title: (.*)/);
  const imageMatch = responseText.match(/\[Image: (.*?)\]/);

  const chapterTitle = titleMatch ? titleMatch[1].trim() : "An Unexpected Chapter";
  const imagePrompt = imageMatch ? imageMatch[1].trim() : "A fantasy landscape, epic, detailed.";

  let story = responseText;
  if (titleMatch) story = story.replace(titleMatch[0], '');
  if (imageMatch) story = story.replace(imageMatch[0], '');

  return { chapterTitle, story: story.trim(), imagePrompt };
};

export const generateStoryChapter = async (
  profile: CharacterProfile,
  storyHistory: StoryChapter[],
  journalEntryText: string
): Promise<{ chapterTitle: string, story: string, imagePrompt: string }> => {
  const storyHistoryText = storyHistory.length > 0
    ? storyHistory.slice(-5).map(c => `Chapter: ${c.chapterTitle}\n${c.story}`).join('\n\n---\n\n')
    : "This is the very first chapter. The adventure is just beginning.";

  const systemInstruction = `You are 'Fantasify', a master storyteller and game master for an epic fantasy RPG. Your task is to transform a user's daily journal entry into a thrilling chapter of their character's adventure. Maintain continuity with previous chapters, weaving in new plot twists, allies, and challenges. The tone should be heroic, mysterious, and adventurous.

Your output MUST follow this format strictly:
1. Start with "Title: [Your Creative Chapter Title]".
2. Write the story chapter.
3. Conclude with a short, vivid, one-sentence description for an accompanying image, enclosed in square brackets like [Image: a description].`;

  const prompt = `
Character Name: ${profile.name}
Setting: The ${profile.setting}

--- PREVIOUS STORY (Most Recent Chapters) ---
${storyHistoryText}
--- END PREVIOUS STORY ---

--- LATEST JOURNAL ENTRY (Reflect this in the story) ---
${journalEntryText}
--- END LATEST JOURNAL ENTRY ---

Now, write the next chapter of the story, following the required format.
`;

  try {
    if (!API_KEY) {
        throw new Error("Cannot generate story: Gemini API Key is missing.");
    }
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: STORY_MODEL,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
        topP: 0.9,
        topK: 40,
      }
    });

    const text = response.text ?? "";
    return parseStoryResponse(text);
  } catch (error) {
    console.error("Error generating story chapter:", error);
    throw new Error("Failed to conjure a new chapter. The mists of creation are cloudy.");
  }
};

export const generateChapterImage = async (prompt: string, characterName: string, setting: string): Promise<string> => {
    const cleanedPrompt = prompt.replace(/[^a-zA-Z0-9 ]/g, "").split(' ').join(',');
    const cleanedSetting = setting.replace(/[^a-zA-Z0-9 ]/g, "").split(' ').join(',');
    const keywords = `fantasy,${cleanedSetting},${characterName},${cleanedPrompt}`;
    const fallbackUrl = `https://source.unsplash.com/1024x768/?${keywords}&t=${Date.now()}`;

    // If no Unsplash key is provided, use the simple, key-less source URL as a fallback.
    if (!UNSPLASH_ACCESS_KEY) {
      return fallbackUrl;
    }

    // Use the full Unsplash API for better, more relevant images.
    const url = new URL('https://api.unsplash.com/search/photos');
    url.searchParams.append('query', keywords);
    url.searchParams.append('per_page', '20');
    url.searchParams.append('orientation', 'landscape');
    url.searchParams.append('order_by', 'relevant');

    try {
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          'Accept-Version': 'v1'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Unsplash API Error:", errorData.errors);
        throw new Error(`Unsplash API error: ${response.status}. ${errorData.errors?.[0] || 'Check your Access Key.'}`);
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const photo = data.results[randomIndex];
        return photo.urls.regular;
      } else {
        console.warn(`No Unsplash images found for query: "${keywords}". Using fallback.`);
        return fallbackUrl;
      }

    } catch (error) {
      console.error("Error fetching from Unsplash API:", error);
      // On any error, return the fallback URL with specific keywords.
      return fallbackUrl;
    }
};
