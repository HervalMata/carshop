import { HttpAuth } from "../../config/Http";
import { changeNotify } from "./notify.action";

export const actionTypes = {
    INDEX: 'NOTE_INDEX',
    DESTROY: 'NOTE_DESTROY',
    CHANGE: 'NOTE_CHANGE',
    STORE: 'NOTE_STORE',
    UPDATE: 'NOTE_UPDATE',
}

export const change = (payload) => ({
    type: actionTypes.CHANGE,
    payload
})

export const indexResponse = (payload, isLoadMore) => ({
    type: actionTypes.INDEX,
    payload,
    isLoadMore
})

export const index = (query, isLoadMore) => dispatch => {
    return HttpAuth.get('/notes?' + new URLSearchParams(query))
                .then(res => typeof res !== 'undefined' && dispatch(indexResponse(res.data, isLoadMore)))
}

export const storeResponse = (payload, isLoadMore) => ({
    type: actionTypes.STORE,
    payload,
    isLoadMore
})

export const store = () => dispatch => {
    return HttpAuth.post('/notes')
                .then(res => typeof res !== 'undefined' && dispatch(storeResponse(res.data)))
}

export const updateResponse = (payload, isLoadMore) => ({
    type: actionTypes.UPDATE,
    payload,
    isLoadMore
})

export const update = (data) => dispatch => {
    return HttpAuth.put('/notes/' + data.id, data)
                .then(res => {
                    if (typeof res !== 'undefined') {
                        if (res.data.status === 200) {
                            dispatch(updateResponse(data));
                        }
                        if (res.data.error) {
                            dispatch(changeNotify({
                                open: true,
                                msg: res.data.error,
                                class: 'error'
                            }));
                        }
                    }
                })               
}

export const destroyResponse = (payload) => ({
    type: actionTypes.DESTROY,
    payload
})

export const destroy = (id) => dispatch => {
    return HttpAuth.delete('/notes/' + id)
                .then(res => {
                    if (typeof res !== 'undefined') {
                        if (res.data.status === 200) {
                            dispatch(destroyResponse(id));
                        }
                    }
                })
}