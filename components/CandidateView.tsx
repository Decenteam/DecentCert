import React, { useState } from 'react';
import type { Resume } from '../types';
import CredentialVerification from './CredentialVerification';

interface CandidateViewProps {
  onNewResume: (resume: Resume) => void;
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
  const [formData, setFormData] = useState<Omit<Resume, 'id'>>(initialFormState);
  const [skillsInput, setSkillsInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newResume: Resume = { ...formData, id: `resume-${Date.now()}` };
    onNewResume(newResume);
    setSubmitted(true);
    setTimeout(() => {
        setFormData(initialFormState);
        setSkillsInput('');
        setSubmitted(false);
    }, 3000)
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h2 className="text-3xl font-bold mb-6 text-white text-center">創建您的履歷</h2>
      {submitted ? (
        <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg text-center" role="alert">
          <strong className="font-bold">履歷已成功寄出！</strong>
          <span className="block sm:inline"> 招聘者現在可以看到您的資料了。</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-cyan-400 border-b border-gray-700 pb-2">基本資料</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="name" placeholder="姓名" value={formData.name} onChange={handleChange} required className="bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
              <input type="text" name="desiredRole" placeholder="應聘職位" value={formData.desiredRole} onChange={handleChange} required className="bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
              <input type="tel" name="phone" placeholder="電話" value={formData.phone} onChange={handleChange} required className="bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
              <textarea name="summary" placeholder="自我介紹" value={formData.summary} onChange={handleChange} rows={4} required className="md:col-span-2 bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-cyan-400 border-b border-gray-700 pb-2">學歷</h3>
            {formData.education.map((edu, index) => (
                <div key={edu.id} className="space-y-3 mb-4 p-4 border border-gray-700 rounded-md relative">
                    <input type="text" placeholder="學位" value={edu.degree} onChange={e => handleDynamicChange(index, e, 'degree', 'education')} className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                    <input type="text" placeholder="學校" value={edu.school} onChange={e => handleDynamicChange(index, e, 'school', 'education')} className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                    <input type="text" placeholder="期間 (e.g., 2016/09 - 2020/06)" value={edu.duration} onChange={e => handleDynamicChange(index, e, 'duration', 'education')} className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                    {formData.education.length > 1 && <button type="button" onClick={() => removeDynamicItem(edu.id, 'education')} className="absolute top-2 right-2 text-red-400 hover:text-red-600">&times;</button>}
                </div>
            ))}
            <button type="button" onClick={() => addDynamicItem('education')} className="text-cyan-400 hover:text-cyan-300">+ 新增學歷</button>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-cyan-400 border-b border-gray-700 pb-2">專業技能</h3>
            <input type="text" placeholder="輸入技能後按 Enter 或逗號" value={skillsInput} onChange={e => setSkillsInput(e.target.value)} onKeyDown={handleSkillsKeyDown} className="w-full bg-gray-700 border border-gray-600 rounded p-2 mb-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
            <div className="flex flex-wrap gap-2">
              {formData.skills.map(skill => (
                <span key={skill} className="flex items-center bg-gray-700 text-cyan-300 text-sm font-medium px-3 py-1 rounded-full">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="ml-2 text-red-400 hover:text-red-600">&times;</button>
                </span>
              ))}
            </div>
          </div>
          
          <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 text-lg">
            提交履歷
          </button>
        </form>
      )}

      <CredentialVerification buttonText="開始認證" />
    </div>
  );
};

export default CandidateView;