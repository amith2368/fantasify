
import React from 'react';
import { StoryChapter } from '../types';

interface StoryDisplayProps {
  chapters: StoryChapter[];
  characterName: string;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ chapters, characterName }) => {
  if (chapters.length === 0) {
    return (
      <div className="text-center p-8 mt-8 bg-slate-800/30 border border-slate-700 rounded-lg">
        <h2 className="text-2xl font-cinzel text-amber-400">The Chronicle of {characterName}</h2>
        <p className="mt-4 text-slate-400">Your story awaits its first chapter. Write in your journal above to begin the legend.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-12">
      {chapters.slice().reverse().map((chapter, index) => (
        <div 
          key={chapter.id}
          className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg overflow-hidden transition-all duration-500 ${index === 0 ? 'shadow-amber-500/20 border-amber-800/50' : ''}`}
        >
          <img src={chapter.imageUrl} alt={chapter.chapterTitle} className="w-full h-64 object-cover" />
          <div className="p-6">
            <h3 className="text-2xl font-cinzel text-amber-400 mb-2">{chapter.chapterTitle}</h3>
            <p className="text-sm text-slate-400 mb-4">
              {new Date(chapter.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{chapter.story}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoryDisplay;
