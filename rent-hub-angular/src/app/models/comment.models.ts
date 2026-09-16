export interface CommentData {
  id: string;
  apartmentId: string;
  userId: string;
  userName: string;
  text: string;
  parentCommentId?: string | null;
  createdAt: string;
}