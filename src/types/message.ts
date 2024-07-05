export interface Message {
  id: number;
  content: string;
  sender: string;
  receiver: string;
  timestamp: Date;
}