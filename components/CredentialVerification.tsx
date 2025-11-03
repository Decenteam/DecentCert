import React, { useState } from "react";
import { DocumentCheckIcon } from "./icons";
import { VPinstance } from "@/util/axios";

interface CredentialVerificationProps {
  buttonText: string;
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
}) => {
  const [qrPresent, setQrPresent] = useState(false);
  const [QRimage, setQRimage] = useState("");
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
  async function startPolling(transactionId:string) {
    let e = true
    while(e){
      await VPinstance.get("./api/oidvp/result",{
        params:{
          transactionId:transactionId
        }
      })
        .then(function(response){
          if(response.data.verifyResult)e=true
      })
        .catch(error => console.log(error));
    }
    alert("驗證成功！");
  }
  return (
    <div className="mt-8 bg-gray-800/50 border border-dashed border-gray-600 rounded-lg p-6 text-center">
      <div className="flex justify-center items-center mb-4">
        <DocumentCheckIcon className="w-8 h-8 text-cyan-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-200 mb-2">
        憑證認證 (Credential Verification)
      </h3>
      {qrPresent && (
        <div className="flex justify-center">
          <img className="m-4" src={QRimage} alt="QR of verify" />
        </div>
      )}
      {!qrPresent && <button
        type="button"
        className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
        onClick={handleVerification}
      >
        {buttonText}
      </button>}
    </div>
  );
};

export default CredentialVerification;
