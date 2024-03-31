import { createGate } from "effector-react";
import { createEffect, createEvent, createStore, sample } from "effector";

import { CardType } from "../types";
import { NetworkError } from "../types/error.ts";
import api from "../api.tsx";


export const $cards = createStore<CardType[]>([])

export const CardsGate = createGate()

export const fetchCardsFx = createEffect<void, CardType[], NetworkError>(
    async () => await api.get('/cards/')
)

sample({
    source: CardsGate.open,
    target: fetchCardsFx
})

$cards.on(fetchCardsFx.doneData, (_, cards) => cards)

export const deleteCardFx = createEffect<number, void, NetworkError>(
    async (cardId) => {
        await api.delete(`/cards/${cardId}`);
    }
);

export const deleteCardEvent = createEvent<number>();
deleteCardEvent.watch(deleteCardFx);

sample({
    source: deleteCardFx.done,
    target: fetchCardsFx
})