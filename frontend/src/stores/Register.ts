import { createEffect, createEvent, createStore, sample } from "effector";
import { $token } from "./Authorization.ts";
import { AuthorizationInfo } from "../types";
import { NetworkError } from "../types/error.ts";

import api from "../api.tsx";

export const $registerForm = createStore({
    username: '',
    nickname: '',
    password: ''
})

export const changeRegisterFieldEvent = createEvent<{ name: string, value: string }>('change register field');

$registerForm
    .on(changeRegisterFieldEvent, (state, {name, value}) => {
        return {...state, [name]: value};
    });

export const submitRegisterFx = createEffect<{
    username: string,
    nickname: string,
    password: string
}, AuthorizationInfo, NetworkError>(
    async (data) => {
        console.log("submitRegisterFx", data)
        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('nickname', data.nickname);
        formData.append('password', data.password);

        return api.post(
            'authentication/signup',
            formData
        );
    }
)

export const registerEvent = createEvent();

sample({
    source: $registerForm,
    clock: registerEvent,
    target: submitRegisterFx,
})

$token
    .on(submitRegisterFx.doneData, (_, data) => {
        console.log("submitRegisterFx.doneData", data)
        return data.access_token
    })
