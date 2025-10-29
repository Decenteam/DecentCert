
import React, { useState } from 'react';
import type { Resume } from '../types';
import ResumeDetail from './ResumeDetail';
import { InformationCircleIcon } from './icons';

interface RecruiterViewProps {
  resumes: Resume[];
}

const RecruiterView: React.FC<RecruiterViewProps> = ({ resumes }) => {
  const [selectedResume, setSelectedResume] = useState<Resume | null>(resumes.length > 0 ? resumes[0] : null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-8">
      <div className="lg:col-span-1 h-full">
        <h2 className="text-2xl font-bold mb-4 text-white">應聘者列表</h2>
        <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-2">
          {resumes.map(resume => (
            <div
              key={resume.id}
              onClick={() => setSelectedResume(resume)}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedResume?.id === resume.id 
                ? 'bg-cyan-600/90 text-white shadow-lg ring-2 ring-cyan-400' 
                : 'bg-gray-800 hover:bg-gray-700 hover:shadow-md'
              }`}
            >
              <h3 className="font-bold text-lg">{resume.name}</h3>
              <p className={selectedResume?.id === resume.id ? 'text-cyan-100' : 'text-gray-400'}>{resume.desiredRole}</p>
            </div>
          ))}
          {resumes.length === 0 && (
            <p className="text-gray-500 text-center py-10">尚無任何履歷。</p>
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
