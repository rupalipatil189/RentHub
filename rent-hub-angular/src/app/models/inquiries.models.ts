export interface Inquiry {
  id?: string;
  apartmentId: string;
  userId: string;
  userName: string;
  ownerId: string;
  message: string;
  status?: 'NEW' | 'CONTACTED' | 'CLOSED';
  createdAt: string;
}