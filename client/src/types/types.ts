// types.ts
export type UserId = string;

export interface UserContextType {
  userId: UserId;
  updateUser: (newUserId: UserId) => void;
}
