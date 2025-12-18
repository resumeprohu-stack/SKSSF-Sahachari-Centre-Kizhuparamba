export type ItemStatus = 'Available' | 'Issued' | 'Returned';

export type Item = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  status: ItemStatus;
  dateAdded: string;
  issuedTo?: string; // Name + Contact
  issueDate?: string;
  expectedReturnDate?: string;
  actualReturnDate?: string;
};

export type SmartInsight = {
  item: string;
  issue: string;
  suggestedAction: string;
};
