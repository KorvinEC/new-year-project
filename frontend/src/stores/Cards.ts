import { createGate } from "effector-react";
import { createEffect, createEvent, createStore, sample } from "effector";

import { CardType } from "../types";
import { NetworkError } from "../types/error.ts";
import api from "../api.tsx";
import { submitCardFx } from "./CardCreate.ts";
import { logoutEvent } from "./Authorization.ts";


export const $cards = createStore<CardType[]>([])

export const CardsGate = createGate()

export const fetchCardsFx = createEffect<void, CardType[], NetworkError>(
    async () => await api.get('/cards/')
)

sample({
    source: CardsGate.open,
    target: fetchCardsFx
})

sample({
    source: submitCardFx.done,
    target: fetchCardsFx
})

$cards
    .on(fetchCardsFx.doneData, (_, cards) => cards)
    .reset(logoutEvent)

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