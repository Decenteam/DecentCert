
import React from 'react';
import type { Resume } from '../types';
import { BriefcaseIcon, AcademicCapIcon, WrenchScrewdriverIcon, AtSymbolIcon, PhoneIcon } from './icons';
import CredentialVerification from './CredentialVerification';

interface ResumeDetailProps {
  resume: Resume;
}

const ResumeDetail: React.FC<ResumeDetailProps> = ({ resume }) => {
  return (
    <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-700 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-white">{resume.name}</h1>
          <p className="text-xl text-cyan-400 mt-1">{resume.desiredRole}</p>
        </div>
        <div className="mt-4 sm:mt-0 text-sm text-gray-400 space-y-2">
            <div className="flex items-center gap-2">
                <AtSymbolIcon className="w-5 h-5" />
                <span>{resume.email}</span>
            </div>
             <div className="flex items-center gap-2">
                <PhoneIcon className="w-5 h-5" />
                <span>{resume.phone}</span>
            </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-200 mb-4">自我介紹 (Summary)</h2>
        <p className="text-gray-300 leading-relaxed">{resume.summary}</p>
      </div>
      
      <div className="space-y-8">
       
        <div>
          <h3 className="flex items-center gap-3 text-2xl font-semibold text-gray-200 mb-4">
            <AcademicCapIcon className="w-7 h-7 text-cyan-400"/>
            學歷 (Education)
          </h3>
           <div className="space-y-6 border-l-2 border-gray-700 ml-3 pl-6">
            {resume.education.map(edu => (
              <div key={edu.id}>
                <p className="font-bold text-lg text-white">{edu.degree}</p>
                <p className="text-gray-400">{edu.school}</p>
                <p className="text-sm text-gray-500">{edu.duration}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="flex items-center gap-3 text-2xl font-semibold text-gray-200 mb-4">
            <WrenchScrewdriverIcon className="w-7 h-7 text-cyan-400"/>
            專業技能 (Skills)
          </h3>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map(skill => (
              <span key={skill} className="bg-gray-700 text-cyan-300 text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
            ))}
          </div>
        </div>
      </div>

      <CredentialVerification buttonText="進行驗證" />
    </div>
  );
};

export default ResumeDetail;
