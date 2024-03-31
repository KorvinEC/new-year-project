import {createEffect, createEvent, createStore, sample} from "effector";
import {CardInfoType, CreateCardType} from "../types";
import api from "../api.tsx";
import {$template} from "./Template.ts";

export const $createCardData = createStore<CreateCardType>({
    card_template_id: null,
    card_nominations_data: [],
    card_suggestions_data: []
})

sample({
    source: $template,
    fn: (template) => ({
        card_template_id: template.id,
        card_nominations_data: template.structure.map(item => ({
            id: null,
            title: item.title,
            subtitle: item.subtitle,
            description: '',
            image_url: ''
        })),
        card_suggestions_data: []
    }),
    target: $createCardData
})

export const updateCardNomination = createEvent<{ index: number, description: string, image_url: string }>();

$createCardData
    .on(updateCardNomination, (state, {index, description, image_url}) => {
        const newCardNominationsData = [...state.card_nominations_data];
        newCardNominationsData[index] = {...newCardNominationsData[index], description, image_url};
        return {...state, card_nominations_data: newCardNominationsData};
    })
    .watch(console.log)

export const addCardSuggestion = createEvent();

$createCardData
    .on(addCardSuggestion, (state) => {
        const newCardSuggestionsData: CardInfoType = [...state.card_suggestions_data, {
            id: null,
            title: '',
            subtitle: '',
            description: '',
            image_url: ''
        }];
        return {...state, card_suggestions_data: newCardSuggestionsData}
    });

export const updateCardNominationData = createEvent<{
    index: number,
    name: string,
    value: string
}>('update card nomination data');

$createCardData
    .on(updateCardNominationData, (state, {index, description, image_url}) => {
        const newCardNominationsData = [...state.card_nominations_data];
        newCardNominationsData[index] = {...newCardNominationsData[index], description, image_url};
        return {...state, card_nominations_data: newCardNominationsData};
    });

export const updateCardSuggestionData = createEvent<{
    index: number,
    name: string,
    value: string
}>('update card suggestion data');

$createCardData
    .on(updateCardSuggestionData, (state, {index, name, value}) => {
        const newCardSuggestionsData = [...state.card_suggestions_data];
        newCardSuggestionsData[index] = {...newCardSuggestionsData[index], [name]: value};
        return {...state, card_suggestions_data: newCardSuggestionsData};
    });


export const removeCardSuggestion = createEvent<number>();

$createCardData
    .on(removeCardSuggestion, (state, index) => {
        const newCardSuggestionsData = state.card_suggestions_data.filter((_, i) => i !== index);
        return {...state, card_suggestions_data: newCardSuggestionsData};
    });

export const submitCard = createEvent();

export const submitCardFx = createEffect<CreateCardType, void, Error>(
    async (data) => {
        console.log("submitCardFx", data);
        await api.post('/cards/', data);
    }
);

sample({
    source: $createCardData,
    clock: submitCard,
    target: submitCardFx
});

$createCardData.reset(submitCardFx.done);