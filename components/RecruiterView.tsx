
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
      <div className="lg:col-span-1 h-full">
        <h2 className="text-2xl font-bold mb-4 text-white">應聘者列表</h2>
        
        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="搜尋履歷 (姓名、職位、技能...)"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-white placeholder-gray-400"
          />
          <p className="text-sm text-gray-400 mt-1">
            共 {getResumeCount()} 份履歷 {searchQuery && `(顯示 ${filteredResumes.length} 筆搜尋結果)`}
          </p>
        </div>
        
        <div className=" space-y-3 max-h-[70vh] pr-2">
          {filteredResumes.map(resume => (
            <div
              key={resume.id}
              onClick={() => setSelectedResume(resume)}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedResume?.id === resume.id 
                ? 'bg-cyan-600/90 text-white shadow-lg ring-2 ring-cyan-400' 
                : 'bg-gray-800 hover:bg-gray-700 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{resume.name}</h3>
                  <p className={selectedResume?.id === resume.id ? 'text-cyan-100' : 'text-gray-400'}>{resume.desiredRole}</p>
                </div>
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
      <div className="lg:col-span-2 h-full">
        {selectedResume ? (
          <ResumeDetail resume={selectedResume} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gray-800 rounded-2xl p-8 text-center">
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
