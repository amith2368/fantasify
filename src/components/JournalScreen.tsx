
import React from 'react';
import { CharacterProfile, StoryChapter } from '../types';
import JournalInput from './JournalInput';
import StoryDisplay from './StoryDisplay';

interface JournalScreenProps {
  profile: CharacterProfile;
  chapters: StoryChapter[];
  onNewEntry: (entry: string) => void;
  isLoading: boolean;
  error: string | null;
  onReset: () => void;
}

const JournalScreen: React.FC<JournalScreenProps> = ({ profile, chapters, onNewEntry, isLoading, error, onReset }) => {
  return (
    <div className="min-h-screen bg-slate-900 bg-fixed" style={{backgroundImage: 'radial-gradient(circle at top right, rgba(120, 50, 90, 0.1), transparent 40%), radial-gradient(circle at bottom left, rgba(50, 80, 120, 0.1), transparent 50%)'}}>
      <header className="py-4 px-6 bg-slate-900/70 backdrop-blur-md border-b border-slate-700 flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-2xl text-amber-400">Fantasify</h1>
        <div className="text-right">
          <p className="font-bold text-slate-200">{profile.name}</p>
          <p className="text-sm text-slate-400">{profile.setting}</p>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <aside className="md:col-span-1 h-fit md:sticky top-24">
           <JournalInput onSubmit={onNewEntry} isLoading={isLoading} />
           {error && (
             <div className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
               <p className="font-bold">An ancient curse has struck!</p>
               <p className="text-sm">{error}</p>
             </div>
            )}
        </aside>
        <div className="md:col-span-2">
          <StoryDisplay chapters={chapters} characterName={profile.name} />
        </div>
      </main>

      <footer className="text-center p-6 mt-8">
        <button onClick={onReset} className="text-sm text-slate-500 hover:text-amber-500 transition-colors">
          Reset Adventure & Start Anew
        </button>
      </footer>
    </div>
  );
};

export default JournalScreen;
