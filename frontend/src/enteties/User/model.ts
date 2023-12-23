import { create } from 'zustand';

export interface UserSchema {
    id: string
    access_token: string | null
    name: string
    isAuth: boolean
    destroyUser(): void
}

const initialState = {
    id: '',
    access_token: null,
    name: '',
    isAuth: false,
};

export const useUserStore = create<UserSchema>((set) => ({
    ...initialState,
    destroyUser: () => set(() => ({ ...initialState })),
}));
