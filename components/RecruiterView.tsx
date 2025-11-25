
import React, { useEffect, useState } from 'react';
import type { Resume } from '../types';
import ResumeDetail from './ResumeDetail';
import { InformationCircleIcon } from './icons';
import { VPinstance } from '@/util/axios';
import { useResumeStore } from '../store/resumeStore';

const RecruiterView: React.FC = () => {
  const { resumes, selectedResume, setSelectedResume, searchResumes, getResumeCount } = useResumeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResumes, setFilteredResumes] = useState<Resume[]>(resumes);

  // Auto-select first resume when resumes change and no resume is selected
  useEffect(() => {
    if (!selectedResume && resumes.length > 0) {
      setSelectedResume(resumes[0]);
    }
  }, [resumes, selectedResume, setSelectedResume]);

  // Handle search functionality
  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredResumes(searchResumes(searchQuery));
    } else {
      setFilteredResumes(resumes);
    }
  }, [searchQuery, resumes, searchResumes]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-8">
      {/* 側邊欄 */}
      <div className="lg:col-span-1 h-full">
        <h2 className="text-2xl font-bold mb-6 text-white">應聘者列表</h2>
        {/* 搜尋框 */}
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="搜尋履歷 (姓名、職位、技能...)"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-4 pl-12 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all shadow-inner text-white placeholder-gray-500"
          />
          {/* <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35"/></svg> */}
          <p className="text-sm text-gray-400 mt-2">
            共 {getResumeCount()} 份履歷 {searchQuery && `(顯示 ${filteredResumes.length} 筆搜尋結果)`}
          </p>
        </div>

        {/* 列表 */}
        <div className="space-y-3 max-h-[70vh] pr-2 custom-scrollbar">
          {filteredResumes.map(resume => (
            <div
              key={resume.id}
              onClick={() => setSelectedResume(resume)}
              className={`group p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
                selectedResume?.id === resume.id 
                  ? 'bg-gradient-to-r from-cyan-900/80 to-blue-900/80 border-cyan-500/50 shadow-lg translate-x-2' 
                  : 'bg-gray-800/40 border-transparent hover:bg-gray-800 hover:border-gray-700 hover:translate-x-1'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-bold text-lg ${selectedResume?.id === resume.id ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                    {resume.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{resume.desiredRole}</p>
                </div>
                {selectedResume?.id === resume.id && (
                  <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                )}
              </div>
            </div>
          ))}
          {filteredResumes.length === 0 && resumes.length === 0 && (
            <p className="text-gray-500 text-center py-10">尚無任何履歷。</p>
          )}
          {filteredResumes.length === 0 && resumes.length > 0 && (
            <p className="text-gray-500 text-center py-10">找不到符合條件的履歷。</p>
          )}
        </div>
      </div>
      {/* 詳細頁 */}
      <div className="lg:col-span-2 h-full">
        {selectedResume ? (
          <ResumeDetail resume={selectedResume} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gray-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
            <InformationCircleIcon className="w-16 h-16 text-gray-600 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-300">請選擇一份履歷</h2>
            <p className="text-gray-500 mt-2">點擊左側列表中的應聘者以查看詳細履歷。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterView;
