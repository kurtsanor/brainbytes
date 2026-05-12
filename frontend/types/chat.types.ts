export interface Chat {
  _id: string;
  title: string;
  userId: string;
  lastActive: Date;
  subject: string;
  device: string;
  status: "active" | "inactive" | "completed";
  createdAt: Date;
  updatedAt: Date;
}
