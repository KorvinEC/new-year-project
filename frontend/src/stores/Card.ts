import { createEffect, createStore, sample } from "effector";
import { createGate } from "effector-react";

import { CardType } from "../types";
import { NetworkError } from "../types/error.ts";
import api from "../api.tsx";
import { logoutEvent } from "./Authorization.ts";

export const $card = createStore<CardType | null>(null)

export const CardGate = createGate<number>()

const fetchCardFx = createEffect<number, CardType, NetworkError>(
    async (id) => api.get(`/cards/${id}/`)
)

$card
    .on(fetchCardFx.doneData, (_, cardData) => cardData)
    .reset(logoutEvent)

sample({
    source: CardGate.open,
    target: fetchCardFx
})
