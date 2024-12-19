import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const userAtom = atom<{ username: string } | null>(null)
export const tokenAtom = atomWithStorage<string | null>("accessToken", null)
