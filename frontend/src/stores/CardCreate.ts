import {createEffect, createEvent, createStore, sample} from "effector";
import {CardType, CreateCardType} from "../types";
import api from "../api.tsx";
import {$template} from "./Template.ts";

export const $createCardData = createStore<CreateCardType>({
    card_template_id: null,
    card_nominations_data: [],
    card_suggestions_data: []
})

sample({
    source: $template,
    fn: (template): CreateCardType => ({
        card_template_id: template.id,
        card_nominations_data: template.structure.map((item, index) => ({
            id: index,
            title: item.title,
            subtitle: item.subtitle,
            description: '',
            image: null
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
        const newCardSuggestionsData: CreateCardInfoType = [...state.card_suggestions_data, {
            id: state.card_suggestions_data.length,
            title: '',
            subtitle: '',
            description: '',
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
        const response: CardType = await api.post('/cards/', data);
        console.log("response", response)

        // upload all images in async

        await Promise.all([
            ...data.card_nominations_data.map((item) => {
                if (item.image) {
                    const formData = new FormData();
                    formData.append('image_file', item.image);
                    const params = {
                        'card_data_type': 'nominations'
                    };
                    return api.post(
                        `/cards/${response.id}/data/${item.id}/image/`,
                        formData,
                        {params: params}
                    );
                }
            }),
            ...data.card_suggestions_data.map((item) => {
                if (item.image) {
                    const formData = new FormData();
                    formData.append('image_file', item.image);
                    const params = {
                        'card_data_type': 'suggestions'
                    };
                    return api.post(`/cards/${response.id}/data/${item.id}/image/`, formData, {
                        params: params
                    });
                }
            })
        ]);
    }
);

sample({
    source: $createCardData,
    clock: submitCard,
    target: submitCardFx
});

$createCardData.reset(submitCardFx.done);

// Images

export const updateCardImage = createEvent<{
    index: number,
    nomination: boolean,
    image: File
}>("update card image");

$createCardData
    .on(updateCardImage, (state, {index, nomination, image}) => {
        if (nomination) {
            const newCardNominationsData = [...state.card_nominations_data];
            newCardNominationsData[index] = {...newCardNominationsData[index], image};
            return {...state, card_nominations_data: newCardNominationsData};
        } else {
            const newCardSuggestionsData = [...state.card_suggestions_data];
            newCardSuggestionsData[index] = {...newCardSuggestionsData[index], image};
            return {...state, card_suggestions_data: newCardSuggestionsData};
        }
    });