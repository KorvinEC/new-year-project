import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useGate } from "effector-react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { UserGate } from "./src/stores/Authorization"
import Main from "./src/pages/Main";
import Login from "./src/pages/Login";
import Register from "./src/pages/Register";
import Error from "./src/pages/Error";
import Cards from "./src/pages/Cards";
import Card from "./src/pages/Card";
import CardCreate from "./src/pages/CardCreate";
import Templates from "./src/pages/Templates";
import TemplateCreate from "./src/pages/TemplateCreate";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Main/>,
        errorElement: <Error/>,
        children: [
            {
                path: '/templates',
                element: <Templates/>
            },
            {
                path: '/templates/create',
                element: <TemplateCreate/>
            },
            {
                path: '/cards',
                element: <Cards/>
            },
            {
                path: '/cards/create',
                element: <CardCreate/>
            },
            {
                path: '/cards/:cardId',
                element: <Card/>
            },
            {
                path: '/login',
                element: <Login/>
            },
            {
                path: '/register',
                element: <Register/>
            }
        ]
    },
])

export const App = () => {
    useGate(UserGate)

    return (
        <React.StrictMode>
            <RouterProvider router={router}/>
        </React.StrictMode>
    )
}

ReactDOM.render(<App/>, document.getElementById('root'));
