import { Client } from '@microsoft/microsoft-graph-client';
import { AuthenticationProvider } from '@microsoft/microsoft-graph-client';

export class GraphService {
  private client: Client;

  constructor(token: string) {
    this.client = Client.init({
      authProvider: (done) => done(null, token),
    });
  }

  async getUserId(email: string): Promise<string | null> {
    try {
      const user = await this.client.api(`/users/${email}`).get();
      return user.id;
    } catch (error) {
      return null;
    }
  }

  async getUserName(userId: string): Promise<string | null> {
    try {
      const user = await this.client.api(`/users/${userId}`).get();
      return user.displayName;
    } catch (error) {
      return null;
    }
  }
}