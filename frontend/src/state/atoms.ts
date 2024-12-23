import { atom } from "jotai";
import { atomWithReset, atomWithStorage } from "jotai/utils";
import { TemplateStructureType } from "../types/cardTemplate";
import { CreateCardType, ImageToAddType } from "../types/card";

export const userAtom = atom<{ username: string } | null>(null)
export const tokenAtom = atomWithStorage<string | null>("accessToken", null)

export const createTemplateAtom = atomWithReset<TemplateStructureType[]>([{ title: "", subtitle: "" }])

export const createCardAtom = atomWithReset<CreateCardType | null>(null)
export const imagesToAddAtom = atomWithReset<ImageToAddType[]>([])

