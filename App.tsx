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

  // 膠囊型毛玻璃 TabButton
  const TabButton: React.FC<{ tabName: ActiveTab, label: string }> = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`relative px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
        activeTab === tabName
          ? 'bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-transparent text-gray-100 font-sans pb-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="pt-12 pb-10 text-center">
          {/* 標題使用漸層文字 (Text Gradient) */}
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-fade-in">
            DecentCert
          </h1>
          <p className="text-lg text-gray-400 mb-8 font-light tracking-wide">
            以鍊上紀錄證明成就與技能的未來履歷平台
          </p>
          {/* 導航欄改為毛玻璃膠囊樣式 */}
          <div className="inline-flex items-center justify-center p-1.5 bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-full">
            <TabButton tabName="recruiter" label="招聘者視角" />
            <TabButton tabName="candidate" label="建立履歷" />
            <TabButton tabName="credential" label="發行憑證" />
          </div>
        </header>

        <main className="animate-slide-up">
          {activeTab === 'recruiter' && <RecruiterView />}
          {activeTab === 'candidate' && <CandidateView onNewResume={handleNewResume} />}
          {activeTab === 'credential' && <CredentialSendView />}
        </main>
      </div>
    </div>
  );
};

export default App;