import { createEffect, createStore, sample } from "effector";
import { createGate } from "effector-react";

import { CardType } from "../types";
import { NetworkError } from "../types/error.ts";
import api from "../api.tsx";

export const $card = createStore<CardType | null>(null)

export const CardGate = createGate<number>()

const fetchCardFx = createEffect<number, CardType, NetworkError>(
    async (id) => api.get(`/cards/${id}/`)
)

$card.on(fetchCardFx.doneData, (_, cardData) => cardData)

sample({
    source: CardGate.open,
    target: fetchCardFx
})
