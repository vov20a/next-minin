import { create } from 'zustand';
import { Session } from 'next-auth';
import { devtools } from 'zustand/middleware';
import { getUserWithEmail } from '@/actions/user';

interface UserState {
  role: string | null | undefined;
  error: string | null;
  isLoading: boolean;
  getUserRole: (session: Session | null) => void;
}

export const useUserStore = create<UserState>()(
  devtools((set) => ({
    role: null,
    error: null,
    isLoading: false,
    getUserRole: async (session: Session) => {
      set({ isLoading: true, error: null, role: null });
      try {
        //  { success: true, user: { role: 'Admin' }, error: '' };
        const result = await getUserWithEmail(session?.user?.email);
        if (result.success) {
          set({ role: result.user?.role, isLoading: false });
        } else {
          set({ error: result.error, isLoading: false });
        }
      } catch (error) {
        console.error('error', error);
        set({ error: 'Ошибка при загрузке user', isLoading: false });
      }
    },
  })),
);
