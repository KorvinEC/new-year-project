import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { TemplateStructure } from "../types/cardTemplate";

export const userAtom = atom<{ username: string } | null>(null)
export const tokenAtom = atomWithStorage<string | null>("accessToken", null)

export const createTemplateAtom = atom<TemplateStructure[]>([{title: "", subtitle: ""}])
