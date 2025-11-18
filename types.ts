
export type Role = 'user' | 'model';

export interface Message {
  role: Role;
  text: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}
