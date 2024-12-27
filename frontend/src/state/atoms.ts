import { atomWithReset, atomWithStorage } from "jotai/utils";
import { TemplateStructureType } from "../types/cardTemplate";
import { CreateCardType, ImageToAddType } from "../types/card";
import { UserType } from "../types/user";

export const userAtom = atomWithReset<UserType | null>(null)
export const tokenAtom = atomWithStorage<string | null>("accessToken", null)

export const createTemplateAtom = atomWithReset<TemplateStructureType[]>([{ title: "", subtitle: "" }])

export const createCardAtom = atomWithReset<CreateCardType | null>(null)
export const imagesToAddAtom = atomWithReset<ImageToAddType[]>([])

