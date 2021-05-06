import { CircularProgress, InputAdornment, FormControlLabel, Checkbox, Button, TextField, Select, MenuItem } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import Header from '../header'
import { store, update, show, change, cep, brand, model, version, uploadPhoto, deletePhoto, reorderPhoto, indexResponse } from "../../store/actions/vehicles.action";
import { useSelector, useDispatch } from "react-redux";
import MaskedInput from "react-text-mask";
import NumberFormat from "react-number-format";
import { Confirm } from "../components";
import { rootUrl } from "../../config/App";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import ArrayMove from "array-move";
import { FaTrash, FaSave } from "react-icons/fa";
import './vehicle.css';
import { Link, Redirect } from "react-router-dom";

const SortableItem = SortableElement(({value}) => <div className="bg-img" style={{backgroundImage: 'url('+rootUrl+'thumb/vehicles/'+value.img+'?u='+value.user_id+'&s='+value.vehicle_id+'&h=250&w=250)'}}></div>);

const SortableList = SortableContainer(({children}) => {
    return <div className="row">{children}</div>
})

const TextMaskCustom = (props) => {
    const { inputRef, ...other } = props;
    let mask = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
    return (
        <MaskedInput 
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null)
            }}
            mask={mask}
            guide={false}
        />    
    )
}

const NumberFormatCustom = (props) => {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat 
            {...other}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values
                    }
                })
            }}
            decimalSeparator=","
            thousandSeparator="."
            prefix={other.name}
        />    
    )
}

export default function VehicleEdit(props) {

    const dispatch = useDispatch();
    const data = useSelector(state => state.vehiclesReducer)

    const [state, setstate] = useState({
        isLoadingCep: false,
        isDeleted: null,
        redirect: false,
        tips: 0,
        confirmEl: null
    })

    const vehicle_id = (props.match.params.id) ? props.match.params.id : null;

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const index = () => {
            if (vehicle_id) {
                dispatch(show(vehicle_id)).then(res => res && setIsLoading(false))
            } else {
                dispatch(store()).then(res => res && setIsLoading(false))
            }
        }
        index();
    }, [dispatch, vehicle_id])

    useEffect(() => {
        return () => {
            dispatch(indexResponse({ success: false }))
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handUpload = (event) => {
        [...event.target.files].map(img => {
            const body = new FormData();
            body.append('file', img);
            body.append('id', data.vehicle_id);
            return dispatch(uploadPhoto(body));
        })
        if (data.error.vehicle_photos && delete data.error.vehicle_photos);
    }

    const _deletePhoto = (id) => {
        setstate({ 
            ...state,
            isDeleted: id 
        })
        dispatch(deletePhoto(id)).then(res => res && setstate({ 
            ...state,
            isDeleted: null
        }))
    }

    const handleConfirm = event => {
        setstate({ 
            ...state,
            confirmEl: event.currentTarget 
        });
    }

    const onSortEnd = ({oldIndex, newIndex}) => {
        let items = ArrayMove(data.vehicle.vehicle_photos, oldIndex, newIndex);
        let order = items.map(({id}) => id);
        dispatch(reorderPhoto({order: order}, items));
    }

    return (
        <>
            {(data.success) && <Redirect to="/vehicles" />}
            <Header title="Veículos - Gestão" button={<Button color="inherit" className="ml-auto">Salvar</Button>}/>

            <div className="container mt-4 pt-3">
                {(isLoading) ? <div className="d-flex justify-content-center mt-5 pt-5"><CircularProgress /></div> :
                    <div className="row">
                        <div className="col-md-7">
                            <h3 className="font-weight-normal mb-4">Localização do Veículo</h3>
                            <div className="card card-body" onClick={() => setstate({ ...state, tips: 0 })}>
                                <div className="row">
                                    <div className="col-md-7 form-group">
                                        <label className="label-custom">CEP</label>
                                        <TextField 
                                            style={(state.isLoadingCep) ? {opacity:0.5} : {}}
                                            error={(data.error.zipCode) && true}
                                            type="tel"
                                            InputProps={{
                                                inputComponent: TextMaskCustom,
                                                value: data.vehicle.zipCode,
                                                onChange: text => {
                                                    dispatch(change({zipCode: text.target.value}));
                                                    if (text.target.value.length > 8) {
                                                        setstate({ isLoadingCep: true})
                                                        dispatch(cep(text.target.value)).then(res => res && setstate({isLoadingCep: false}))
                                                        if (data.error.zipCode) {
                                                            delete data.error.zipCode
                                                            delete data.error.uf
                                                            delete data.error.city
                                                        }
                                                    }
                                                },
                                                endAdornment: (
                                                    <InputAdornment position="start">
                                                        {(state.isLoadingCep) ? <CircularProgress size={32} /> : <> </>
                                                        }
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                        {(data.error.zipCode) && 
                                            <strong className="text-danger">{data.error.zipCode[0]}</strong>
                                        }
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-9 form-group">
                                        <label className="label-custom">Cidade</label>
                                        <TextField 
                                            error={(data.error.city) && true}
                                            disabled
                                            value={data.vehicle.city || ''}
                                        />
                                        {(data.error.city) && 
                                            <strong className="text-danger">{data.error.city[0]}</strong>
                                        }
                                    </div>
                                    <div className="col-md-3">
                                        <label className="label-custom">Estado</label>
                                        <TextField 
                                            error={(data.error.uf) && true}
                                            disabled
                                            value={data.vehicle.uf || ''}
                                        />
                                        {(data.error.uf) && 
                                            <strong className="text-danger">{data.error.uf[0]}</strong>
                                        }
                                    </div>
                                </div>
                            </div>
                            <h3 className="font-weight-normal mt-4 mb-4">Dados do Veículo</h3>
                            <div className="card card-body" onClick={() => setstate({ ...state, tips: 1 })}>
                                <div className="form-group">
                                    <label className="label-custom">Categoria</label>
                                    <Select 
                                        error={data.error.vehicle_type && true}
                                        value={data.vehicle.vehicle_type || ''}
                                        onChange={event => {
                                            dispatch(change({
                                                vehicle_type: event.target.value,
                                                vehicle_brand: null,
                                                vehicle_model: null,
                                                vehicle_version: null,
                                                vehicle_gearbox: null,
                                                vehicle_fuel: null,
                                                vehicle_steering: null,
                                                vehicle_motorpower: null,
                                                vehicle_doors: null,
                                            }))
                                            dispatch(brand(event.target.value))
                                            if (data.error.vehicle_type) {
                                                delete data.error.vehicle_type
                                            }
                                        }}
                                    >
                                    {data.vehicle_types.map(item => (
                                        <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                                    ))}
                                    </Select>
                                    {(data.error.vehicle_type) && 
                                            <strong className="text-danger">{data.error.vehicle_type[0]}</strong>
                                    }
                                </div>
                                <div className="form-group">
                                    <label className="label-custom">Marcas</label>
                                    <Select 
                                        error={data.error.vehicle_brand && true}
                                        value={data.vehicle.vehicle_brand || ''}
                                        onChange={event => {
                                            dispatch(change({
                                                vehicle_brand: event.target.value,
                                                vehicle_model: null,
                                                vehicle_version: null,
                                            }))
                                            dispatch(model(data.vehicle.vehicle_type, event.target.value))
                                            if (data.error.vehicle_brand) {
                                                delete data.error.vehicle_brand
                                            }
                                        }}
                                    >
                                    {data.vehicle_brand.map(item => (
                                        <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                                    ))}
                                    </Select>
                                    {(data.error.vehicle_brand) && 
                                            <strong className="text-danger">{data.error.vehicle_brand[0]}</strong>
                                    }
                                </div>
                                
                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <label className="label-custom">Modelo</label>
                                        <Select
                                            error={data.error.vehicle_model && true}
                                            value={data.vehicle.vehicle_model || ''}
                                            onChange={event => {
                                                dispatch(change({
                                                    vehicle_model: event.target.value,
                                                    vehicle_version: null,
                                                }))
                                                dispatch(version(data.vehicle.vehicle_brand, event.target.value))
                                                if (data.error.vehicle_model) {
                                                    delete data.error.vehicle_model
                                                }
                                            }}
                                        >
                                            { data.vehicle_model.map(item => (
                                                <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                                            ))}
                                        </Select>
                                        {(data.error.vehicle_model) &&
                                            <strong className="text-danger">{data.error.vehicle_model[0]}</strong>
                                        }
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label className="label-custom">Ano do Modelo</label>
                                        <Select
                                            error={data.error.vehicle_regdate && true}
                                            value={data.vehicle.vehicle_regdate || ''}
                                            onChange={event => {
                                                dispatch(change({
                                                    vehicle_regdate: event.target.value
                                                }))
                                                if (data.error.vehicle_regdate) {
                                                    delete data.error.vehicle_regdate
                                                }
                                            }}
                                        >
                                            {data.regdate.map(item => (
                                                <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                                            ))}
                                        </Select>
                                        {(data.error.vehicle_regdate) &&
                                            <strong className="text-danger">{data.error.vehicle_regdate[0]}</strong>
                                        }
                                    </div>
                                </div>
                                <div className="form-group">
                                        <label className="label-custom">Versão</label>
                                        <Select
                                            error={data.error.vehicle_version && true}
                                            value={data.vehicle.vehicle_version || ''}
                                            onChange={event => {
                                                dispatch(change({
                                                    vehicle_version: event.target.value
                                                }))
                                                if (data.error.vehicle_version) {
                                                    delete data.error.vehicle_version
                                                }
                                            }}
                                        >
                                            {data.vehicle_version.map(item => (
                                                <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                                            ))}
                                        </Select>
                                        {(data.error.vehicle_version) &&
                                            <strong className="text-danger">{data.error.vehicle_version[0]}</strong>
                                        }
                                </div>
                            </div>
                            <div className="card card-body mt-4" onClick={() => setstate({ ...state, tips: 1 })}>
                                <div className="row">
                                    {/* INICIO MOSTRA SE FOR CARRO */}
                                    {(data.vehicle.vehicle_type === 2020) &&
                                        <>
                                            <div className="col-md-6 form-group">
                                                <label className="label-custom">Cãmbio</label>
                                                <Select
                                                    value={data.vehicle.vehicle_gearbox || ''}
                                                    onChange={event => dispatch(change({ vehicle_gearbox: event.target.value }))}
                                                >
                                                    {data.gearbox.map(item => (
                                                    <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                                                    ))}
                                                </Select>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label className="label-custom">Combustível</label>
                                                <Select
                                                    value={data.vehicle.vehicle_fuel || ''}
                                                    onChange={event => dispatch(change({ vehicle_fuel: event.target.value }))}
                                                >
                                                    {data.fuel.map(item => (
                                                    <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                                                    ))}
                                                </Select>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label className="label-custom">Direção</label>
                                                <Select
                                                    value={data.vehicle.vehicle_steering || ''}
                                                    onChange={event => dispatch(change({ vehicle_steering: event.target.value }))}
                                                >
                                                    {data.car_steering.map(item => (
                                                    <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                                                    ))}
                                                </Select>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label className="label-custom">Potência do Motor</label>
                                                <Select
                                                    value={data.vehicle.vehicle_motorpower || ''}
                                                    onChange={event => dispatch(change({ vehicle_motorpower: event.target.value }))}
                                                >
                                                    {data.motorpower.map(item => (
                                                    <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                                                    ))}
                                                </Select>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label className="label-custom">Portas</label>
                                                <Select
                                                    value={data.vehicle.vehicle_doors || ''}
                                                    onChange={event => dispatch(change({ vehicle_doors: event.target.value }))}
                                                >
                                                    {data.doors.map(item => (
                                                    <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                                                    ))}
                                                </Select>
                                            </div>
                                        </>
                                    }
                                    {/* TERMINA SE FOR CARRO */}
                                    {/* INICIO MOSTRA SE FOR MOTO */}
                                    {(data.vehicle.vehicle_type === 2060) &&
                                        <div className="col-md-6 form-group">
                                            <label className="label-custom">Cilindradas</label>
                                            <Select
                                                value={data.vehicle.vehicle_cubiccms || ''}
                                                onChange={event => dispatch(change({ vehicle_cubiccms: event.target.value }))}
                                            >
                                                {data.cubiccms.map(item => (
                                                    <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                    }
                                    {/* TERMINA SE FOR MOTO */}
                                    <div className="col-md-6 form-group">
                                            <label className="label-custom">Cor</label>
                                            <Select
                                                value={data.vehicle.vehicle_color || ''}
                                                onChange={event => dispatch(change({ vehicle_color: event.target.value }))}
                                            >
                                                {data.carcolor.map(item => (
                                                    <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                                                ))}
                                            </Select>
                                    </div>
                                    <div className="col-md-6 form-group">
                                            <label className="label-custom">Quilometragem</label>
                                            <TextField
                                                type="tel"
                                                InputProps={{
                                                    inputComponent: NumberFormatCustom,
                                                    value: data.vehicle.vehicle_mileage || '',
                                                    onChange: text => dispatch(change({ vehicle_mileage: text.target.value }))
                                                }}
                                            />
                                    </div>
                                </div>
                            </div>
                            {(data.vehicle.vehicle_type) && 
                            <>
                                <h3 className="font-weight-normal mt-4 mb-4">Itens e Opcionais</h3>
                                <div className="card card-body" onClick={() => setstate({ ...state, tips: 1 })}>
                                    <div className="form-group">
                                        {data.features.map(item => (item.vehicle_type_id === data.vehicle.vehicle_type) && (
                                            <div key={item.id} className="col-md-6">
                                                <FormControlLabel 
                                                    control={
                                                        <Checkbox 
                                                            checked={data.vehicle.vehicle_features[item.value] ? true : false}
                                                            onChange={() => {
                                                                let checked = data.vehicle.vehicle_features[item.value] ? 
                                                                    delete data.vehicle.vehicle_features[item.value] :
                                                                    {[item.value] : item}
                                                                dispatch(change({ vehicle_features: {
                                                                    ...data.vehicle.vehicle_features,
                                                                    ...checked
                                                                }}))
                                                            }}
                                                        />
                                                    }
                                                    label={item.label}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                            }
                            <h3 className="font-weight-normal mt-4 mb-4">Financeiro</h3>
                                <div className="card card-body">
                                    <div className="form-group">
                                        <h3 className="label-custom">Estado Financeiro</h3>
                                        <div className="row">
                                            {data.financial.map(item => (
                                                <div key={item.id} className="col-md-6">
                                                    <FormControlLabel 
                                                        control={
                                                            <Checkbox 
                                                                checked={data.vehicle.vehicle_financial[item.value] ? true : false}
                                                                onChange={() => {
                                                                    let checked = data.vehicle.vehicle_financial[item.value] ? 
                                                                        delete data.vehicle.vehicle_financial[item.value] :
                                                                        {[item.value] : item}
                                                                    dispatch(change({ vehicle_financial: {
                                                                        ...data.vehicle.vehicle_financial,
                                                                        ...checked
                                                                    }}))
                                                                }}
                                                            />
                                                        }
                                                        label={item.label}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <label className="label-custom">Preço</label>
                                            <TextField
                                                type="tel"
                                                name="R$ "
                                                InputProps={{
                                                    inputComponent: NumberFormatCustom,
                                                    value: data.vehicle.vehicle_price || '',
                                                    onChange: text => {
                                                        dispatch(change({ vehicle_price: text.target.value }))
                                                        if (data.error.vehicle_price) {
                                                            delete data.error.vehicle_price
                                                        }
                                                    }
                                                }}
                                            />
                                            {(data.error.vehicle_price) &&
                                                <strong className="text-danger">{data.error.vehicle_price[0]}</strong>
                                            }
                                    </div>
                                </div>
                                <h3 className="font-weight-normal mt-4 mb-4">Descrição do Anúncio</h3>
                                <div className="card card-body">
                                    <div className="form-group">
                                    <h3 className="label-custom">Titulo</h3>
                                        <TextField 
                                            value={data.vehicle.title || ''}
                                            onChange={text => dispatch(change({ title: text.target.value }))}
                                            onFocus={() => setstate({ ...state, tips: 2 })}
                                        />
                                    </div>
                                    <div className="form-group">
                                    <h3 className="label-custom">Descrição</h3>
                                        <TextField 
                                            multiline
                                            rows="5"
                                            rowsMax="5"
                                            value={data.vehicle.description || ''}
                                            onChange={text => dispatch(change({ description: text.target.value }))}
                                            onFocus={() => setstate({ ...state, tips: 3 })}
                                        />
                                    </div>
                                </div>
                                <h3 className="font-weight-normal mt-4 mb-4">Fotos</h3>
                                <div className="card card-body mb-5">
                                    {(data.error.vehicle_photos) && 
                                        <strong className="text-danger">{data.error.vehicle_photos[0]}</strong>
                                    }
                                    <SortableList axis="xy" onSortEnd={onSortEnd}>
                                        {data.vehicle.vehicle_photos.map((item, index) => (
                                            <div key={item.id} className="col-6 col-md-4">
                                                <div className=" box-image d-flex justify-content-center align-items-center mt-3">
                                                    {(state.isDeleted === item.id) ?
                                                        <CircularProgress size="30" color="secondary" />
                                                        :
                                                        <>
                                                            <span id={item.id} onClick={handleConfirm} className="img-action d-flex justify-content-center align-items-center">
                                                                <div className="app-icon d-flex">
                                                                    <FaTrash color="#fff" size="1.2em" />
                                                                </div>
                                                            </span>
                                                            <SortableItem key={'item-' + item.id} index={index} value={item} />
                                                            {(Boolean(state.confirmEl)) &&
                                                                <Confirm
                                                                    open={(item.id === parseInt(state.confirmEl.id))}
                                                                    onConfirm={() => _deletePhoto(item.id)}
                                                                    onClose={() => setstate({ confirmEl: null })}
                                                                />
                                                            }
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        ))}
                                        <div className="col-6 col-md-4">
                                            <div className=" box-image d-flex justify-content-center align-items-center mt-3">
                                                <input onClick={() => setstate({ ...state, tips: 4 })} onChange={handUpload} type="file" multiple name="file" className="file-input" />
                                                {(data.upload_photo)? <CircularProgress /> :
                                                    <p className="box-text">
                                                        <span className="text-plus">+</span>
                                                        <span>Adicionar</span>
                                                    </p>
                                                }
                                            </div>
                                        </div>
                                    </SortableList>
                                </div>
                        </div>
                        
                        <div className="col-md-5 d-none d-md-block">
                            <div className="tips">
                            <h3 className="font-weight-normal mb-4">Dicas</h3>
                                <div className="card card-body">
                                    {(state.tips === 0) && 
                                        <>
                                            <h5>Endereço</h5>
                                            <p>O Endereço é a primeira informação que os consumidores procuram quando estão pesquisando Veículos. <br/><br/>Anúncios com <strong>endereço</strong> terão mais oportunidades de serem exibidos nas novas formas de buscas, e receber mais contatos.</p>
                                        </>
                                    }
                                    {(state.tips === 1) && 
                                        <>
                                            <h5>Dados Verídicos</h5>
                                            <p>Informe os dados corretos <br/>(quilometragem, ano modelo, versão, etc.) <br/>para conseguir o comprador rapidamente.</p>
                                        </>
                                    }
                                    {(state.tips === 2) && 
                                        <>
                                            <h5>Título</h5>
                                            <p>Sugerimos complementar o título com características do seu carro,<br/>Ex. Fiat Palio 2004 em perfeito estado.</p>
                                        </>
                                    }
                                    {(state.tips === 3) && 
                                        <>
                                            <h5>Descrição</h5>
                                            <p>Inclua características do carro, como ar condiucionado, vidros e travas elétricas, alarme, som, DVD, air bag duplo, IPVA pago, duvídas pendentes etc.</p>
                                        </>
                                    }
                                    {(state.tips === 4) && 
                                        <>
                                            <strong>Fotos reais: </strong> Envie fotos reais do seu carro, assim aumenta suas chances de convecer o potencial comprador.<br/><br/>
                                            <strong>Todos os ângulos:</strong> Além das fotos do exterior do carro, não se esqueça de mostrar o interior.
                                        </>
                                    }
                                </div>
                            </div>
                            <div className="d-md-flex btn-save">
                                <Link to="/vehicles" className="mr-2">
                                    <Button variant="contained" size="large">Voltar</Button>
                                </Link>
                                <Button onClick={() => dispatch(update(data.vehicle))} variant="contained" color="primary" size="large">
                                    <FaSave size="1.5rem" className="mr-3" />
                                    Salvar
                                </Button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}
