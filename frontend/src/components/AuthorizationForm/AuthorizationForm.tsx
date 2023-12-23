import AxiosApi from '@actions/axiosApi';
import { UserSchema, useUserStore } from '@enteties/User/model';
import {
    Box, Button, Grid, Link, TextField, styled,
} from '@mui/material';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

const FormInput = styled(TextField)`
    background-color: white;
`;

interface authInfo {
  username: string | null
  password: string | null
}

export const AuthorizationForm = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    async function loginAction(authInfo: authInfo) {
        AxiosApi.post<authInfo, {data:UserSchema}>('/authentication/token', authInfo).then((res) => {
            navigate('/');
            console.log(res);
            useUserStore.setState({ access_token: res.data.access_token, isAuth: true });
        })
            .catch((e) => {
                console.log(e);
                setError(true);
            });
    }

    const mutauion = useMutation(loginAction);
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        mutauion.mutate(data);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <FormInput
                error={error}
                margin="normal"
                required
                fullWidth
                id="username"
                label="Email Address"
                name="username"
                autoComplete="username"
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
