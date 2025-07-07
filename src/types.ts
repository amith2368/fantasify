
export interface CharacterProfile {
  name: string;
  setting: string;
}

export interface JournalEntry {
  id: string;
  text: string;
  timestamp: string;
}

export interface StoryChapter {
  id: string;
  journalEntryId: string;
  chapterTitle: string;
  story: string;
  imageUrl: string;
  timestamp: string;
}
