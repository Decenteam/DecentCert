export interface Resume {
  id: string;
  name: string;
  email: string;
  phone: string;
  desiredRole: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  duration: string;
}

export interface CredentialField {
  ename: string;
  content: string;
}

export type ActiveTab = 'recruiter' | 'candidate' | 'credential';