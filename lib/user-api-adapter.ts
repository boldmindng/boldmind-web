
import { boldMindAPI } from '@boldmind-tech/api-client';

export const userAPIAdapter = {
  async getMe() {
    try {
      const response = await boldMindAPI.users.get('me');
      return response as any;
    } catch (error) {
      console.error('[userAPIAdapter] Failed to fetch current user:', error);
      return null;
    }
  },

  async createUser(userData: any) {
    try {
      const payload = {
        id: userData.id,
        email: userData.email,
        fullName:
          userData.user_metadata?.full_name ||
          userData.user_metadata?.fullName ||
          userData.email?.split('@')[0],
        avatarUrl:
          userData.user_metadata?.avatar_url ||
          userData.user_metadata?.picture ||
          undefined,
        isVerified: userData.email_verified || false,
        metadata: {
          provider: userData.app_metadata?.provider,
          ...userData.user_metadata,
        },
      };

      await boldMindAPI.users.update(userData.id, payload as any);
    } catch (error: any) {
      console.error('[userAPIAdapter] Failed to create user:', error?.response?.data || error?.message || error);
      if (error?.response?.status === 409) {
        return;
      }
      throw error;
    }
  },
};

export default userAPIAdapter;
