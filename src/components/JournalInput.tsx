
import React, { useState } from 'react';
import { LoadingSpinner, SparklesIcon } from './icons';

interface JournalInputProps {
  onSubmit: (entry: string) => void;
  isLoading: boolean;
}

const JournalInput: React.FC<JournalInputProps> = ({ onSubmit, isLoading }) => {
  const [entry, setEntry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (entry.trim() && !isLoading) {
      onSubmit(entry.trim());
      setEntry('');
    }
  };

  return (
    <div className="p-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg sticky top-4 z-10">
      <h2 className="text-xl font-cinzel text-amber-400 mb-3">Scribe Your Day's Tale</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="What happened today? Detail your triumphs, struggles, or simple observations..."
          className="w-full h-32 bg-slate-900/70 border border-slate-600 rounded-md p-3 text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!entry.trim() || isLoading}
          className="w-full mt-3 flex items-center justify-center bg-amber-600 hover:bg-amber-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-slate-900 font-bold py-2 px-4 rounded-md shadow-md shadow-amber-600/20 transition-all duration-300"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              Conjuring Your Chapter...
            </>
          ) : (
            <>
              <SparklesIcon />
              Fantasify My Entry
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default JournalInput;
