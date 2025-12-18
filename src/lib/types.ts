export type ItemStatus = 'Available' | 'Issued';

export type Item = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  status: ItemStatus;
  dateAdded: string;
  recipientName?: string;
  recipientMobile?: string;
  issuerName?: string;
  issueDate?: string;
  expectedReturnDate?: string;
  actualReturnDate?: string;
};

export type SmartInsight = {
  item: string;
  issue: string;
  suggestedAction: string;
};
