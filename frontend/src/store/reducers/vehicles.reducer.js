import { actionTypes } from "../actions/vehicles.action";

const initialState = {
    vehicles: {
        data: []
    },
    vehicle: { 
        vehicle_features: []
    },
    vehicle_brand: [],
    vehicle_model: [],
    vehicle_version: [],
    uploaad_photo: false,
    success: false,
    error: {}
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, { type, payload, isLoadMore }) => {
    switch (type) {

    case actionTypes.INDEX:
        if (isLoadMore) {
            payload.vehicles.data = state.vehicles.data.concat(payload.vehicles.data)
        }
        return { ...state, ...payload }

    case actionTypes.DESTROY:
        return { 
            ...state, 
            vehicles: {
                ...state.vehicles,
                data: state.vehicles.data.filter(item => item.id !== payload)
            }
        }

    case actionTypes.CHANGE:
        return { 
            ...state, 
            vehicle: {
                ...state.vehicle,
                ...payload
                }
        }

    case actionTypes.UPDATE:
        let index = state.vehicles.data.findIndex(item => item.id === payload.id)
        state.vehicles.data[index] = payload;
        return { 
            ...state, 
            vehicles: {
                ...state.vehicles,
                data: state.vehicles.data
            }
        }      


    case actionTypes.UPLOAD_PHOTO:
        return { 
            ...state, 
            vehicle: {
                ...state.vehicle,
                vehicle_photos: [
                    ...state.vehicle.vehicle_photos.concat(payload)
                ]
            }
        }  
        
    case actionTypes.DELETE_PHOTO:
        return { 
            ...state, 
            vehicle: {
                ...state.vehicle,
                vehicle_photos: state.vehicle.vehicle_photos.filter(item => item.id !== payload)
            }
        }

    case actionTypes.REORDER_PHOTO:
        return { 
            ...state, 
            vehicle: {
                ...state.vehicle,
                vehicle_photos: payload
            }
        }

    case actionTypes.SUCCESS:
        return { 
            ...state, 
            success: payload
        }

    case actionTypes.ERROR:
        return { 
            ...state, 
            error: payload
        }
        

    default:
        return state
    }
}
