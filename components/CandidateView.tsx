import React, { useState } from 'react';
import type { Resume, VerificationData } from '../types';
import CredentialVerification from './CredentialVerification';
import { useResumeStore } from '../store/resumeStore';

interface CandidateViewProps {
  onNewResume?: (resume: Resume) => void;
}

const initialFormState: Omit<Resume, 'id'> = {
  name: '',
  email: '',
  phone: '',
  desiredRole: '',
  summary: '',
  experience: [{ id: `exp-${Date.now()}`, title: '', company: '', duration: '', description: '' }],
  education: [{ id: `edu-${Date.now()}`, degree: '', school: '', duration: '' }],
  skills: [],
};

const CandidateView: React.FC<CandidateViewProps> = ({ onNewResume }) => {
  const addResumeToStore = useResumeStore((state) => state.addResume);
  const [formData, setFormData] = useState<Omit<Resume, 'id'>>(initialFormState);
  const [skillsInput, setSkillsInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // FIX: The original generic type `T` was not being inferred correctly.
  // Replaced with a more specific generic `K` which links `listName` to the `field` type,
  // ensuring type safety for the dynamic fields in 'experience' and 'education'.
  const handleDynamicChange = <K extends 'experience' | 'education'>(
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Resume[K][number],
    listName: K
  ) => {
    const list = formData[listName].map((item, i) =>
      i === index ? { ...item, [field]: e.target.value } : item
    );
    setFormData({ ...formData, [listName]: list as any });
  };

  const addDynamicItem = (listName: 'experience' | 'education') => {
    if (listName === 'experience') {
      setFormData({ ...formData, experience: [...formData.experience, { id: `exp-${Date.now()}`, title: '', company: '', duration: '', description: '' }] });
    } else {
      setFormData({ ...formData, education: [...formData.education, { id: `edu-${Date.now()}`, degree: '', school: '', duration: '' }] });
    }
  };

  const removeDynamicItem = (id: string, listName: 'experience' | 'education') => {
    if(formData[listName].length > 1) {
      setFormData({ ...formData, [listName]: formData[listName].filter(item => item.id !== id) });
    }
  };

  const handleSkillsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const skill = skillsInput.trim();
      if (skill && !formData.skills.includes(skill)) {
        setFormData({ ...formData, skills: [...formData.skills, skill] });
      }
      setSkillsInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(skill => skill !== skillToRemove) });
  };

  const handleVerificationComplete = (data: VerificationData) => {
    setVerificationData(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newResume: Resume = { 
      ...formData, 
      id: `resume-${Date.now()}`,
      verificationData: verificationData || undefined
    };
    
    // Use prop callback if provided, otherwise add directly to store
    if (onNewResume) {
      onNewResume(newResume);
    } else {
      addResumeToStore(newResume);
    }
    
    setSubmitted(true);
    setTimeout(() => {
        setFormData(initialFormState);
        setSkillsInput('');
        setSubmitted(false);
        setVerificationData(null);
    }, 3000)
  };

  // modern style classes
  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:outline-none transition-all duration-200 hover:bg-white/10";
  const labelClass = "block text-sm font-medium text-gray-300 mb-2 ml-1";
  const cardClass = "bg-gray-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl";

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h2 className="text-3xl font-bold mb-8 text-white text-center">創建您的專業履歷</h2>
      {submitted ? (
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-6 py-4 rounded-2xl text-center backdrop-blur-sm">
          <strong className="font-bold">履歷已成功寄出！</strong>
          <span className="block sm:inline"> 招聘者現在可以看到您的資料了。</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 基本資料卡片 */}
          <div className={cardClass}>
            <h3 className="text-xl font-semibold mb-6 text-cyan-400 flex items-center gap-2">
              <span className="w-1 h-6 bg-cyan-400 rounded-full inline-block"></span>
              基本資料
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className={labelClass}>姓名</label>
                <input type="text" name="name" className={inputClass} value={formData.name} onChange={handleChange} placeholder="請輸入全名" />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>應聘職位</label>
                <input type="text" name="desiredRole" className={inputClass} value={formData.desiredRole} onChange={handleChange} placeholder="應聘職位" />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Email</label>
                <input type="email" name="email" className={inputClass} value={formData.email} onChange={handleChange} placeholder="Email" />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>電話</label>
                <input type="tel" name="phone" className={inputClass} value={formData.phone} onChange={handleChange} placeholder="電話" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className={labelClass}>自我介紹</label>
                <textarea name="summary" className={inputClass} value={formData.summary} onChange={handleChange} rows={4} placeholder="自我介紹" />
              </div>
            </div>
          </div>

          {/* 學歷卡片 */}
          <div className={cardClass}>
            <h3 className="text-xl font-semibold mb-6 text-cyan-400 flex items-center gap-2">
              <span className="w-1 h-6 bg-cyan-400 rounded-full inline-block"></span>
              學歷
            </h3>
            {formData.education.map((edu, index) => (
              <div key={edu.id} className="space-y-3 mb-4 p-4 border border-white/10 rounded-xl relative bg-white/2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className={labelClass}>學位</label>
                    <input type="text" className={inputClass} value={edu.degree} onChange={e => handleDynamicChange(index, e, 'degree', 'education')} placeholder="學位" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>學校</label>
                    <input type="text" className={inputClass} value={edu.school} onChange={e => handleDynamicChange(index, e, 'school', 'education')} placeholder="學校" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>期間</label>
                    <input type="text" className={inputClass} value={edu.duration} onChange={e => handleDynamicChange(index, e, 'duration', 'education')} placeholder="期間 (e.g., 2016/09 - 2020/06)" />
                  </div>
                </div>
                {formData.education.length > 1 && <button type="button" onClick={() => removeDynamicItem(edu.id, 'education')} className="absolute top-2 right-2 text-red-400 hover:text-red-600">&times;</button>}
              </div>
            ))}
            <button type="button" onClick={() => addDynamicItem('education')} className="text-cyan-400 hover:text-cyan-300">+ 新增學歷</button>
          </div>

          {/* 技能卡片 */}
          <div className={cardClass}>
            <h3 className="text-xl font-semibold mb-6 text-cyan-400 flex items-center gap-2">
              <span className="w-1 h-6 bg-cyan-400 rounded-full inline-block"></span>
              專業技能
            </h3>
            <input type="text" placeholder="輸入技能後按 Enter 或逗號" value={skillsInput} onChange={e => setSkillsInput(e.target.value)} onKeyDown={handleSkillsKeyDown} className={inputClass + " mb-2"} />
            <div className="flex flex-wrap gap-3">
              {formData.skills.map(skill => (
                <span key={skill} className="flex items-center bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 text-cyan-300 text-sm font-medium px-4 py-2 rounded-lg shadow-sm hover:border-cyan-500/50 transition-colors cursor-default">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="ml-2 text-red-400 hover:text-red-600">&times;</button>
                </span>
              ))}
            </div>
          </div>

          <CredentialVerification 
            buttonText="開始認證" 
            onVerificationComplete={handleVerificationComplete}
          />
          {/* 提交按鈕：漸層背景 + 陰影 */}
          <button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-cyan-500/20 transform transition hover:-translate-y-1 active:scale-95 duration-200 text-lg tracking-wide">
            提交履歷
            {verificationData && (
              <span className="ml-2 text-green-300">✓ 已認證</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default CandidateView;