import { UserSchema, useUserStore } from '@enteties/User/model';
import {
    Box, Button, Grid, Link, TextField, styled,
} from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

const FormInput = styled(TextField)`
    background-color: white;
`;

interface authInfo {
  email: string | null
  password: string | null
}

export const AuthorizationForm = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    async function loginAction(authInfo: authInfo) {
        axios.post<authInfo, {data: {data: UserSchema}}>('/login', authInfo).then((res) => {
            navigate('/');
            useUserStore.setState({ ...res.data.data, isAuth: true });
        })
            .catch(() => {
                setError(true);
            });
    }

    const mutauion = useMutation(loginAction);
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        mutauion.mutate({
            email: data.get('email') as string,
            password: data.get('password') as string,
        });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <FormInput
                error={error}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                variant="filled"
                helperText={error && 'Неправильный логин или пароль'}
            />
            <FormInput
                error={error}
                variant="filled"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Sign In
            </Button>
            <Grid container>

                <Grid item>
                    <Link href="/signup" variant="body2">
                        Регистрация
                    </Link>
                </Grid>
            </Grid>
        </Box>
    );
};
