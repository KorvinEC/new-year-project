import Cookies from "js-cookie";
import { createGate } from "effector-react";
import { createEffect, createEvent, createStore, sample } from "effector";

import { AuthorizationInfo, CurrentUserInfo, LoginInfo } from "../types";
import { NetworkError } from "../types/error.ts";
import api from "../api.tsx";

// Authorization

export const currentUserFx = createEffect<void, CurrentUserInfo, NetworkError>(
    async () => api.get('users/me')
)

export const submitLoginFx = createEffect<LoginInfo, AuthorizationInfo, NetworkError>(
    async (data) => {
        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('password', data.password);

        return api.post(
            'authentication/token',
            formData
        );
    }
)

export const $currentUser = createStore<CurrentUserInfo | null>(null)

export const $token = createStore<string | null>(Cookies.get('token') ?? null)

export const UserGate = createGate()

sample({
    source: UserGate.open,
    target: currentUserFx,
})

$currentUser
    .on(currentUserFx.doneData, (_, user) => user)

export const signIn = createEvent<LoginInfo>()

sample({
    source: signIn,
    target: submitLoginFx,
})

$token
    .on(submitLoginFx.doneData, (_, data) => {
        return data.access_token
    })
    .watch((token) => {
        if (token !== null) {
            return Cookies.set('token', token)
        }
    })
