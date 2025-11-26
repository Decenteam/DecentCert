import React, { useState } from 'react';
import type { Resume, ActiveTab } from './types';
import RecruiterView from './components/RecruiterView';
import CandidateView from './components/CandidateView';
import CredentialSendView from './components/CredentialSendView';
import { useResumeStore } from './store/resumeStore';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('recruiter');
  const addResume = useResumeStore((state) => state.addResume);

  const handleNewResume = (newResume: Resume) => {
    addResume(newResume);
    setActiveTab('recruiter'); // Switch to recruiter view to see the new resume
  };

  const TabButton: React.FC<{ tabName: ActiveTab, label: string }> = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-6 py-3 text-lg font-medium rounded-t-lg transition-colors duration-300 focus:outline-none ${
        activeTab === tabName
          ? 'bg-gray-800 text-cyan-400 border-b-2 border-cyan-400'
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="container mx-auto px-4">
        <header className="pt-8">
          <h1 className="text-4xl font-bold text-center text-white mb-2">人才匹配平台</h1>
          <p className="text-center text-gray-400 mb-8">為招聘者與應聘者建立橋樑</p>
          <div className="flex justify-center border-b border-gray-700">
            <TabButton tabName="recruiter" label="招聘者" />
            <TabButton tabName="candidate" label="應聘者" />
            <TabButton tabName="credential" label="憑證" />
          </div>
        </header>

        <main>
          {activeTab === 'recruiter' && <RecruiterView />}
          {activeTab === 'candidate' && <CandidateView onNewResume={handleNewResume} />}
          {activeTab === 'credential' && <CredentialSendView />}
        </main>
      </div>
    </div>
  );
};

export default App;