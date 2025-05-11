export  interface Message {
    id: number;
    sender: string;
    text: string;
    time: string;
    isUser: boolean;
    read?: boolean;
    type?: string;
    status: 'sent' | 'delivered' | 'read';
  }