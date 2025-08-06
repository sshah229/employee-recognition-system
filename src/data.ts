export type Recognition = {
  id: string;
  from: string;       // employee ID
  to: string | null;  // null if anonymous
  message: string;
  emoji: string;
  visibility: 'PUBLIC' | 'PRIVATE' | 'ANONYMOUS';
  team?: string;      // for analytics
  keywordTags: string[];
  createdAt: string;
};

export const recognitions: Recognition[] = [];
