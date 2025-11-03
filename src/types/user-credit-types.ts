
export interface UserCredits {
  id: string;
  userId: string;
  totalCredits: number;
  freeCredits: number;
  lastFreeCreditDate: string;
  hasUnlimitedCredits: boolean;
}
