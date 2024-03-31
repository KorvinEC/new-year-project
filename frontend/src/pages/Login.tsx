import { useUnit } from 'effector-react';
import { $loginForm, changeLoginFieldEvent } from '../stores/Login.ts';
import { signIn } from "../stores/Authorization.ts";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const loginForm = useUnit($loginForm);
    const navigate = useNavigate();

    const handleChange = (event) => {
        changeLoginFieldEvent({name: event.target.name, value: event.target.value});
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        signIn(loginForm);
        navigate('/cards')
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Username: </label>
            <input type="text" name="username" autoComplete="on" value={loginForm.username} onChange={handleChange}/>
            <br/>
            <label>Password: </label>
            <input type="password" name="password" autoComplete="on" value={loginForm.password}
                   onChange={handleChange}/>
            <br/>
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
