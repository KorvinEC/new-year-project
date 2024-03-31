import { useUnit } from "effector-react";
import { $registerForm, changeRegisterFieldEvent, registerEvent } from "../stores/Register.ts";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const registerForm = useUnit($registerForm);

    const handleChange = (event) => {
        changeRegisterFieldEvent({name: event.target.name, value: event.target.value});
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        registerEvent()
        navigate('/cards')
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Register</h1>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" value={registerForm.username} onChange={handleChange}/>
            <br/>

            <label htmlFor="nickname">Nickname</label>
            <input type="text" name="nickname" value={registerForm.nickname} onChange={handleChange}/>
            <br/>

            <label htmlFor="password">Password</label>
            <input type="password" name="password" value={registerForm.password} onChange={handleChange}/>
            <br/>

            <button type="submit">Submit</button>
        </form>
    )
}

export default Register