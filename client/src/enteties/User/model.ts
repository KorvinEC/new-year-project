import { create } from 'zustand';

export interface UserSchema {
    id: string
    token: string | null
    name: string
    isAuth: boolean
    destroyUser(): void
}

const initialState = {
    id: '',
    token: null,
    name: '',
    isAuth: false,
};

export const useUserStore = create<UserSchema>((set) => ({
    ...initialState,
    destroyUser: () => set(() => ({ ...initialState })),
}));
