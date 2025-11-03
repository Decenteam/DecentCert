import { create } from 'zustand';
import type { Resume } from '../types';

const DUMMY_RESUMES: Resume[] = [
  {
    id: 'resume-1',
    name: '林美麗 (Mei-Li Lin)',
    email: 'meili.lin@example.com',
    phone: '0912-345-678',
    desiredRole: '資深前端工程師 (Senior Frontend Engineer)',
    summary: '擁有超過五年經驗的前端工程師，專精於 React、TypeScript 與現代化前端開發流程。熱衷於打造高效能、易於維護且使用者體驗卓越的網頁應用。具備領導小型開發團隊的經驗，並成功交付多個大型專案。',
    experience: [
      { id: 'exp-1-1', title: '前端工程師', company: '科技無限公司', duration: '2020/01 - 至今', description: '負責開發與維護公司核心產品的客戶端介面，使用 React Hooks 與 Redux 進行狀態管理，並導入 Tailwind CSS 提升開發效率。' },
      { id: 'exp-1-2', title: '初級網頁開發者', company: '網路新創坊', duration: '2018/07 - 2019/12', description: '參與公司官方網站的開發，主要使用 Vue.js 與 SCSS，並學習到 RWD 響應式網頁設計的實務技巧。' }
    ],
    education: [
      { id: 'edu-1-1', degree: '資訊工程學系 學士', school: '國立臺灣科技大學', duration: '2014/09 - 2018/06' }
    ],
    skills: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'Tailwind CSS', 'Next.js', 'Git', 'CI/CD']
  },
  {
    id: 'resume-2',
    name: '陳志明 (Chih-Ming Chen)',
    email: 'cm.chen@example.com',
    phone: '0987-654-321',
    desiredRole: 'UI/UX 設計師 (UI/UX Designer)',
    summary: '充滿熱情的 UI/UX 設計師，擅長將複雜的用戶需求轉化為直觀、美觀且具功能性的設計方案。熟悉從使用者研究、線框圖繪製到高保真原型製作的完整設計流程。精通 Figma、Sketch 等設計工具。',
    experience: [
      { id: 'exp-2-1', title: 'UI/UX 設計師', company: '創意設計所', duration: '2019/05 - 至今', description: '主導公司多款 App 的介面與使用者體驗設計，透過 A/B 測試與使用者訪談持續優化產品，成功提升用戶留存率 15%。' }
    ],
    education: [
      { id: 'edu-2-1', degree: '設計學系 碩士', school: '國立成功大學', duration: '2017/09 - 2019/06' }
    ],
    skills: ['Figma', 'Sketch', 'Adobe XD', '使用者研究', '線框圖', '原型製作', '設計系統']
  }
];

interface ResumeStore {
  resumes: Resume[];
  selectedResume: Resume | null;
  
  // Actions
  addResume: (resume: Resume) => void;
  removeResume: (id: string) => void;
  updateResume: (id: string, updates: Partial<Resume>) => void;
  setSelectedResume: (resume: Resume | null) => void;
  getResumeById: (id: string) => Resume | undefined;
  clearAllResumes: () => void;
  
  // Utility functions
  getResumesByRole: (role: string) => Resume[];
  searchResumes: (query: string) => Resume[];
  getResumeCount: () => number;
}

export const useResumeStore = create<ResumeStore>((set, get) => ({
  resumes: DUMMY_RESUMES,
  selectedResume: DUMMY_RESUMES.length > 0 ? DUMMY_RESUMES[0] : null,

  addResume: (resume: Resume) =>
    set((state) => ({
      resumes: [resume, ...state.resumes],
    })),

  removeResume: (id: string) =>
    set((state) => ({
      resumes: state.resumes.filter((resume) => resume.id !== id),
      selectedResume: state.selectedResume?.id === id ? null : state.selectedResume,
    })),

  updateResume: (id: string, updates: Partial<Resume>) =>
    set((state) => ({
      resumes: state.resumes.map((resume) =>
        resume.id === id ? { ...resume, ...updates } : resume
      ),
      selectedResume:
        state.selectedResume?.id === id
          ? { ...state.selectedResume, ...updates }
          : state.selectedResume,
    })),

  setSelectedResume: (resume: Resume | null) =>
    set(() => ({
      selectedResume: resume,
    })),

  getResumeById: (id: string) => {
    const state = get();
    return state.resumes.find((resume) => resume.id === id);
  },

  clearAllResumes: () =>
    set(() => ({
      resumes: [],
      selectedResume: null,
    })),

  // Utility functions
  getResumesByRole: (role: string) => {
    const state = get();
    return state.resumes.filter((resume) =>
      resume.desiredRole.toLowerCase().includes(role.toLowerCase())
    );
  },

  searchResumes: (query: string) => {
    const state = get();
    const lowercaseQuery = query.toLowerCase();
    return state.resumes.filter((resume) =>
      resume.name.toLowerCase().includes(lowercaseQuery) ||
      resume.desiredRole.toLowerCase().includes(lowercaseQuery) ||
      resume.summary.toLowerCase().includes(lowercaseQuery) ||
      resume.skills.some((skill) => skill.toLowerCase().includes(lowercaseQuery))
    );
  },

  getResumeCount: () => {
    const state = get();
    return state.resumes.length;
  },
}));