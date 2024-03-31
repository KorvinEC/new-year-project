import {TemplateType} from "../types";
import {createEffect, createStore} from "effector";
import {createGate} from "effector-react";
import api from "../api.tsx";
import {NetworkError} from "../types/error.ts";
import persist from "effector-localstorage";

export const TemplateGate = createGate<number>();

TemplateGate.open.watch((id) => fetchTemplateFx(id));

export const fetchTemplateFx = createEffect<number, TemplateType, NetworkError>(
    async (templateId) => await api.get(`/cards/templates/${templateId}`)
)

export const $template = createStore<TemplateType | null>(null);

persist({
    store: $template,
    key: 'template'
})

$template
    .on(fetchTemplateFx.doneData, (_, template) => template);
