import React from 'react'
import { Button, TextField, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { change, login } from "../../store/actions/oauth.action";
import { Redirect } from "react-router-dom";

export default function Auth() {

    const dispatch = useDispatch();
    const { credentials, success } = useSelector(state => state.oauthReducer);

    return (
        <div className="d-flex bg-white min-vh-100">
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-4">
                        <div className="form-group text-center">
                            <img src="/logo.png" alt="CAR SHOP" height="48" />
                            <Typography className="mt-3" component="h1" variant="h6">Plataforma para Revenda de Carros</Typography>
                        </div>
                        <TextField 
                            label="Email"
                            type= "email"
                            autoComplete= "email"
                            margin= 'normal'
                            value={credentials.email}
                            onChange={text => dispatch(change({email: text.target.value}))}
                        />
                        <TextField 
                            label="Senha"
                            type= "password"
                            margin= 'normal'
                            value={credentials.password}
                            onChange={text => dispatch(change({password: text.target.value}))}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            className="mt-4 mb-4"
                            onClick={() => dispatch(login(credentials))}
                        >
                            Entrar
                        </Button>
                        {(success) && 
                            <Redirect to="/vehicles" />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
