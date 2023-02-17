
import React from 'react';

import { Table, Modal, ModalBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faTrashAlt, faTimes, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../Auth/useAuth"
import { Select1, ComponenteInputBuscar, ComponenteInputUser } from './elementos/input';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados
import { LeyendaError } from './elementos/estilos';
import Home from './elementos/home'
import { useState, useEffect } from "react";
import { URL, INPUT } from '../Auth/config';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast'


function Usuario() {

    const [usuario, setUsuario] = useState([]);
    const [modalEditar, setModalEditar] = useState(false);
    const [servicios, setServicios] = useState([])
    const [user, setUser] = useState([])
    const [rol, setRol] = useState([])

    const [id, setId] = useState({ campo: null, valido: null })
    const [idServicio, setIdServicio] = useState({ campo: null, valido: null })
    const [idRol, setIdRol] = useState({ campo: null, valido: null })
    const [correo, setCorreo] = useState({ campo: null, valido: null })


    const [inputBuscar, setInputBuscar] = useState({ campo: '', valido: null })
    const [modalValidar, setModalValidar] = useState(false)

    const auth = useAuth()


    try {

        useEffect(() => {
            listarUsuarios()
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

        const listarUsuarios = async () => {
            try {
                axios.post(URL + '/usuario/all').then(json => {
                    setUsuario(json.data)
                })
            } catch (error) {
                return error
            }
        }

        const listarServicios = async () => {

            axios.post(URL + '/servicio/listaRegistroUsuario').then(json => {
                setServicios(json.data)
            })

        }
        const listarRol = async () => {

            axios.post(URL + '/usuario/rol').then(json => {
                setRol(json.data)
            })

        }

        const vaciarDatos = () => {
            setId({ campo: '', valido: null })
            setIdServicio({ campo: '', valido: null })
            setIdRol({ campo: '', valido: null })
        }


        const rellenar = async (usuario) => {
            setId({ campo: usuario.id, valido: 'true' })
            setIdServicio({ campo: usuario.idServicio, valido: 'true' })
            setIdRol({ campo: usuario.idRol, valido: usuario.rol ? 'true' : null })
            setCorreo({ campo: usuario.correo, valido: 'true' })
            listarServicios()
            listarRol()
            setModalEditar(true)
        }


        const actualizar = async () => {
            if (id.valido === 'true' && idServicio.valido === 'true' && idRol.valido === 'true' && correo.valido === 'true') {
                // console.log('pasa validaciones')

                let today = new Date()
                let fecha = today.toISOString().split('T')[0]
                try {
                    axios.post(URL + '/usuario/actualizar', {
                        id: id.campo,
                        idServicios: idServicio.campo,
                        idRol: idRol.campo,
                        correo: correo.campo,
                        modificado: fecha + ' ' + new Date().toLocaleTimeString()
                    }).then(json => {
                        if (json.data.msg != null) toast.error(json.data.msg)
                        else {
                            setUsuario(json.data)
                            setId({ campo: null, valido: null })
                            setIdServicio({ campo: null, valido: null })
                            setIdRol({ campo: null, valido: null })
                            setCorreo({ campo: null, valido: null })
                            setModalEditar(false)
                            vaciarDatos()
                            toast.success('Operacion exitosa')
                        }
                    })
                } catch (error) {
                }

            } else toast.error('Formulario incompleto')

        }

        const eliminar = async (user) => {
            const ok = window.confirm('¿está seguro de eliminar este registro?');
            if (ok === true) {

                if (user != null) {
                    axios.post(URL + '/usuario/eliminar', { id: user }).then(json => {
                        setUsuario(json.data)
                        toast.success('Operacion exitosa')
                    })
                }
            }
        }

        const validar = async () => {
            console.log(user, 'usuario')
            const ok = window.confirm('Esta seguro de esta operacion ?');

            if (ok === true) {
                let today = new Date()
                let fecha = today.toISOString().split('T')[0]
                if (id.valido === 'true' && idServicio.valido === 'true' && idRol.valido === 'true') {
                    axios.post(URL + '/usuario/validar', {
                        id: id.campo,
                        idServicios: idServicio.campo,
                        idRol: idRol.campo,
                        user: user,
                        modificado: fecha + ' ' + new Date().toLocaleTimeString()
                    }).then(json => {
                        setUsuario(json.data)
                        setModalValidar(false)
                        vaciarDatos()
                        toast.success('Operacion exitosa')
                    })
                }else toast.error('Formulario incompleto')
            }
        }

        const deshabilitar = async (id = null) => {
            const ok = window.confirm('Esta seguro de esta operacion ?');

            if (ok === true) {
                let today = new Date()
                let fecha = today.toISOString().split('T')[0]
                if (id !== null) {
                    axios.post(URL + '/usuario/deshabilitar', {
                        id: id,
                        modificado: fecha + ' ' + new Date().toLocaleTimeString()
                    }).then(json => {
                        setUsuario(json.data)
                        vaciarDatos()
                        toast.success('Operacion exitosa')
                    })
                }
            }
        }

        const buscar = () => {
            if (inputBuscar.valido === 'true') {
                try {
                    axios.post(URL + '/usuario/buscar', { dato: inputBuscar.campo }).then(json => {
                        setUsuario(json.data)
                        setInputBuscar({ campo: null, valido: null })
                    })
                } catch (error) {
                    return error
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
                                        <div className='card pl-1 pr-1'>
                                            <div className="row mt-2 mb-2 ">
                                                <div className=" col-7 ">
                                                    <ComponenteInputBuscar
                                                        estado={inputBuscar}
                                                        cambiarEstado={setInputBuscar}
                                                        name="inputBuscar"
                                                        ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                        placeholder="NOMBRE APELLIDOS | CI "
                                                        eventoBoton={buscar}
                                                        etiqueta={'Buscar'}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className=" table table-responsive  custom" style={{ height: '500px' }}>

                                                    <Table className="table  table-sm p-2">
                                                        <thead>
                                                            <tr >
                                                                <th className="col-1 text-center">CI</th>
                                                                <th className="col-2  ">NOMBRE</th>
                                                                <th className="col-1 ">ROL</th>
                                                                <th className="col-2  ">SERVICIO</th>
                                                                <th className="col-1  text-center">USUARIO</th>
                                                                <th className="col-1  text-center">CEL./TEL.</th>
                                                                <th className="col-2  ">DIRECCION</th>
                                                                <th className="col-2  ">CORREO</th>
                                                                <th className="col-1 text-center"></th>
                                                                <th className="col-1 text-center">Acciones</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {usuario.map((u) => (
                                                                <>
                                                                    {u.validar === 1 ?
                                                                        <tr key={u.id} style={{ background: 'white' }}>
                                                                            <td className="col-1 text-center">{u.ci}</td>
                                                                            <td className="col-2 ">{u.nombre + ' ' + u.apellidoPaterno + ' ' + u.apellidoMaterno}</td>
                                                                            <td className="col-1  ">{u.rol}</td>
                                                                            <td className="col-2  ">{u.servicio}</td>
                                                                            <td className="col-1  text-center">{u.username}</td>
                                                                            <td className="col-1  text-center">{u.telefono}</td>
                                                                            <td className="col-2  ">{u.direccion}</td>
                                                                            <td className="col-2  ">{u.correo}</td>
                                                                            {u.validar === 1 && <td className="col-1 text-center"><p className='botonDesValidar text-center' onClick={() => deshabilitar(u.id)}><FontAwesomeIcon icon={faEye} /></p></td>
                                                                            }

                                                                            <td className="col-1 largTable">

                                                                                {u.validar === 0 && <FontAwesomeIcon icon={faTrashAlt} onClick={() => eliminar(u.id)} className='botonEliminar' />}
                                                                                {u.validar === 1 && <FontAwesomeIcon icon={faTrashAlt} className='botonEliminar' style={{ background: '#7a7a7a' }} />}
                                                                                <FontAwesomeIcon icon={faEdit} onClick={() => rellenar(u)} className='botonEditar' />
                                                                            </td>

                                                                        </tr> :
                                                                        <tr key={u.id} style={{ background: '#A3E4D7' }}>
                                                                            <td className="col-1 text-center">{u.ci}</td>
                                                                            <td className="col-2 ">{u.nombre + ' ' + u.apellidoPaterno + ' ' + u.apellidoMaterno}</td>
                                                                            <td className="col-1  ">{u.rol}</td>
                                                                            <td className="col-2  ">{u.servicio}</td>
                                                                            <td className="col-1  text-center">{u.username}</td>
                                                                            <td className="col-1  text-center">{u.telefono}</td>
                                                                            <td className="col-2  ">{u.direccion}</td>
                                                                            <td className="col-2  ">{u.correo}</td>




                                                                            {u.validar === 0 &&
                                                                                <td className="col-1 text-center"><p className='botonDesValidar text-center'
                                                                                    onClick={() => {
                                                                                        setId({ campo: u.id, valido: 'true' });
                                                                                        setModalValidar(true); listarRol(); listarServicios();
                                                                                        setIdServicio({ campo: u.idServicio, valido: 'true' });
                                                                                        setIdRol({ campo: u.idRol, valido: u.rol ? 'true' : null })
                                                                                        setUser(u)
                                                                                    }}
                                                                                ><FontAwesomeIcon icon={faEyeSlash} /></p></td>
                                                                            }

                                                                            <td className="col-1 largTable">

                                                                                {u.validar === 0 && <FontAwesomeIcon icon={faTrashAlt} onClick={() => eliminar(u.id)} className='botonEliminar' />}
                                                                                {u.validar === 1 && <FontAwesomeIcon icon={faTrashAlt} className='botonEliminar' style={{ background: '#7a7a7a' }} />}
                                                                                <FontAwesomeIcon icon={faEdit} onClick={() => rellenar(u)} className='botonEditar' />
                                                                            </td>



                                                                        </tr>}
                                                                </>
                                                            ))}
                                                        </tbody>
                                                        <tfoot>

                                                        </tfoot>
                                                    </Table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <Modal isOpen={modalEditar}>
                                        <ModalBody>
                                            <form>
                                                <div className="row">
                                                    <div>
                                                        <h6>Modificar Registro</h6>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 mb-2 mt-0 pr-1">
                                                        <Select1
                                                            estado={idServicio}
                                                            cambiarEstado={setIdServicio}
                                                            name="servicio"
                                                            ExpresionRegular={INPUT.ID}
                                                            lista={servicios}
                                                            etiqueta={'Sevicio'}
                                                        >
                                                        </Select1>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 mb-2 mt-0 pr-1">
                                                        <Select1
                                                            estado={idRol}
                                                            cambiarEstado={setIdRol}
                                                            name="rol"
                                                            ExpresionRegular={INPUT.ID}
                                                            lista={rol}
                                                            etiqueta={'Rol'}
                                                        >
                                                        </Select1>
                                                    </div>
                                                    < div className="col-12 col-sm-6 col-md-6 col-lg-6 mb-2 mt-0 pr-1">
                                                        <ComponenteInputUser
                                                            estado={correo}
                                                            cambiarEstado={setCorreo}
                                                            name="correo"
                                                            placeholder="correo"
                                                            ExpresionRegular={INPUT.CORREO}
                                                            etiqueta={'Correo electronico'} s
                                                            campoUsuario={true}
                                                        />
                                                    </div>
                                                </div>
                                            </form>
                                        </ModalBody>
                                        <div className="card-footer clearfix" style={{ paddingTop: '0px' }}>
                                            <ul className="pagination pagination-sm m-0 float-right">
                                                <button className='info' onClick={() => actualizar()} style={{ marginRight: '5px' }}>Actualizar</button>
                                                <button className='danger' onClick={() => { setModalEditar(); vaciarDatos() }} style={{ marginRight: '5px' }}>Cancelar</button>
                                            </ul>
                                        </div>

                                    </Modal>
                                    <Modal isOpen={modalValidar}>
                                        <ModalBody>
                                            <form>
                                                <div className="row">
                                                    <div>
                                                        <h6>Modificar Registro</h6>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 mb-2 mt-0 pr-1">
                                                        <Select1
                                                            estado={idServicio}
                                                            cambiarEstado={setIdServicio}
                                                            name="servicio"
                                                            ExpresionRegular={INPUT.ID}
                                                            lista={servicios}
                                                            etiqueta={'Sevicio'}
                                                        >
                                                        </Select1>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 mb-2 mt-0 pr-1">
                                                        <Select1
                                                            estado={idRol}
                                                            cambiarEstado={setIdRol}
                                                            name="rol"
                                                            ExpresionRegular={INPUT.ID}
                                                            lista={rol}
                                                            etiqueta={'Rol'}
                                                        >
                                                        </Select1>
                                                    </div>
                                                </div>
                                            </form>
                                        </ModalBody>
                                        <div className="card-footer clearfix" style={{ paddingTop: '0px' }}>
                                            <ul className="pagination pagination-sm m-0 float-right">
                                                <button className='info' onClick={() => validar()} style={{ marginRight: '5px' }}>validar</button>
                                                <button className='danger' onClick={() => { setModalValidar(); setId({ campo: null, valido: null }) }} style={{ marginRight: '5px' }}>Cancelar</button>
                                            </ul>
                                        </div>

                                    </Modal>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Toaster position='top-right' />
            </div >
        );
    } catch (error) {
        auth.logout()
    }

}
export default Usuario;
