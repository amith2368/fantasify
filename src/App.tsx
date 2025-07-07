
import React, { useState, useEffect, useCallback } from 'react';
import SetupScreen from './components/SetupScreen';
import JournalScreen from './components/JournalScreen';
import { CharacterProfile, StoryChapter, JournalEntry } from './types';
import { generateStoryChapter, generateChapterImage } from './services/geminiService';

const App: React.FC = () => {
  const [profile, setProfile] = useState<CharacterProfile | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [storyChapters, setStoryChapters] = useState<StoryChapter[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('fantasify-profile');
      const savedChapters = localStorage.getItem('fantasify-chapters');
      const savedJournal = localStorage.getItem('fantasify-journal');

      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
      if (savedChapters) {
        setStoryChapters(JSON.parse(savedChapters));
      }
      if (savedJournal) {
        setJournalEntries(JSON.parse(savedJournal));
      }
    } catch (e) {
      console.error("Failed to load from storage", e);
      setError("Could not load your saved adventure. The ancient scrolls may be corrupted.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSave = useCallback(() => {
    if (isLoading) return; // Don't save while loading initial state
    try {
        if(profile) {
            localStorage.setItem('fantasify-profile', JSON.stringify(profile));
        }
        if(storyChapters.length > 0) {
            localStorage.setItem('fantasify-chapters', JSON.stringify(storyChapters));
        }
        if(journalEntries.length > 0) {
            localStorage.setItem('fantasify-journal', JSON.stringify(journalEntries));
        }
    } catch (e) {
      console.error("Failed to save to storage", e);
      setError("Your progress could not be saved to the grand library.");
    }
  }, [profile, storyChapters, journalEntries, isLoading]);

  useEffect(() => {
      handleSave();
  }, [handleSave]);


  const handleSetupComplete = (newProfile: CharacterProfile) => {
    setProfile(newProfile);
    setStoryChapters([]);
    setJournalEntries([]);
    localStorage.removeItem('fantasify-chapters');
    localStorage.removeItem('fantasify-journal');
  };

  const handleNewEntry = async (entryText: string) => {
    if (!profile) return;
    setIsLoading(true);
    setError(null);

    const newJournalEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      text: entryText,
      timestamp: new Date().toISOString(),
    };
    
    setJournalEntries(prev => [...prev, newJournalEntry]);

    try {
      const { chapterTitle, story, imagePrompt } = await generateStoryChapter(profile, storyChapters, entryText);
      const imageUrl = await generateChapterImage(imagePrompt, profile.name, profile.setting);

      const newChapter: StoryChapter = {
        id: `chapter-${Date.now()}`,
        journalEntryId: newJournalEntry.id,
        chapterTitle,
        story,
        imageUrl,
        timestamp: new Date().toISOString(),
      };

      setStoryChapters(prev => [...prev, newChapter]);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "An unknown arcane error occurred.");
      // Rollback journal entry on failure
      setJournalEntries(prev => prev.filter(j => j.id !== newJournalEntry.id));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    if (window.confirm("Are you sure you want to erase this entire adventure? This cannot be undone.")) {
        setIsLoading(true);
        setProfile(null);
        setStoryChapters([]);
        setJournalEntries([]);
        localStorage.removeItem('fantasify-profile');
        localStorage.removeItem('fantasify-chapters');
        localStorage.removeItem('fantasify-journal');
        setIsLoading(false);
    }
  }

  if (isLoading && !profile) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <h1 className="text-3xl font-cinzel text-amber-400 animate-pulse">Unfurling the Map...</h1>
        </div>
      )
  }

  if (!profile) {
    return <SetupScreen onSetupComplete={handleSetupComplete} />;
  }

  return (
    <JournalScreen
      profile={profile}
      chapters={storyChapters}
      onNewEntry={handleNewEntry}
      isLoading={isLoading}
      error={error}
      onReset={handleReset}
    />
  );
};

export default App;
