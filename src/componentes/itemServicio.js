
import React from 'react';
import { Link } from 'react-router-dom';

import { Table, Button, Modal, ModalBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignRight, faAngleRight, faCaretLeft, faCaretSquareRight, faCheck, faEdit, faEye, faEyeDropper, faEyeSlash, faInfo, faLock, faPlus, faSave, faSquare, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../Auth/useAuth"
import { ComponenteInputUser, Select1 } from './elementos/input';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados
import Home from './elementos/home'
import { useState, useEffect } from "react";
import { URL, INPUT } from '../Auth/config';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast'



function ItemServicio() {


    const [datos, setDatos] = useState([]);
    const [modalInsertarItem, setModalInsertarItem] = useState(false);
    const [modalEditarItem, setModalEditarItem] = useState(false);
    const [modalInsertarDependientes, setModalInsertarDependientes] = useState(false);
    const [modalEditarDependientes, setModalEditarDependientes] = useState(false)
    const [verDependientes, setVerDependientes] = useState(false);

    const [id, setId] = useState({ campo: null, valido: null })
    const [nombre, setNombre] = useState({ campo: null, valido: null })
    const [nombreDependiente, setNombreDependiente] = useState({ campo: null, valido: null })
    const [codigo, setCodigo] = useState(null)
    const [itemServicio, setItemServicio] = useState([]);


    const [verIntervalo, setVerIntervalo] = useState(false);
    const [modalInsertarIntervalo, setModalInsertatIntervalo] = useState(false)
    const [modalVerIntervalo, setModalVerIntervalo] = useState(false)
    const [idIntervalo, setIdIntervalo] = useState({ campo: null, valido: null })
    const [descripcion, setDescripcion] = useState({ campo: null, valido: null })
    const [metodologia, setMetodologia] = useState({ campo: null, valido: null })
    const [intervalo, setIntervalo] = useState({ campo: null, valido: null })
    const [unidad, setUnidad] = useState({ campo: null, valido: null })
    const [inferior, setInferior] = useState({ campo: 0, valido: 'true' })
    const [superior, setSuperior] = useState({ campo: 0, valido: 'true' })
    const [edad1, setEdad1] = useState({ campo: null, valido: null })
    const [edad2, setEdad2] = useState({ campo: null, valido: null })
    const [sexo, setSexo] = useState({ campo: null, valido: null })
    const [muestras, setMuestras] = useState({ campo: null, valido: null })
    const [idItemServicio, setIdItemServicio] = useState({ campo: null, valido: null })
    const [sexos] = useState([{ id: "T", nombre: "todos" }, { id: "M", nombre: "Masculino" }, { id: "F", nombre: "Femenino" }]);
    const [listIntervalo, setListIntervalo] = useState([])



    const [mensaje, setMensaje] = useState(null)

    const auth = useAuth()
    useEffect(() => {

        listaItemServicio()
    }, [])

    useEffect(() => {
        setTimeout(() => {
            setMensaje(null)
        }, 10000);
    }, [mensaje])


    const token = localStorage.getItem("token")
    axios.interceptors.request.use(
        config => {
            config.headers.authorization = `Bearer ${token}`
            return config
        },
        error => {
            auth.logout()
            return Promise.reject(error)
        }
    )

    const listaItemServicio = async () => {

        axios.post(URL + '/itemservicio/all').then(json => {
            // console.log(json.data, 'items BD')
            setItemServicio(json.data)
        })

    }


    const vaciarDatos = () => {
        setId({ campo: null, valido: null })
        setNombre({ campo: null, valido: 'true' })
    }

    const abrirModalInsetar = () => {
        setModalInsertarItem(true);
        setMensaje(null)

    }

    const abrirModalEditar = (a) => {
        setId({ campo: a.id, valido: 'true' })
        setNombre({ campo: a.item, valido: 'true' })
        setMensaje(null)
        setModalEditarItem(true)
    }

    const insertar = async () => {
        // console.log("datos servicio : ", nombre)
        if (nombre.valido === 'true') {
            let today = new Date()
            let fecha = today.toISOString().split('T')[0]

            await axios.post(URL + '/itemservicio/insertar', {
                nombre: nombre.campo,
                creado: fecha + ' ' + new Date().toLocaleTimeString()
            }).then(json => {
                if (json.data.msg != null) {
                    toast.error(json.data.msg)
                }
                else {
                    setItemServicio(json.data)
                    vaciarDatos()
                    setModalInsertarItem(false)
                    toast.success('Opeacion Exitosa')
                }
            })

        } else {
            toast.error('Complete los campos')
        }
    }


    const actualizar = async (e) => {
        if (id.valido === 'true' && nombre.valido === 'true') {
            console.log('pasa validaciones')

            let today = new Date()
            let fecha = today.toISOString().split('T')[0]
            axios.post(URL + '/itemservicio/actualizar', {
                id: id.campo,
                nombre: nombre.campo,
                modificado: fecha + ' ' + new Date().toLocaleTimeString()
            }).then(json => {
                if (json.data.msg != null) {
                    toast.error(json.data.msg)
                }
                else {
                    setItemServicio(json.data)
                    setNombre({ campo: null, valido: null })
                    vaciarDatos()
                    setModalEditarItem(false)
                    toast.success('Operacion exitosa !!')
                }
            })
        } else {
            toast.error('Complete el formulario')
        }
    }

    const eliminar = async (codigo) => {

        const ok = window.confirm('¿está seguro de eliminar este registro?');
        if (ok) {
            if (codigo != null) {
                axios.post(URL + '/itemservicio/eliminar', { codigo: codigo }).then(json => {
                    setItemServicio(json.data)
                    setDatos([])
                    vaciarDatos()
                    toast.success('Operacion exitosa')
                })
            }
        }
    }

    const listarDependientes = (dato) => {
        setNombre({ campo: dato.item, valido: null })
        setCodigo(dato.codigo)
        setDatos([])
        if (dato.codigo !== null) {
            axios.post(URL + '/itemServicio/dependientes1', { dato: dato.codigo }).then(json => {
                setDatos(json.data)
                setModalVerIntervalo(false)
            })
        }
    }
    const añadirDependientes = () => {
        let today = new Date()
        let fecha = today.toISOString().split('T')[0]
        if (codigo !== null && nombreDependiente.valido === 'true') {
            axios.post(URL + '/itemServicio/anadirDependientes',
                {
                    codigo: codigo,
                    nombre: nombreDependiente.campo,
                    creado: fecha + ' ' + new Date().toLocaleTimeString()
                }).then(json => {
                    if (json.data.msg != null) {
                        toast.error(json.data.msg)
                    } else {
                        setDatos(json.data)
                        setNombreDependiente({ campo: null, valido: null })
                        setModalInsertarDependientes(false)
                        toast.success('Opearacion Exitosa')
                    }
                })
        }
        else {
            toast.error('Complete todos los campos')
        }
    }
    const actualizarDependientes = async (e) => {
        if (id.valido === 'true' && codigo !== null && nombreDependiente.valido === 'true') {
            let today = new Date()
            let fecha = today.toISOString().split('T')[0]
            axios.post(URL + '/itemservicio/actualizarDependientes', {
                id: id.campo,
                codigo: codigo,
                nombre: nombreDependiente.campo,
                modificado: fecha + ' ' + new Date().toLocaleTimeString()
            }).then(json => {
                if (json.data.msg != null) {
                    toast.error(json.data.msg)
                }
                else {
                    setDatos(json.data)
                    setNombreDependiente({ campo: null, valido: null })
                    setModalEditarDependientes(false)
                    toast.success('Operacion Exitosa')
                }
            })
        } else {
            toast.error('Complete todos los campos')
        }
    }



    const eliminarDependiente = async (dato) => {
        const ok = window.confirm('¿está seguro de eliminar este registro?');
        if (ok) {
            if (dato.id != null && dato.codigo != null) {
                axios.post(URL + '/itemservicio/eliminarDependiente', { id: dato.id, codigo: dato.codigo }).then(json => {
                    setDatos(json.data)
                    toast.success('Operacion exitosa')
                })

            }
        }
    }


    const listaIntervalosPrin = async (intervalo) => {

        setNombre({ campo: intervalo.item, valido: 'true' })
        setIdItemServicio({ campo: intervalo.id, valido: 'true' })
        setDatos([])
        if (intervalo.id != null) {

            axios.post(URL + '/intervalo/all', { id: intervalo.id }).then(json => {
                setDatos(json.data)
                setModalVerIntervalo(false)
            })
        }
    }

    const listaIntervalos = async (intervalo) => {

        setNombre({ campo: intervalo.y, valido: 'true' })
        setIdItemServicio({ campo: intervalo.id, valido: 'true' })
        setDatos([])
        if (intervalo.id != null) {

            axios.post(URL + '/intervalo/all', { id: intervalo.id }).then(json => {
                setDatos(json.data)
                setModalVerIntervalo(false)
            })
        }
    }


    const cancelarInsertarIntervalo = () => {
        setIdItemServicio({ campo: null, valido: null })
        setDescripcion({ campo: null, valido: null })
        setMetodologia({ campo: null, valido: null })
        setIntervalo({ campo: null, valido: null })
        setUnidad({ campo: null, valido: null })
        setInferior({ campo: null, valido: null })
        setSuperior({ campo: null, valido: null })
        setEdad1({ campo: null, valido: null })
        setEdad2({ campo: null, valido: null })
        setSexo({ campo: null, valido: null })
        setMuestras({ campo: null, valido: null })
        setIdIntervalo({ campo: null, valido: null })
        setNombreDependiente({ campo: null, valido: null })
        setModalInsertatIntervalo(false)
        setVerIntervalo(true)
    }


    const rellenarIntervalo = () => {
        setIdIntervalo({ campo: listIntervalo[0].id, valido: 'true' })
        setIdItemServicio({ campo: listIntervalo[0].idItemServicio, valido: 'true' })
        setDescripcion({ campo: listIntervalo[0].descripcion, valido: 'true' })
        setMetodologia({ campo: listIntervalo[0].metodologia, valido: 'true' })
        setIntervalo({ campo: listIntervalo[0].intervalo, valido: 'true' })
        setUnidad({ campo: listIntervalo[0].unidad, valido: 'true' })
        setInferior({ campo: listIntervalo[0].inferior, valido: 'true' })
        setSuperior({ campo: listIntervalo[0].superior, valido: 'true' })
        setEdad1({ campo: listIntervalo[0].edad1, valido: 'true' })
        setEdad2({ campo: listIntervalo[0].edad2, valido: 'true' })
        setSexo({ campo: listIntervalo[0].sexo, valido: 'true' })
        setMuestras({ campo: listIntervalo[0].muestras, valido: 'true' })
        setModalInsertatIntervalo(true)
        setVerIntervalo(false)
    }

    const mostrarIntervalo = async (intervalo) => {

        if (intervalo != null) {
            axios.post(URL + '/intervalo/ver', { id: intervalo }).then(json => {
                setListIntervalo(json.data)
                setVerIntervalo(false)
                setModalVerIntervalo(true)
            })
        }
    }

    const añadirIntervalo = () => {
        let today = new Date()
        let fecha = today.toISOString().split('T')[0]

        if (idItemServicio.valido === 'true' && descripcion.valido === 'true' && metodologia.valido === 'true' &&
            intervalo.valido === 'true' && unidad.valido === 'true' && edad1.valido === 'true' && edad2.valido === 'true' &&
            sexo.valido === 'true' && muestras.valido === 'true') {

            if (inferior.campo <= superior.campo) {

                if (edad2.campo >= edad1.campo) {
                    axios.post(URL + '/intervalo/insertar',
                        {
                            idItemServicio: idItemServicio.campo,
                            descripcion: descripcion.campo,
                            metodologia: metodologia.campo,
                            intervalo: intervalo.campo,
                            unidad: unidad.campo,
                            inferior: inferior.campo,
                            superior: superior.campo,
                            edad1: edad1.campo,
                            edad2: edad2.campo,
                            sexo: sexo.campo,
                            muestras: muestras.campo,
                            creado: fecha + ' ' + new Date().toLocaleTimeString()
                        }).then(json => {
                            if (json.data.msg != null) {
                                setMensaje(json.data.msg)
                            } else {
                                setDatos(json.data)
                                // setIdItemServicio({ campo: null, valido: null })
                                setDescripcion({ campo: null, valido: null })
                                setMetodologia({ campo: null, valido: null })
                                setIntervalo({ campo: null, valido: null })
                                setUnidad({ campo: null, valido: null })
                                setInferior({ campo: null, valido: null })
                                setSuperior({ campo: null, valido: null })
                                setEdad1({ campo: null, valido: null })
                                setEdad2({ campo: null, valido: null })
                                setSexo({ campo: null, valido: null })
                                setMuestras({ campo: null, valido: null })
                                setIdIntervalo({ campo: null, valido: null })
                                setNombreDependiente({ campo: null, valido: null })
                                setModalInsertatIntervalo(false)
                                setListIntervalo([])
                                toast.success('Opearacion Exitosa')
                            }
                        })
                }
                else { toast.error('Edad minima deberia ser mayor a la edad máxima') }
            } else {
                toast.error('limite superior deberia ser mayo a inferior')
            }
        } else {
            toast.error('Complete todos los campos')
        }
    }

    const actualizarIntervalo = () => {

        let today = new Date()
        let fecha = today.toISOString().split('T')[0]

        console.log(idItemServicio, 'id servicios')

        if (idItemServicio.valido === 'true' && descripcion.valido === 'true' && metodologia.valido === 'true' &&
            intervalo.valido === 'true' && unidad.valido === 'true' && edad1.valido === 'true' && edad2.valido === 'true' &&
            sexo.valido === 'true' && muestras.valido === 'true' && idIntervalo.valido === 'true') {

            // if (inferior.campo <= superior.campo) {

            if (edad2.campo >= edad1.campo) {
                axios.post(URL + '/intervalo/actualizar',
                    {
                        id: idIntervalo.campo,
                        idItemServicio: idItemServicio.campo,
                        descripcion: descripcion.campo,
                        metodologia: metodologia.campo,
                        intervalo: intervalo.campo,
                        unidad: unidad.campo,
                        inferior: inferior.campo,
                        superior: superior.campo,
                        edad1: edad1.campo,
                        edad2: edad2.campo,
                        sexo: sexo.campo,
                        muestras: muestras.campo,
                        modificado: fecha + ' ' + new Date().toLocaleTimeString()
                    }).then(json => {
                        if (json.data.msg != null) {
                            toast.error(json.data.msg)
                        } else {
                            setListIntervalo(json.data)
                            // setIdItemServicio({ campo: null, valido: null })
                            setDescripcion({ campo: null, valido: null })
                            setMetodologia({ campo: null, valido: null })
                            setIntervalo({ campo: null, valido: null })
                            setUnidad({ campo: null, valido: null })
                            setInferior({ campo: 0, valido: 'true' })
                            setSuperior({ campo: 0, valido: 'true' })
                            setEdad1({ campo: null, valido: null })
                            setEdad2({ campo: null, valido: null })
                            setSexo({ campo: null, valido: null })
                            setMuestras({ campo: null, valido: null })
                            setIdIntervalo({ campo: null, valido: null })
                            setNombreDependiente({ campo: null, valido: null })
                            setModalInsertatIntervalo(false)
                            toast.success('Operacion exitosa ')
                        }
                    })
            }
            else {
                toast.error('Edad minima deberia ser mayor a la edad máxima')
            }
        } else {
            toast.error('Complete los campos!!')
        }
    }

    const eliminarIntervalo = () => {
        let ok = window.confirm('liminar registro ?')
        let today = new Date()
        let fecha = today.toISOString().split('T')[0]
        if (listIntervalo[0].id != null && ok) {
            axios.post(URL + '/intervalo/eliminar',
                {
                    id: listIntervalo[0].id,
                    idItemServicio: idItemServicio.campo,
                    modificado: fecha + ' ' + new Date().toLocaleTimeString()
                }).then(json => {
                    if (json.data.msg != null) {
                        toast.error(json.data.msg)

                    } else {
                        setDatos(json.data)
                        setVerIntervalo(true)
                        setModalVerIntervalo(false)
                        toast.success('Operacion exitosa')
                    }
                })
        }
    }


    const habilitar = (id) => {
        let ok = window.confirm("habilitar Servicio ?")
        if (ok) {
            axios.post(URL + '/itemservicio/habilitar', { id: id }).then(json => {
                console.log(json.data)
                setItemServicio(json.data)
                toast.success('Operacion exitosa')
            })
        }
    }

    const desHabilitar = (id) => {
        let ok = window.confirm("Deshabilitar Servicio ?")
        if (ok) {
            axios.post(URL + '/itemservicio/deshabilitar', { id: id }).then(json => {
                console.log(json.data)
                setItemServicio(json.data)
                toast.success('Operacion exitosa')
            })
        }
    }


    return (
        <>
            <div className="hold-transition sidebar-mini">
                <div className="wrapper">
                    <Home />
                    <div className="content-wrapper" >
                        <div className="content">
                            <div className="container-fluid"></div>
                            {parseInt(localStorage.getItem('numRol')) === 3 &&
                                <div className="page-wrapper  mt-2 row colorPagina pb-5">
                                    <div className='col-12 tituloPaginas'>
                                        CATALOGO DE SERVICIOS
                                    </div>

                                    <div className=' row'>
                                        <div className='col-12 col-sm-5 col-md-4 col-lg-4 p-1 ml-1'>
                                            <Button className="btnNuevo mt-2" onClick={abrirModalInsetar} >AÑADIR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></span> </Button>
                                        </div>
                                    </div>
                                    <div className="row">


                                        <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12 p-1">
                                            <div className="card-body table table-responsive custom " style={{ marginBottom: "0px", padding: '0px' }}>

                                                <Table id="example12" className="  table table-sm">
                                                    <thead>
                                                        <tr >
                                                            <th className="col-3 ">Servicio</th>
                                                            <th className="col-3 ">Items</th>
                                                            <th className="col-1 ">Estado</th>
                                                            <th className="col-3">Referencia</th>
                                                            <th className="col-2 text-center">Acciones</th>

                                                            <th className="col-1">Complementos</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className='colorTabla'>
                                                        {itemServicio.map((i) => (
                                                            <tr className='item' key={i.item} >
                                                                <td className="col-3">{i.servicio}</td>
                                                                <td className="col-3 ">{i.item}</td>
                                                                {i.ok === 1 && <td className="col-1 text-center"><p className='botonDesValidar text-center' onClick={() => desHabilitar(i.id)}><FontAwesomeIcon icon={faEye} /></p></td>
                                                                }
                                                                {i.ok === 0 && <td className="col-1 text-center"><p className='botonValidar text-center' onClick={() => habilitar(i.id)}><FontAwesomeIcon icon={faEyeSlash} /></p></td>}
                                                                <td className="col-3 " >
                                                                    <p className='botonIntervalo text-center' onClick={() => { listaIntervalosPrin(i); setVerIntervalo(true); setVerDependientes(false) }}>
                                                                        {/* <FontAwesomeIcon icon={faInfo} /> */}
                                                                        <strong> Intervalo</strong>
                                                                    </p>
                                                                </td>

                                                                <td className="col-1 largTable"><FontAwesomeIcon icon={faTrashAlt} onClick={() => eliminar(i.codigo)} className='botonEliminar' /><FontAwesomeIcon icon={faEdit} onClick={() => abrirModalEditar(i)} className='botonEditar' /></td>
                                                                <td className="col-2 largTable"><FontAwesomeIcon icon={faAngleRight} onClick={() => { listarDependientes(i); setVerDependientes(true); setVerIntervalo(false) }} className='botonVerIntervalo' /></td>

                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                    <tfoot >

                                                    </tfoot>
                                                </Table>
                                            </div>
                                        </div>
                                        <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12'>
                                            {verDependientes && datos.length > 0 &&
                                                <>

                                                    <div className="card-header">
                                                        <small className="card-title " style={{ fontSize: '15px' }}>{'DEPENDENCIAS ' + nombre.campo}</small>
                                                    </div>
                                                    <div className=' table table-responsive custom ' style={{ marginBottom: "0px", height: '320px', padding: '0px' }}>
                                                        <Table id="example12" className=" table table-sm">
                                                            <thead>
                                                                <tr >
                                                                    {/* <th className="col-1 col-sm-1 col-md-1-col-lg-1  pl-4 pl-lg-4 pl-md-4 pl-sm-4">Nº</th> */}
                                                                    <th className="col-5 ">Complementos</th>
                                                                    <th className="col-3 ">Ref</th>

                                                                    <th className="col-1 text-center">Acciones</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className='colorTabla'>
                                                                {datos.map((d) => (
                                                                    <tr key={d.id}>

                                                                        <td className="col-5 ">{d.y}</td>
                                                                        {/* <td className="col-1 " ><p className='btnverSolicitud text-center' onClick={() => { listaIntervalos(d); setVerIntervalo(true); setVerDependientes(false) }}><FontAwesomeIcon icon={faInfo} /></p></td> */}


                                                                        <td className="col-3 " >
                                                                            <p className='botonIntervalo text-center' onClick={() => { listaIntervalos(d); setVerIntervalo(true); setVerDependientes(false) }}>
                                                                                <strong> Intervalo</strong>
                                                                            </p>
                                                                        </td>



                                                                        <td className="col-1 largTable">
                                                                            <FontAwesomeIcon icon={faTrashAlt} onClick={() => eliminarDependiente(d)} className='botonEliminar' />
                                                                            <FontAwesomeIcon icon={faEdit} onClick={() => {
                                                                                setModalEditarDependientes(true); setId({ campo: d.id, valido: 'true' });
                                                                                setNombreDependiente({ campo: d.y, valido: 'true' }); setCodigo(d.codigo)
                                                                            }} className='botonEditar' />
                                                                        </td>

                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </Table>

                                                    </div>
                                                    <div className=' row'>
                                                        <div className='col-12  p-1 ml-1 '>
                                                            <Button className="btnNuevo mt-2" onClick={() => setModalInsertarDependientes(true)} >AÑADIR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></span> </Button>
                                                        </div>
                                                    </div>

                                                </>
                                            }
                                            {verIntervalo && datos.length > 0 &&
                                                <>
                                                    <div className="card-header">
                                                        <small className="card-title " style={{ fontSize: '15px' }}>{'INTERVALO DE REFERENCIA ' + nombre.campo}</small>
                                                    </div>
                                                    <div className='card-body  table table-responsive custom ' style={{ marginBottom: "0px", padding: '0px', height: '320px' }}>
                                                        <Table id="example12" className="table table-sm">
                                                            <thead>
                                                                <tr >
                                                                    <th className="col-5 ">Intervalo</th>
                                                                    <th className="col-1 text-center">Ver</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className='colorTabla'>
                                                                {datos.map((d) => (
                                                                    <tr key={d.id}>

                                                                        <td className="col-5 ">{d.descripcion}</td>

                                                                        <td className="col-2 largTable"><FontAwesomeIcon icon={faAngleRight} onClick={() => mostrarIntervalo(d.id)} className='botonVerIntervalo' /></td>

                                                                        {/* <td className=" col-1">
                                                                            
                                                                            <p className='btnverSolicitud text-center' ><FontAwesomeIcon icon={faAngleRight} /></p>
                                                                        </td> */}
                                                                    </tr>
                                                                ))}
                                                            </tbody>

                                                            <tfoot >

                                                            </tfoot>
                                                        </Table>

                                                    </div>
                                                    <div className=' row'>
                                                        <div className='col-6 '>
                                                            <Button className="btnNuevo mt-2" onClick={() => setModalInsertatIntervalo(true)} >AÑADIR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></span> </Button>
                                                        </div>
                                                    </div>
                                                </>

                                            }
                                            {
                                                modalVerIntervalo &&
                                                <div className='row' style={{ background: '#e8e0d3', height: '420px' }}>

                                                    <div className='col-11 '>
                                                        <div style={{ height: '370px' }}>
                                                            <p className='subPaciente' style={{ margin: '5px', marginLeft: '1px', textAlign: 'left' }}><span>Intervalo de referencia</span> </p>
                                                            <p className='paciente' style={{ marginTop: "5px", textAlign: 'left' }}><span>{nombre.campo}</span></p>
                                                            <div className='row verSolicitud'>
                                                                <div className='col-5 fontTitulo'>
                                                                    <label> descripcion: </label>
                                                                </div>
                                                                <div className='col-7 fontContenido'>
                                                                    <label>{listIntervalo[0].descripcion} </label>
                                                                </div>
                                                            </div>

                                                            <div className='row verSolicitud'>
                                                                <div className='col-5 fontTitulo'>
                                                                    <label> Metodologia:  </label>
                                                                </div>
                                                                <div className='col-7 fontContenido'>
                                                                    <label>{listIntervalo[0].metodologia}</label>
                                                                </div>
                                                            </div>

                                                            <div className='row verSolicitud'>
                                                                <div className='col-5 fontTitulo'>
                                                                    <label> Intervalo: </label>
                                                                </div>
                                                                <div className='col-7 fontContenido'>
                                                                    <label> {listIntervalo[0].intervalo} </label>
                                                                </div>
                                                            </div>
                                                            <div className='row verSolicitud'>
                                                                <div className='col-5 fontTitulo'>
                                                                    <label>Unidad: </label>
                                                                </div>
                                                                <div className='col-7 fontContenido'>
                                                                    <label>  {listIntervalo[0].unidad}</label>
                                                                </div>
                                                            </div>
                                                            <div className='row verSolicitud'>
                                                                <div className='col-5 fontTitulo'>
                                                                    <label>intervalo de edad: </label>
                                                                </div>
                                                                <div className='col-7 fontContenido'>
                                                                    <label>  {listIntervalo[0].edad1 + ' - ' + listIntervalo[0].edad2 + '  años'}</label>
                                                                </div>
                                                            </div>
                                                            <div className='row verSolicitud'>
                                                                <div className='col-5 fontTitulo'>
                                                                    <label>Sexo : </label>
                                                                </div>
                                                                <div className='col-7 fontContenido'>
                                                                    <label>  {listIntervalo[0].sexo}</label>
                                                                </div>
                                                            </div>


                                                            <div className='row verSolicitud'>
                                                                <div className='col-5 fontTitulo'>
                                                                    <label>muestras: </label>
                                                                </div>
                                                                <div className='col-7 fontContenido'>
                                                                    <label>  {listIntervalo[0].muestras}</label>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className='row p-2' >
                                                            <div className='col-auto '>
                                                                <Button className=' cancelarVentanaSolicitud ' style={{fontSize:'12px'}} onClick={() => setModalVerIntervalo()}>CERRAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                                            </div>
                                                            <div className='col-auto '>
                                                                <Button className=' Historial ' style={{fontSize:'12px'}} onClick={() => rellenarIntervalo()}>EDITAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></span> </Button>
                                                            </div>
                                                            <div className='col-auto '>
                                                                <Button className=' eliminarVentanaSolicitud ' style={{fontSize:'12px'}} onClick={() => eliminarIntervalo()}>ELIMINAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon></span> </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-1' style={{ background: '#062b48',height: '420px' }}>


                                                    </div>

                                                </div>
                                            }
                                            {
                                                datos.length === 0 && verIntervalo === true &&
                                                <div className='row ' style={{ margin: '30px' }}>

                                                    <div className='col-12'>
                                                        <label>{nombre.campo}</label>
                                                        <p style={{ color: "#dc3545" }} >No se han registados intervalos de referencia para este servicio</p>
                                                        <Button className='info' onClick={() => setModalInsertatIntervalo(true)}>agregar</Button>

                                                    </div>

                                                </div>
                                            }
                                            {
                                                datos.length === 0 && verDependientes &&
                                                <div className='row ' style={{ margin: '30px' }}>

                                                    <div className='col-12'>
                                                        <label>{nombre.campo}</label>
                                                        <p style={{ color: "#dc3545" }} >No se han registados dependendias para este servicio</p>
                                                        <Button className='info' onClick={() => setModalInsertarDependientes(true)}>agregar</Button>

                                                    </div>

                                                </div>
                                            }
                                            {
                                                verDependientes === false && verIntervalo === false && datos.length === 0 &&
                                                <div >
                                                    <div className="post">
                                                        <div className="user-block">
                                                            <span className="username">
                                                                <Link to="#">Intervalos de referencia</Link>
                                                            </span>
                                                            <span className="description">Laboratorio Hospital San Pedro Claver Lajastambo {new Date().toISOString().split('T')[0]}</span>
                                                        </div>
                                                        <p>
                                                            Para ver, agregar, modificar o eliminar los mismos haga click en el ícono que corresponde al ítem
                                                        </p>
                                                    </div>
                                                    <div className="post clearfix">
                                                        <div className="user-block">
                                                            <span className="username">
                                                                <Link href="#">Complementos</Link>
                                                            </span>
                                                            <span className="description">Laboratorio Hospital San Pedro Claver Lajastambo {new Date().toISOString().split('T')[0]}</span>
                                                        </div>
                                                        <p>
                                                            La lista del catálogo de servicios que se muestra en la lista contiene una sublista que completa la respectiva tarea.
                                                            Para ver, agregar, modificar o eliminar los mismos haga click en la flecha que corresponde al ítem
                                                        </p>
                                                    </div>
                                                </div>

                                            }

                                        </div>
                                    </div>

                                    <Modal isOpen={modalInsertarDependientes}>
                                        <div className='titloFormulario' >
                                            {'DEPEDIENTE DE ' + nombre.campo}
                                        </div>
                                        <ModalBody>
                                            <div className="form-group col-9 mb-2 mt-1 pl-1">
                                                <ComponenteInputUser
                                                    estado={nombreDependiente}
                                                    cambiarEstado={setNombreDependiente}
                                                    name="servicio"
                                                    placeholder="DEPENDIENTE"
                                                    ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                    etiqueta='DEPENDIENTE'
                                                />
                                            </div>
                                        </ModalBody>
                                        <div className="row p-2" >
                                            <div className="col-auto">
                                                <Button className='  cancelarVentanaSolicitud' onClick={() => setModalInsertarDependientes(false)} >CERRAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                            </div>
                                            <div className='col-auto'>
                                                <Button className=' Historial ' onClick={() => añadirDependientes()}>GUARDAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faSave}></FontAwesomeIcon></span> </Button>
                                            </div>
                                        </div>
                                    </Modal>
                                    <Modal isOpen={modalEditarDependientes}>
                                        <div className='titloFormulario' >
                                            {'DEPEDIENTE DE ' + nombre.campo}
                                        </div>
                                        <ModalBody>
                                            <div className="form-group col-9 mb-2 mt-1 pl-1">
                                                <ComponenteInputUser
                                                    estado={nombreDependiente}
                                                    cambiarEstado={setNombreDependiente}
                                                    name="dependiente"
                                                    placeholder="DEPENDIEENTE"
                                                    ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                    etiqueta='DEPENDIETE'
                                                />
                                            </div>
                                        </ModalBody>
                                        <div className="row p-2" >
                                            <div className="col-auto">
                                                <Button className='  cancelarVentanaSolicitud' onClick={() => setModalEditarDependientes(false)} >CANCELAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                            </div>
                                            <div className='col-auto'>
                                                <Button className=' Historial ' onClick={() => actualizarDependientes()}>ACTUALIZAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></span> </Button>
                                            </div>
                                        </div>
                                    </Modal>

                                    <Modal isOpen={modalInsertarIntervalo}>
                                        <div className='titloFormulario' style={{ height: '30px' }}>

                                        </div>
                                        {idIntervalo.valido === 'true' ?
                                            <p className='subPaciente' style={{ textAlign: 'left', paddingLeft: '10px', marginBottom: '0px', marginTop: '15px' }}>{'ACTUALIZAR INTERVALO'}</p> :
                                            <p className='subPaciente' style={{ textAlign: 'left', paddingLeft: '10px', marginBottom: '0px', paddingTop: '15px' }}>{'AÑADIR INTERVALO '}</p>}
                                        <p className='diagnostico' style={{ paddingLeft: '10px', marginBottom: '0px' }}><strong> {nombre.campo}</strong></p>

                                        <ModalBody>
                                            <div className="row">
                                                <div className="col-12">
                                                    <ComponenteInputUser
                                                        estado={descripcion}
                                                        cambiarEstado={setDescripcion}
                                                        name="descripcion"
                                                        placeholder="DESCRIPCION"
                                                        ExpresionRegular={INPUT.TEXT}  //expresion regular
                                                        etiqueta='Descripcion'
                                                    />
                                                </div>
                                                <div className="col-12">
                                                    <ComponenteInputUser
                                                        estado={metodologia}
                                                        cambiarEstado={setMetodologia}
                                                        name="metodologia"
                                                        placeholder="METODOLOGIA"
                                                        ExpresionRegular={INPUT.TEXT}  //expresion regular
                                                        etiqueta='Metodologia'
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <ComponenteInputUser
                                                        estado={intervalo}
                                                        cambiarEstado={setIntervalo}
                                                        name="intervalo"
                                                        placeholder="INTERVALO"
                                                        ExpresionRegular={INPUT.TEXT}  //expresion regular
                                                        etiqueta='Intervalo'
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <ComponenteInputUser
                                                        estado={unidad}
                                                        cambiarEstado={setUnidad}
                                                        name="unidad"
                                                        placeholder="Unidad"
                                                        ExpresionRegular={INPUT.TEXT}  //expresion regular
                                                        etiqueta='Unidad '
                                                    />
                                                </div>

                                                <div className="col-6">
                                                    <ComponenteInputUser
                                                        estado={edad1}
                                                        cambiarEstado={setEdad1}
                                                        name="edad2"
                                                        tipo='number'
                                                        placeholder="EDAD 1"
                                                        ExpresionRegular={INPUT.EDAD}  //expresion regular
                                                        etiqueta='desde'
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <ComponenteInputUser
                                                        estado={edad2}
                                                        cambiarEstado={setEdad2}
                                                        name="edad2"
                                                        tipo='number'
                                                        placeholder="EDAD 2"
                                                        ExpresionRegular={INPUT.EDAD}  //expresion regular
                                                        etiqueta='hasta'
                                                    />
                                                </div>
                                                <div className=" col-12">
                                                    <Select1
                                                        estado={sexo}
                                                        cambiarEstado={setSexo}
                                                        name="nombre"
                                                        ExpresionRegular={INPUT.SEXO3}  //expresion regular
                                                        lista={sexos}
                                                        etiqueta='Sexo'
                                                    />
                                                </div>
                                                <div className="col-12">
                                                    <ComponenteInputUser
                                                        estado={muestras}
                                                        cambiarEstado={setMuestras}
                                                        name="muestras"
                                                        placeholder="muestrar/s"
                                                        ExpresionRegular={INPUT.TEXT}  //expresion regular
                                                        etiqueta='Muestra/s'
                                                    />
                                                </div>

                                            </div>
                                        </ModalBody>
                                        <div className="row p-2" >
                                            <div className="col-auto">
                                                <Button className='  cancelarVentanaSolicitud' onClick={() => { cancelarInsertarIntervalo(); setVerIntervalo(false) }} >CANCELAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                            </div>
                                            <div className='col-auto'>
                                                {idIntervalo.valido === 'true' ? <Button className=' Historial ' onClick={() => actualizarIntervalo()}>ACTUALIZAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></span> </Button> :
                                                    <Button className=' Historial ' onClick={() => añadirIntervalo()}>AÑADIR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></span> </Button>
                                                }
                                            </div>
                                        </div>
                                    </Modal>

                                </div>
                            }

                            {parseInt(localStorage.getItem('numRol')) > 3 &&
                                <div className="page-wrapper m-auto col-8 colorPagina p-2 mt-2" >
                                    <div className='col-12 tituloPaginas'>
                                        CATALOGO DE SERVICIOS
                                    </div>
                                    <div className='col-lg-4 col-md-4 col-sm-4 col-6 row pt-2 pb-2'>
                                        <Button className="btnNuevo mt-2" onClick={abrirModalInsetar} >Añadir <span className='btnNuevoIcono'><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></span> </Button>
                                    </div>

                                    <div className="card-body table table-responsive custom  " style={{ marginBottom: "0px", padding: '0px' }}>

                                        <Table id="example12" className="  table table-sm">
                                            <thead>
                                                <tr >
                                                    {/* <th className="col-1 col-sm-1 col-md-1-col-lg-1  pl-4 pl-lg-4 pl-md-4 pl-sm-4">Nº</th> */}
                                                    <th className="col-3 ">Servicio</th>
                                                    <th className="col-4 ">Items</th>
                                                    <th className="col-1 text-center">Estado</th>
                                                    <th className="col-1 text-center">Acciones</th>

                                                </tr>
                                            </thead>
                                            <tbody className='colorTabla'>
                                                {itemServicio.map((i) => (
                                                    <tr key={i.item} className='item'>
                                                        <td className="col-3">{i.servicio}</td>
                                                        <td className="col-4 ">{i.item}</td>
                                                        {i.ok === 1 && <td className="col-1 text-center"><p className='botonDesValidar text-center' onClick={() => desHabilitar(i.id)}><FontAwesomeIcon icon={faEye} /></p></td>
                                                        }
                                                        {i.ok === 0 && <td className="col-1 text-center"><p className='botonValidar text-center' onClick={() => habilitar(i.id)}><FontAwesomeIcon icon={faEyeSlash} /></p></td>}
                                                        <td className="col-1 largTable" >
                                                            <FontAwesomeIcon icon={faTrashAlt} onClick={() => eliminar(i.codigo)} className='botonEliminar' />
                                                            <FontAwesomeIcon icon={faEdit} onClick={() => abrirModalEditar(i)} className='botonEditar' />
                                                        </td>
                                                        {/* <td className="col-1 "><p className='btnverSolicitud text-center' onClick={() => abrirModalEditar(i)}><FontAwesomeIcon icon={faEdit} onClick={() => abrirModalEditar(i)} /></p></td> */}
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot >

                                            </tfoot>
                                        </Table>
                                    </div>
                                </div>

                            }
                            <Modal isOpen={modalInsertarItem}>
                                <div className='titloFormulario' >
                                    REGISTRAR SERVICIO
                                </div>
                                <ModalBody>
                                    <form>
                                        <div className="row">
                                            <div className="form-group col-9 mb-2 mt-1 pl-1">
                                                <ComponenteInputUser
                                                    estado={nombre}
                                                    cambiarEstado={setNombre}
                                                    name="servicio"
                                                    placeholder="ITEMS SERVICIO"
                                                    ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                    etiqueta='SERVICIO A REGISTRAR'
                                                />
                                            </div>
                                        </div>
                                    </form>

                                </ModalBody>
                                <div className="row p-2" >
                                    <div className="col-auto">
                                        <Button className='  cancelarVentanaSolicitud' onClick={() => setModalInsertarItem(false)} >CERRAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                    </div>
                                    <div className='col-auto'>
                                        <Button className=' Historial ' onClick={() => insertar()}>GUARDAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faSave}></FontAwesomeIcon></span> </Button>
                                    </div>
                                </div>
                            </Modal>

                            <Modal isOpen={modalEditarItem}>
                                <div className='titloFormulario' >
                                    ACTUALIZAR SERVICIO
                                </div>
                                <ModalBody>
                                    <div className="form-group col-9 mb-2 mt-1 pl-1">
                                        <ComponenteInputUser
                                            estado={nombre}
                                            cambiarEstado={setNombre}
                                            name="item"
                                            placeholder="dependiente"
                                            ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                            etiqueta='SERVICIO'
                                        />
                                    </div>
                                </ModalBody>
                                <div className="row p-2" >
                                    <div className="col-auto">
                                        <Button className='  cancelarVentanaSolicitud' onClick={() => setModalEditarItem(false)} >CERRAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                    </div>
                                    <div className='col-auto'>
                                        <Button className=' Historial ' onClick={() => actualizar()}>ACTUALIZAR<span className='btnNuevoIcono'><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></span> </Button>
                                    </div>
                                </div>
                            </Modal>
                        </div>
                    </div>
                </div>
                <Toaster position='top-right' />

            </div>
        </>
    );

}
export default ItemServicio;
