
import React, { useState } from 'react';
import { CharacterProfile } from '../types';
import { BookOpenIcon } from './icons';

interface SetupScreenProps {
  onSetupComplete: (profile: CharacterProfile) => void;
}

const SETTINGS = [
  "Whispering Shadowfen",
  "Dragon's Tooth Mountains",
  "Sunken City of Aeridor",
  "Clockwork Metropolis of Cogsworth",
  "Celestial Isles of Aethelgard",
];

const SetupScreen: React.FC<SetupScreenProps> = ({ onSetupComplete }) => {
  const [name, setName] = useState('');
  const [setting, setSetting] = useState(SETTINGS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSetupComplete({ name: name.trim(), setting });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl shadow-amber-500/10 border border-slate-700 p-8">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">Fantasify</h1>
        <p className="text-slate-300 mb-8">Your AI-Powered Adventure Journal</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="characterName" className="block text-lg font-cinzel text-slate-200 mb-2 text-left">
              Choose Your Hero's Name
            </label>
            <input
              id="characterName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Kaelen the Brave"
              className="w-full bg-slate-900 border border-slate-600 rounded-md px-4 py-2 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="setting" className="block text-lg font-cinzel text-slate-200 mb-2 text-left">
              Select Your Realm
            </label>
            <select
              id="setting"
              value={setting}
              onChange={(e) => setSetting(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-md px-4 py-2 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all appearance-none"
              style={{ background: 'url(\'data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E\') right 1rem center/10px no-repeat, linear-gradient(to top, #0f172a, #0f172a)' }}
            >
              {SETTINGS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full flex items-center justify-center bg-amber-600 hover:bg-amber-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-slate-900 font-bold text-lg py-3 px-4 rounded-md shadow-lg shadow-amber-600/20 transition-all duration-300 transform hover:scale-105"
          >
            <BookOpenIcon />
            Begin Your Adventure
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupScreen;
