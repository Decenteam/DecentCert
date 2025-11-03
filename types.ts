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
  transactionID?: string;
  verificationData?: VerificationData;
}

export interface VerificationClaim {
  ename: string;
  cname: string;
  value: string;
}

export interface VerificationCredential {
  credentialType: string;
  claims: VerificationClaim[];
}

export interface VerificationData {
  data: VerificationCredential[];
  verifyResult: boolean;
  resultDescription: string;
  transactionId: string;
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