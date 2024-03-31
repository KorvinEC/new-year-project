import { createEffect, createEvent, createStore, sample } from "effector";
import { createGate } from "effector-react";

import { CardType, TemplateType } from "../types";
import { NetworkError } from "../types/error.ts";
import api from "../api.tsx";
import { fetchTemplateFx } from "./Template.ts";
import { submitTemplateFx } from "./TemplateCreate.ts";

export const templatesFx = createEffect<void, TemplateType[], NetworkError>(
    async () => api.get('/cards/templates/')
)

export const $templates = createStore<TemplateType[]>([])

export const TemplatesGate = createGate<void>()

sample({
    source: TemplatesGate.open,
    target: templatesFx,

})

sample({
    source: submitTemplateFx.doneData,
    target: templatesFx
})

export const deleteTemplateFx = createEffect(
    async (id: number) => {
        await api.delete(`/cards/templates/${id}`)
    }
);


deleteTemplateFx.done.watch(() => templatesFx())

$templates
    .on(templatesFx.doneData, (_, templates) => templates)

export const deleteTemplateEvent = createEvent<number>();

deleteTemplateEvent.watch(deleteTemplateFx);

export const createCardFromTemplateEvent = createEvent<number>();

export const createCardFromTemplateFx = createEffect<number, CardType, NetworkError>(
    async (templateId) => await api.post(`/cards`, {templateId})
);

createCardFromTemplateEvent.watch(createCardFromTemplateFx);

export const selectTemplateEvent = createEvent<number>();

selectTemplateEvent.watch((id) => (fetchTemplateFx(id)));
