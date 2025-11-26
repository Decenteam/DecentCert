import React, { useState } from "react";
import type { CredentialField } from "../types";
import { DocumentCheckIcon, PlusCircleIcon, MinusCircleIcon } from "./icons";

const initialFields: CredentialField[] = [
  { ename: "name", content: "" },
  { ename: "email", content: "" },
  { ename: "company", content: "" },
];

const CredentialSendView: React.FC = () => {
  const [vcUid, setVCUID] = useState<string>("");
  const [issuanceDate, setIssuanceDate] = useState<string>("");
  const [expiredDate, setExpiredDate] = useState<string>("");
  const [fields, setFields] = useState<CredentialField[]>(initialFields);
  const [submitted, setSubmitted] = useState(false);

  const handleFieldChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newFields = [...fields];
    const fieldToUpdate = newFields[index];
    if (name === "ename" || name === "content") {
      fieldToUpdate[name] = value;
    }
    setFields(newFields);
  };

  const addField = () => {
    setFields([...fields, { ename: "", content: "" }]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      vcUid: vcUid,
      issuanceDate: issuanceDate.replace(/-/g, ""),
      expiredDate: expiredDate.replace(/-/g, ""),
      fields: fields.map((field) => {
        // Automatically format date content if the key suggests it is a date
        if (
          field.ename.toLowerCase().includes("date") &&
          field.content.includes("-")
        ) {
          return { ...field, content: field.content.replace(/-/g, "") };
        }
        return field;
      }),
    };

    console.log(JSON.stringify(payload, null, 2));

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setVCUID("");
      setIssuanceDate("");
      setExpiredDate("");
      setFields(initialFields);
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">產生憑證</h2>
      </div>

      {submitted ? (
        <div
          className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg text-center"
          role="alert"
        >
          <strong className="font-bold">認證請求已成功寄出！</strong>
          <span className="block sm:inline"> 已將請求內容輸出至 Console。</span>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-8 rounded-lg shadow-md space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="VCUID"
                className="block text-sm font-medium text-cyan-400 mb-2"
              >
                VCUID
              </label>
              <input
                type="text"
                id="VCUID"
                value={vcUid}
                onChange={(e) => setVCUID(e.target.value)}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="issuanceDate"
                className="block text-sm font-medium text-cyan-400 mb-2"
              >
                發行日期 
              </label>
              <input
                type="date"
                id="issuanceDate"
                value={issuanceDate}
                onChange={(e) => setIssuanceDate(e.target.value)}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="expiredDate"
                className="block text-sm font-medium text-cyan-400 mb-2"
              >
                過期日期
              </label>
              <input
                type="date"
                id="expiredDate"
                value={expiredDate}
                onChange={(e) => setExpiredDate(e.target.value)}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-cyan-400 mb-2 border-t border-gray-700 pt-4">
              客製化欄位 
            </h3>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    name="ename"
                    placeholder="欄位名稱 (e.g., name)"
                    value={field.ename}
                    onChange={(e) => handleFieldChange(index, e)}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    name="content"
                    placeholder="欄位內容"
                    value={field.content}
                    onChange={(e) => handleFieldChange(index, e)}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="text-red-400 hover:text-red-500 p-1"
                  >
                    <MinusCircleIcon className="w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addField}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mt-3"
            >
              <PlusCircleIcon className="w-6 h-6" />
              新增欄位
            </button>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 text-lg"
          >
            <DocumentCheckIcon className="w-6 h-6" />
            發送請求
          </button>
        </form>
      )}
    </div>
  );
};

export default CredentialSendView;
