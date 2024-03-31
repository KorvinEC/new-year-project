import { createEffect, createEvent, createStore, sample } from 'effector';
import api from "../api.tsx";
import { NetworkError } from "../types/error.ts";

export const changeFieldEvent = createEvent<{ index: number, name: string, value: string }>();
export const addFieldEvent = createEvent();
export const removeFieldEvent = createEvent<number>();
export const submitEvent = createEvent();

interface structureType {
    title: string
    subtitle: string
}

export const $structure = createStore<structureType[]>([{title: '', subtitle: ''}]);

export const submitTemplateFx = createEffect<structureType[], void, NetworkError>(
    async (structure) => {
        await api.post('/cards/templates/', {structure})
    }
);

sample({
    source: $structure,
    clock: submitEvent,
    target: submitTemplateFx,
});

$structure
    .on(changeFieldEvent, (structure, {index, name, value}) =>
        structure.map((item, i) => i === index ? {...item, [name]: value} : item)
    )
    .on(removeFieldEvent, (structure, index) =>
        structure.filter((_, i) => i !== index)
    )
    .on(addFieldEvent, (structure) =>
        [...structure, {title: '', subtitle: ''}]
    )
    .reset(submitTemplateFx.done);
