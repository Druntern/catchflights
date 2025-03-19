import { create } from 'zustand';
import { supabase } from '../lib/supabase.ts';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface UserState {
  user: SupabaseUser | null;
  fetchUserLoading: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  fetchUserLoading: true,

  fetchUser: async () => {
    set({ fetchUserLoading: true });

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching user:', error.message);
    }

    set({ user, fetchUserLoading: false });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
