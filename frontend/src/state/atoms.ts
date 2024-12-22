import { atom } from "jotai";
import { atomWithReset, atomWithStorage } from "jotai/utils";
import { TemplateStructure } from "../types/cardTemplate";
import { CreateCardType } from "../types/card";

export const userAtom = atom<{ username: string } | null>(null)
export const tokenAtom = atomWithStorage<string | null>("accessToken", null)

export const createTemplateAtom = atomWithReset<TemplateStructure[]>([{ title: "", subtitle: "" }])

export const createCardAtom = atomWithReset<CreateCardType | null>(null)
