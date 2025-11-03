import React, { useState } from "react";
import { DocumentCheckIcon } from "./icons";
import { VPinstance } from "@/util/axios";
import type { VerificationData } from "../types";

interface CredentialVerificationProps {
  buttonText: string;
  onVerificationComplete?: (verificationData: VerificationData) => void;
}
function _uuid() {
  var d = Date.now();
  if (
    typeof performance !== "undefined" &&
    typeof performance.now === "function"
  ) {
    d += performance.now(); //use high-precision timer if available
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

const CredentialVerification: React.FC<CredentialVerificationProps> = ({
  buttonText,
  onVerificationComplete,
}) => {
  const [qrPresent, setQrPresent] = useState(false);
  const [QRimage, setQRimage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const VPlist = ["00000000_demovp"];
  async function handleVerification() {
    await VPinstance.get("./api/oidvp/qrcode", {
      params: {
        ref: VPlist[0],
        transactionId: _uuid(),
      },
    })
      .then(function (response) {
        console.log(response);
        setQrPresent(true);
        setQRimage(response.data.qrcodeImage);
        startPolling(response.data.transactionId);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  async function startPolling(transactionId: string) {
    setIsVerifying(true);
    let e = true;
    while (e) {
      await new Promise(r => setTimeout(r, 1000));
      await VPinstance.get("./api/oidvp/result", {
        params: {
          transactionId: transactionId
        }
      })
        .then(function (response) {
          console.log(response.data);
          if (response.data.verifyResult) {
            e = false;
            setIsVerifying(false);
            setVerificationComplete(true);
            setVerificationData(response.data);
            // Call the callback to pass verification data to parent component
            if (onVerificationComplete) {
              onVerificationComplete(response.data);
            }
          }
        })
        .catch(error => {
          console.log(error);
          setIsVerifying(false);
        });
    }
  }
  return (
    <div className="mt-8 bg-gray-800/50 border border-dashed border-gray-600 rounded-lg p-6 text-center">
      <div className="flex justify-center items-center mb-4">
        <DocumentCheckIcon className="w-8 h-8 text-cyan-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-200 mb-2">
        憑證認證 (Credential Verification)
      </h3>
      
      {!qrPresent && !verificationComplete && (
        <button
          type="button"
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          onClick={handleVerification}
        >
          {buttonText}
        </button>
      )}

      {qrPresent && !verificationComplete && (
        <div>
          <div className="flex justify-center">
            <img className="m-4" src={QRimage} alt="QR of verify" />
          </div>
          {isVerifying && (
            <div className="mt-4">
              <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                等待認證中...
              </div>
            </div>
          )}
        </div>
      )}

      {verificationComplete && verificationData && (
        <div className="mt-4 text-left">
          <div className="bg-green-600/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg mb-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-bold">認證成功！</span>
            </div>
            <p className="text-sm mt-1">交易 ID: {verificationData.transactionId}</p>
          </div>
          
          <div className="space-y-4">
            {verificationData.data.map((credential, index) => (
              <div key={index} className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                <h4 className="font-semibold text-cyan-400 mb-2">
                  憑證類型: {credential.credentialType}
                </h4>
                <div className="space-y-2">
                  {credential.claims.map((claim, claimIndex) => (
                    <div key={claimIndex} className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">{claim.cname}:</span>
                      <span className="text-white font-medium">{claim.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CredentialVerification;
