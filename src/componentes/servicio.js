import { Table, Button, Modal, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faEdit, faPlus, faSave, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

import useAuth from "../Auth/useAuth"
import { ComponenteInputUser, ComponenteInputBuscar, Select1 } from './elementos/input';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados
import { LeyendaError } from './elementos/estilos';

import { useState, useEffect } from "react";
import { URL, INPUT } from '../Auth/config';
import Home from './elementos/home'
import { Toaster, toast } from 'react-hot-toast'

import axios from 'axios';


function Servicio() {
    const auth = useAuth()


    const [servicio, serServicio] = useState([]);
    const [area, setArea] = useState([]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);

    const [id, setId] = useState({ campo: null, valido: null })
    const [idArea, setIdArea] = useState({ campo: null, valido: null })
    const [nombre, setNombre] = useState({ campo: null, valido: null })
    const [inputBuscar, setInputBuscar] = useState({ campo: null, valido: null })
    try {

        useEffect(() => {
            if (inputBuscar.valido === null) listarServicio()
            if (inputBuscar.valido === 'false') listarServicio()
        }, [inputBuscar])



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

        const listarServicio = async () => {
            axios.post(URL + '/servicio/all').then(json => {
                serServicio(json.data)
            })

        }

        const cargarArea = async () => {

            axios.post(URL + '/area/all').then(json => {
                setArea(json.data)
            })

        }


        const vaciarDatos = () => {
            setId({ campo: null, valido: null })
            setIdArea({ campo: null, valido: null })
            setNombre({ campo: null, valido: null })
        }

        const abrirModalInsetar = () => {
            cargarArea()
            vaciarDatos()
            setModalInsertar(true);
        }

        const abrirModalEditar = (a) => {
            cargarArea()
            setId({ campo: a.id, valido: 'true' })
            setIdArea({ campo: a.idArea, valido: 'true' })
            setNombre({ campo: a.servicio, valido: 'true' })
            setModalEditar(true)
        }

        const insertar = async () => {

            if (idArea.valido === 'true' && nombre.valido === 'true') {
                let today = new Date()
                let fecha = today.toISOString().split('T')[0]
                let hora = new Date().toLocaleTimeString().split(':')[0]
                let min = new Date().toLocaleTimeString().split(':')[1]
                let sec = new Date().toLocaleTimeString().split(':')[2]
                if (hora < 10) hora = '0' + hora
                let horafinal = hora + ':' + min + ':' + sec

                axios.post(URL + '/servicio/insertar', {
                    idArea: idArea.campo,
                    nombre: nombre.campo,
                    creado: fecha + ' ' + horafinal
                }).then(json => {
                    if (json.data.ok) {
                        vaciarDatos()
                        setModalInsertar(false)
                        listarServicio()
                        toast.success('Operacion Exitosa')
                    }
                    else
                        toast.error(json.data.msg)
                })

            } else {
                toast.error('Complete todos los campos')
            }
        }


        const actualizar = async (e) => {
            if (id.valido === 'true' && idArea.valido === 'true' && nombre.valido === 'true') {

                let today = new Date()
                let fecha = today.toISOString().split('T')[0]
                let hora = new Date().toLocaleTimeString().split(':')[0]
                let min = new Date().toLocaleTimeString().split(':')[1]
                let sec = new Date().toLocaleTimeString().split(':')[2]
                if (hora < 10) hora = '0' + hora
                let horafinal = hora + ':' + min + ':' + sec

                axios.post(URL + '/servicio/actualizar', {
                    id: id.campo,
                    idArea: idArea.campo,
                    nombre: nombre.campo,
                    modificado: fecha + ' ' + horafinal
                }).then(json => {
                    if (json.data.ok) {
                        vaciarDatos()
                        setModalEditar(false)
                        listarServicio()
                        toast.success('Operacion Exitosa')

                    }
                    else
                        toast.error(json.data.msg)
                })

            } else {
                toast.error('Complete todos los campos')
            }

        }

        const eliminar = async (ids) => {

            const ok = window.confirm('¿está seguro de eliminar este registro?');
            if (ok) {
                if (ids !== null) {

                    axios.post(URL + '/servicio/eliminar', { id: ids }).then(json => {
                        if (json.data.ok) {
                            vaciarDatos()
                            listarServicio()
                            toast.success('Operacion Exitosa')
                        }
                        else
                            toast.error(json.data.msg)
                    })

                }
            }
        }

        const buscar = () => {
            if (inputBuscar.valido === 'true') {
                console.log('pasa validaciones')

                axios.post(URL + '/servicio/buscar', { dato: inputBuscar.campo }).then(json => {
                    serServicio(json.data)
                })

            }
        }


        return (
            <div>
                <div className="hold-transition sidebar-mini" >
                    <div className="wrapper">
                        <Home />
                        <div className="content-wrapper" >
                            <div className="content">
                                <div className="container-fluid">

                                    <div className="page-wrapper col-7 m-auto" style={{ marginTop: '10px' }}>
                                        <div style={{ margin: 'auto', marginTop: '5px' }}>
                                            <div className='card pl-1 pr-1'>
                                                <div className='col-12 tituloPaginas'>
                                                    SERVICIOS
                                                </div >

                                                <div className='row  p-1' >

                                                    <div className='col-4' style={{ marginBottom: '3px', marginTop: '0px' }}>
                                                        <Button className="btnNuevo " onClick={abrirModalInsetar} >AÑADIR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></span> </Button>
                                                    </div>
                                                    <div className=" col-8" style={{ marginBottom: '0px' }}>
                                                        <ComponenteInputBuscar
                                                            estado={inputBuscar}
                                                            cambiarEstado={setInputBuscar}
                                                            name="inputBuscar"
                                                            ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                            placeholder="SERVICIO"
                                                            eventoBoton={buscar}
                                                            etiqueta={'Buscar'}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="table table-responsive custom">

                                                    <Table className="table  table-sm p-2" >
                                                        <thead>
                                                            <tr >

                                                                <th className="col-4  ">Area</th>
                                                                <th className="col-5 ">servicio</th>
                                                                <th className="col-1 text-center">Acciones</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {servicio.map((s) => (
                                                                <tr key={s.id}>
                                                                    <td className="col-5">{s.area}</td>

                                                                    <td className="col-5 ">{s.servicio}</td>
                                                                    <td className="col-1 largTable">
                                                                        <FontAwesomeIcon icon={faTrashAlt} onClick={() => eliminar(s.id)} className='botonEliminar' />
                                                                        <FontAwesomeIcon icon={faEdit} onClick={() => abrirModalEditar(s)} className='botonEditar' />
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                        <tfoot>

                                                        </tfoot>
                                                    </Table>
                                                </div>
                                            </div>
                                            <Modal isOpen={modalInsertar}>
                                                <div className='titloFormulario' >
                                                    REGISTRAR SERVICIO
                                                </div>
                                                <ModalBody>
                                                    <div className="row">
                                                        <div className="form-group col-9 mb-2 mt-1 pl-1">
                                                            <Select1
                                                                estado={idArea}
                                                                cambiarEstado={setIdArea}
                                                                name="nombre"
                                                                ExpresionRegular={INPUT.ID}  //expresion regular
                                                                lista={area}
                                                                etiqueta='Area'
                                                            />
                                                        </div>
                                                        <div className="form-group col-9 mb-2 mt-1 pl-1">
                                                            <ComponenteInputUser
                                                                estado={nombre}
                                                                cambiarEstado={setNombre}
                                                                name="servicio"
                                                                placeholder="AREA DE SERVICIO"
                                                                ExpresionRegular={INPUT.SEGURO}  //expresion regular
                                                                etiqueta='Servicio'
                                                            />
                                                        </div>
                                                    </div>
                                                </ModalBody>
                                                <div className="row p-2">
                                                    <div className="col-auto">
                                                        <Button className='cancelarVentanaSolicitud' onClick={() => setModalInsertar(false)} >CERRAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                                    </div>
                                                    <div className="col-auto">
                                                        <Button className='Historial' onClick={() => insertar()}>REGISTRAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faSave}></FontAwesomeIcon></span> </Button>
                                                    </div>
                                                </div>
                                            </Modal>

                                            <Modal isOpen={modalEditar}>
                                                <div className='titloFormulario' >
                                                    ACTUALIZAR SERVICIO
                                                </div>
                                                <ModalBody>
                                                    <div className="row">
                                                        <div className="form-group col-9 mb-2 mt-1 pl-1">
                                                            <Select1
                                                                estado={idArea}
                                                                cambiarEstado={setIdArea}
                                                                name="nombre"
                                                                ExpresionRegular={INPUT.ID}  //expresion regular
                                                                lista={area}
                                                                etiqueta='Area'
                                                            />
                                                        </div>
                                                        <div className="form-group col-9 mb-2 mt-1 pl-1">
                                                            <ComponenteInputUser
                                                                estado={nombre}
                                                                cambiarEstado={setNombre}
                                                                name="servicio"
                                                                placeholder="AREA DE SERVICIO"
                                                                ExpresionRegular={INPUT.SEGURO}  //expresion regular
                                                                etiqueta='Servicio'
                                                            />
                                                        </div>
                                                    </div>
                                                </ModalBody>

                                                <div className="row p-2">
                                                    <div className="col-auto">
                                                        <Button className='cancelarVentanaSolicitud' onClick={() => setModalEditar(false)} >CANCELAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                                    </div>
                                                    <div className="col-auto">
                                                        <Button className='Historial' onClick={() => actualizar()}>ACTUALIZAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></span> </Button>
                                                    </div>
                                                </div>
                                            </Modal>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Toaster position='top-right' />
            </div>
        );
    } catch (error) {
        auth.logout()
    }

}
export default Servicio;
