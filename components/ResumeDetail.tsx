
import React, { useState } from 'react';
import type { Resume } from '../types';
import { BriefcaseIcon, AcademicCapIcon, WrenchScrewdriverIcon, AtSymbolIcon, PhoneIcon, DocumentCheckIcon } from './icons';
import CredentialVerification from './CredentialVerification';
import axios from 'axios';

interface ResumeDetailProps {
  resume: Resume;
}

const ResumeDetail: React.FC<ResumeDetailProps> = ({ resume }) => {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleReVerify = async () => {
    try {
      setIsVerifying(true);
      const response = await axios.post('/api/oidvp/result', {
        transactionId: resume.verificationData?.transactionId,
      });
      
      // Handle the response as needed
      console.log('Re-verification result:', response.data);
      
      // You might want to update the resume data or show a notification here
      alert('憑證重新驗證完成');
    } catch (error) {
      console.error('Re-verification failed:', error);
      alert('重新驗證失敗，請稍後再試');
    } finally {
      setIsVerifying(false);
    }
  };

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

        {resume.verificationData && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-3 text-2xl font-semibold text-gray-200">
                憑證認證 (Credential Verification)
              </h3>
              <button
                onClick={handleReVerify}
                disabled={isVerifying}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                {isVerifying ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    重新驗證中...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    重新驗證
                  </>
                )}
              </button>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-center text-green-300 mb-2">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">已通過憑證認證</span>
              </div>
              <p className="text-sm text-gray-400">
                交易 ID: {resume.verificationData.transactionId}
              </p>
              <p className="text-sm text-gray-400">
                狀態: {resume.verificationData.resultDescription}
              </p>
            </div>
            
            <div className="space-y-4">
              {resume.verificationData.data.map((credential, index) => (
                <div key={index} className="bg-gray-700/30 border border-gray-600 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-400 mb-3">
                    憑證類型: {credential.credentialType}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {credential.claims.map((claim, claimIndex) => (
                      <div key={claimIndex} className="bg-gray-800/50 rounded p-3">
                        <div className="text-sm text-gray-400">{claim.cname}</div>
                        <div className="text-white font-medium">{claim.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default ResumeDetail;
