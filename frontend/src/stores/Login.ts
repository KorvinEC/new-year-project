import { createEvent, createStore } from "effector";
import { submitLoginFx } from "./Authorization.ts";

export const changeLoginFieldEvent = createEvent<{ name: string, value: string }>('change login field');

export const $loginForm = createStore({username: '', password: ''})
    .on(changeLoginFieldEvent, (state, {name, value}) => {
        return {...state, [name]: value};
    })
    .reset(submitLoginFx.done);
