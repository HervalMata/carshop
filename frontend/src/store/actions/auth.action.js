import { Http } from "../../config/Http";
import { changeLoading } from "./loading.action";
import { changeNotify } from "./notify.action";

export const actionTypes = {
    CHANGE: 'AUTH_CHANGE',
    SUCCESS: 'AUTH_SUCCESS'
}

export const change = (payload) => ({
    type: actionTypes.CHANGE,
    payload
})

export const success = (payload) => ({
    type: actionTypes.SUCCESS,
    payload
})

export const setUserToken = token => dispatch => {
    localStorage.setItem('access_token', token);
    dispatch( change({
        email: '',
        password: '',
    }))

    dispatch(success(true))
}

export const login = credentials => dispatch => {
    dispatch(changeLoading({
        open: true,
        msg: 'Autenticando Usuário...'
    }))

    return Http.post('oauth/token', {
        grant_type: 'password',
        client_id: 2,
        client_secret: 'KNqfoZTekM9zDwn15yXyzzqcxy7R86NTN6JhRbj3',
        username: credentials.email,
        password: credentials.password
    }).then(res => {
        dispatch(changeLoading({open: false}));
        if (typeof res !== 'undefined') {
            if (res.data.access_token) {
                dispatch(setUserToken(res.data.access_token));
            }
        }
    }).catch(error => {
        dispatch(changeLoading({open: false}));
        if (typeof error.response !== 'undefined') {
            if (error.response.status === 401 || error.response.status === 400) {
                dispatch(changeNotify({
                    open: true,
                    class: 'error',
                    msg: 'Email e/ou Senha incorretos'
                }))
            } else {
                dispatch(changeNotify({
                    open: true,
                    class: 'error',
                    msg: 'Erro ao se conectar ao servidor'
                }))
            }
        }
    })
}