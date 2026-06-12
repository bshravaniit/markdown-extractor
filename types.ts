export type ProspectCategory =
  | 'wellness'
  | 'church'
  | 'hospital'
  | 'corporate'
  | 'community'
  | 'education'
  | 'cultural'
  | 'fitness'
  | 'restaurant'
  | 'other';

export type ProspectStatus = 'new' | 'contacted' | 'responded' | 'committed' | 'converted';

export type OutreachType = 'email' | 'call_script';

export interface OutreachDraft {
  id: string;
  type: OutreachType;
  content: string;
  createdAt: string;
}

export interface Prospect {
  id: string;
  name: string;
  category: ProspectCategory;
  address: string;
  zipCode: string;
  city: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
  notes?: string;
  assignedVolunteerId?: string;
  status: ProspectStatus;
  headcountPledged?: number;
  lastContact?: string;
  outreachDrafts: OutreachDraft[];
  addedAt: string;
  isFromDatabase: boolean;
}

export interface Volunteer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  addedAt: string;
}
