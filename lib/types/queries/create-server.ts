export interface Server {
  id: string;
  name: string;
  imageUrl: string;
  inviteCode: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServerCreationResponse {
  message: string;
  server: Server;
}
