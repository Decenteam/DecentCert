
import React from 'react';
import { DocumentCheckIcon } from './icons';

interface CredentialVerificationProps {
  buttonText: string;
}

const CredentialVerification: React.FC<CredentialVerificationProps> = ({ buttonText }) => {
  return (
    <div className="mt-8 bg-gray-800/50 border border-dashed border-gray-600 rounded-lg p-6 text-center">
      <div className="flex justify-center items-center mb-4">
        <DocumentCheckIcon className="w-8 h-8 text-cyan-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-200 mb-2">憑證認證 (Credential Verification)</h3>
      <p className="text-gray-400 mb-4">
        此功能即將推出，用於驗證您的技能與學經歷。
      </p>
      <button
        type="button"
        className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default CredentialVerification;
