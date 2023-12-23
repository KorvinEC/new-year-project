import { create } from 'zustand';

export interface NominationSchema {
    title: string
    description: string
    id: string
}

export interface suggestionSchema {
    title: string
    description: string
}

export interface TemplateSchema {
    nominations: NominationSchema[]
    suggestions: suggestionSchema[]
}

export const emptySuggestion = {
    title: '',
    description: '',
}

const initialState = {
    nominations: [],
    suggestions: [],
};

export const useTemplate = create<TemplateSchema>(() => ({
    ...initialState,
}));
