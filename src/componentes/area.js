import React from 'react';


import { Table, Button, Modal, ModalBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faEdit, faPlus, faSave, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../Auth/useAuth"
import { ComponenteInputUser, Select1 } from './elementos/input';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados
import { useState, useEffect } from "react";
import { URL, INPUT } from '../Auth/config';
import axios from 'axios';
import Home from './elementos/home'
import { Toaster, toast } from 'react-hot-toast'



function Area() {
    const auth = useAuth()

    const [area, setArea] = useState([]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [seleccion] = useState([{ id: 1, nombre: 'SI' }, { id: 0, nombre: 'NO' }])

    const [id, setId] = useState({ campo: null, valido: null })
    const [nombre, setNombre] = useState({ campo: '', valido: null })
    const [laboratorio, setLaboratorio] = useState({ campo: false, valido: true })

    try {


        useEffect(() => {
            document.title = 'area'
            listarArea()
        }, [])



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

        const listarArea = async () => {
            axios.post(URL + '/area/all').then(json => {
                setArea(json.data)
            })

        }


        const vaciarDatos = () => {
            setId({ campo: '', valido: null })
            setNombre({ campo: '', valido: null })
            setLaboratorio({ campo: null, valido: 'true' })

        }

        const abrirModalInsetar = () => {
            vaciarDatos()
            setModalInsertar(true);
        }

        const abrirModalEditar = (a) => {
            setId({ campo: a.id, valido: 'true' })
            setNombre({ campo: a.nombre, valido: 'true' })
            setLaboratorio({ campo: a.laboratorio, valido: 'true' })
            setModalEditar(true)
        }

        const insertar = async () => {


            if (nombre.valido === 'true' && laboratorio.valido === 'true') {
                let today = new Date()
                let fecha = today.toISOString().split('T')[0]
                let hora = new Date().toLocaleTimeString().split(':')[0]
                let min = new Date().toLocaleTimeString().split(':')[1]
                let sec = new Date().toLocaleTimeString().split(':')[2]
                if (hora < 10) hora = '0' + hora
                let horafinal = hora + ':' + min + ':' + sec
                axios.post(URL + '/area/insertar', {
                    nombre: nombre.campo,
                    laboratorio: laboratorio.campo,
                    creado: fecha + ' ' + horafinal
                }).then(json => {
                    if (json.data.ok) {
                        vaciarDatos()
                        setModalInsertar(false)
                        listarArea()
                        toast.success('Operacion Exitosa')
                    }
                    else
                        toast.error(json.data.msg)
                })
            } else {
                toast.error('Complete los campos')
            }
        }


        const actualizar = async (e) => {
            if (id.valido === 'true' && nombre.valido === 'true' && laboratorio.valido === 'true') {
                let today = new Date()
                let fecha = today.toISOString().split('T')[0]
                let hora = new Date().toLocaleTimeString().split(':')[0]
                let min = new Date().toLocaleTimeString().split(':')[1]
                let sec = new Date().toLocaleTimeString().split(':')[2]
                if (hora < 10) hora = '0' + hora
                let horafinal = hora + ':' + min + ':' + sec

                axios.post(URL + '/area/actualizar', {
                    id: id.campo,
                    nombre: nombre.campo,
                    laboratorio: laboratorio.campo,
                    modificado: fecha + ' ' + horafinal
                }).then(json => {
                    if (json.data.ok) {
                        vaciarDatos()
                        setModalEditar(false)
                        listarArea()
                        toast.success('Operacion Exitosa')
                    }
                    else
                        toast.error(json.data.msg)
                })
            } else {
                toast.error('Complete los campos')
            }

        }

        const eliminar = async (a) => {
            const ok = window.confirm('¿está seguro de eliminar este registro?');
            if (ok) {
                if (a != null) {
                    await axios.post(URL + '/area/eliminar', { id: a }).then(json => {
                        if (json.data.ok) {
                            vaciarDatos()
                            listarArea()
                            toast.success('Operacion Exitosa')
                        }
                        else
                            toast.error(json.data.msg)
                    })

                }
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

                                    <div className="page-wrapper" style={{ marginTop: '10px' }}>
                                        <div className='col-6 m-auto' style={{ margin: 'auto', marginTop: '10px' }}>
                                            <div className="card">
                                                <div className='col-12 tituloPaginas'>
                                                    AREA
                                                </div>

                                                <div className=' row'>
                                                    <div className='col-12 col-sm-5 col-md-5 col-lg-5 p-1 ml-1'>
                                                        <Button className="btnNuevo mt-2" onClick={abrirModalInsetar} >AÑADIR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></span> </Button>
                                                    </div>
                                                </div>

                                                <div className="table table-responsive custom mt-1 mb-2" style={{ height: '400px' }}>

                                                    <Table id='example12' className="table table-sm" >
                                                        <thead>
                                                            <tr className='col-12' >
                                                                <th className="col-1 ">#</th>
                                                                <th className="col-5 ">Area</th>
                                                                <th className="col-1  text-center">Acciones</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody >
                                                            {area.map((a) => (
                                                                <tr key={a.nombre} >
                                                                    <td className="col-1">{a.id}</td>
                                                                    <td className="col-5">{a.nombre}</td>
                                                                    <td className="col-1 largTable">
                                                                        <FontAwesomeIcon icon={faTrashAlt} onClick={() => eliminar(a.id)} className='botonEliminar' />
                                                                        <FontAwesomeIcon icon={faEdit} onClick={() => abrirModalEditar(a)} className='botonEditar' />
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>

                                                    </Table>
                                                </div>
                                            </div>

                                            <Modal isOpen={modalInsertar}>
                                                <div className='titloFormulario' >
                                                    REGISTRAR AREA
                                                </div>
                                                <ModalBody>
                                                    <div className="row">

                                                        <div className="form-group col-9 mb-2 mt-1 pl-1">
                                                            <ComponenteInputUser
                                                                estado={nombre}
                                                                cambiarEstado={setNombre}
                                                                name="nombre"
                                                                placeholder="AREA DE SERVICIO"
                                                                ExpresionRegular={INPUT.SEGURO}  //expresion regular
                                                                etiqueta='Nombre'
                                                            />
                                                        </div>
                                                        <div className="form-group col-3 mb-2 mt-1 pl-2">
                                                            <Select1
                                                                estado={laboratorio}
                                                                cambiarEstado={setLaboratorio}
                                                                name="laboratorio"
                                                                ExpresionRegular={INPUT.EDAD}  //expresion regular
                                                                lista={seleccion}
                                                                etiqueta={'LABORATORIO'}
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
                                                    ACTUALIZAR AREA
                                                </div>
                                                <ModalBody>
                                                    <div className="row">

                                                        <div className="form-group col-9 mb-2 mt-1 pl-1">
                                                            <ComponenteInputUser
                                                                estado={nombre}
                                                                cambiarEstado={setNombre}
                                                                name="nombre"
                                                                placeholder="AREA DE SERVICIO"
                                                                ExpresionRegular={INPUT.SEGURO}  //expresion regular
                                                                etiqueta='Nombre'
                                                            />
                                                        </div>
                                                        <div className="form-group col-3 mb-2 mt-1 pl-2">
                                                            <Select1
                                                                estado={laboratorio}
                                                                cambiarEstado={setLaboratorio}
                                                                name="laboratorio"
                                                                ExpresionRegular={INPUT.EDAD}  //expresion regular
                                                                lista={seleccion}
                                                                etiqueta={'LABORATORIO'}
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
export default Area;
