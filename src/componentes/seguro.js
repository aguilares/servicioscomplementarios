import React from 'react';

import { Table, Button, Modal, ModalBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faEdit, faPlus, faSave, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../Auth/useAuth"
import { ComponenteInputUser } from './elementos/input';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados
import { LeyendaError } from './elementos/estilos';
import { useState, useEffect } from "react";
import { URL, INPUT } from '../Auth/config';
import axios from 'axios';
import Home from './elementos/home'
import { Toaster, toast } from 'react-hot-toast'


function Seguro() {
    const auth = useAuth()

    const [seguro, setSeguro] = useState([]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);

    const [id, setId] = useState({ campo: '', valido: null })
    const [nombre, setNombre] = useState({ campo: '', valido: null })

    let today = new Date()
    let fecha = today.toISOString().split('T')[0]
    let hora = new Date().toLocaleTimeString().split(':')[0]
    let min = new Date().toLocaleTimeString().split(':')[1]
    let sec = new Date().toLocaleTimeString().split(':')[2]
    if (hora < 10) hora = '0' + hora
    let horafinal = hora + ':' + min + ':' + sec
    let fechaHora = fecha + ' ' + horafinal


    try {

        useEffect(() => {
            listaSeguro()
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

        const listaSeguro = async () => {

            axios.post(URL + '/seguro/all').then(json => {
                setSeguro(json.data)
            })

        }


        const vaciarDatos = () => {
            setId({ campo: '', valido: null })
            setNombre({ campo: '', valido: null })

        }

        const abrirModalInsetar = () => {
            vaciarDatos()
            setModalInsertar(true);

        }

        const abrirModalEditar = (s) => {
            setId({ campo: s.id, valido: 'true' })
            setNombre({ campo: s.nombre, valido: 'true' })
            setModalEditar(true)
        }

        const insertar = async () => {

            // console.log("datos seguro : ", nombre, laboratorio)

            if (nombre.valido === 'true') {

                axios.post(URL + '/seguro/insertar', {
                    nombre: nombre.campo,
                    creado: fechaHora
                }).then(json => {
                    if (json.data.ok) {
                        vaciarDatos()
                        setModalInsertar(false)
                        listaSeguro()
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
            if (id.valido === 'true' && nombre.valido === 'true') {
                axios.post(URL + '/seguro/actualizar', {
                    id: id.campo,
                    nombre: nombre.campo,
                    modificado: fechaHora
                }).then(json => {
                    if (json.data.ok) {
                        vaciarDatos()
                        setModalEditar(false)
                        listaSeguro()
                        toast.success('Operacion Exitosa')

                    }
                    else
                        toast.error(json.data.msg)
                })

            } else {
                toast.error('Complete los campos')
            }

        }

        const eliminar = async (ids) => {

            const ok = window.confirm('¿está seguro de eliminar este registro ?');
            if (ok) {
                if (ids != null) {

                    axios.post(URL + '/seguro/eliminar', { id: ids }).then(json => {
                        if (json.data.ok) {
                            vaciarDatos()
                            listaSeguro()
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

                                    <div className=' col-6 ' style={{ margin: 'auto', marginTop: '5px' }}>
                                        <div className="card pl-1 pr-1">
                                            <div className='col-12 tituloPaginas'>
                                                SEGUROS
                                            </div >
                                            <div className='row  p-1' >

                                                <div className='col-12 col-sm-5 col-md-5 col-lg-5' style={{ marginBottom: '3px', marginTop: '0px' }}>
                                                    <Button className="btnNuevo " onClick={abrirModalInsetar} >AÑADIR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></span> </Button>
                                                </div>
                                            </div>
                                            <div className="table table-responsive custom mt-1 mb-2" style={{ height: '400px' }}>

                                                <Table className="table table-sm" >
                                                    <thead>
                                                        <tr className='col-12'>
                                                            <th className="col-1">#</th>
                                                            <th className="col-9">seguro</th>
                                                            <th className="col-1 text-center">Acciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {seguro.map((s) => (
                                                            <tr key={s.id}>
                                                                <td className="col-1">{s.id}</td>
                                                                <td className="col-9">{s.nombre}</td>
                                                                <td className="col-1 largTable">
                                                                    <FontAwesomeIcon icon={faTrashAlt} onClick={() => eliminar(s.id)}className='botonEliminar' />
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
                                                REGISTRAR SEGURO
                                            </div>
                                            <ModalBody>
                                                <div className="form-group col-10">
                                                    <ComponenteInputUser
                                                        estado={nombre}
                                                        cambiarEstado={setNombre}
                                                        name="nombre"
                                                        placeholder="SEGURO"
                                                        ExpresionRegular={INPUT.SEGURO}  //expresion regular
                                                        etiqueta='Nombre'
                                                    />
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
                                                REGISTRAR REGISTRO
                                            </div>
                                            <ModalBody>

                                                <div className="form-group col-12 ">
                                                    <ComponenteInputUser
                                                        estado={nombre}
                                                        cambiarEstado={setNombre}
                                                        name="nombre"
                                                        placeholder="SEGURO"
                                                        ExpresionRegular={INPUT.SEGURO}  //expresion regular
                                                        etiqueta='Nombre'
                                                    />
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
                <Toaster position='top-right' />
            </div>
        );
    } catch (error) {
        auth.logout()
    }


}
export default Seguro;
