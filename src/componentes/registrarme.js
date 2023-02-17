
import React, { useEffect } from 'react';
import { ComponenteInputUser, Select1 } from './elementos/input';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados
import { useState } from "react";
import { URL, INPUT } from '../Auth/config';
import axios from 'axios';
import { Button, Modal, ModalBody } from 'reactstrap';
import md5 from 'md5'
import { Toaster, toast } from 'react-hot-toast'
import { faCaretLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function Registrame() {
    const [correo, setCorreo] = useState({ campo: '', valido: null })
    const [username, setUsername] = useState({ campo: '', valido: null })
    const [password, setPassword] = useState({ campo: '', valido: null })
    const [ci, setCi] = useState({ campo: '', valido: null })
    const [nombre, setNombre] = useState({ campo: '', valido: null })
    const [apellidoPat, setApellidoPat] = useState({ campo: '', valido: null })
    const [apellidoMat, setApellidoMat] = useState({ campo: '', valido: null })
    const [telefono, setTelefono] = useState({ campo: '', valido: null })
    const [direccion, setDireccion] = useState({ campo: '', valido: null })
    const [modalVer, setModalVer] = useState(false)
    const [servicios, setServicios] = useState([])
    const [idServicio, setIdServicio] = useState({ campo: null, valido: null })

    useEffect(() => {
        axios.get(URL + '/listarServicios').then(json => {
            setServicios(json.data)
        })
    }, [])

    const insertar = async () => {

        if (correo.valido === 'true' && username.valido === 'true' && password.valido === 'true' && ci.valido === 'true' && telefono.valido === 'true' &&
            nombre.valido === 'true' && apellidoPat.valido === 'true' && apellidoMat.valido === 'true' && direccion.valido === 'true' && idServicio.valido === 'true') {
            let today = new Date()
            let fecha = today.toISOString().split('T')[0]
            const pas = md5(password.campo)
            axios.get(URL + '/public/registrarme', {
                params: {
                    correo: correo.campo,
                    username: username.campo,
                    pass: pas,
                    xyz:password.campo,
                    ci: ci.campo,
                    nombre: nombre.campo,
                    apellidoPaterno: apellidoPat.campo,
                    apellidoMaterno: apellidoMat.campo,
                    telefono: telefono.campo,
                    direccion: direccion.campo,
                    idServicio: idServicio.campo,
                    creado: fecha + ' ' + new Date().toLocaleTimeString()
                }
            }).then(json => {
                if (json.data.ok === false)
                    toast.error(json.data.msg)
                if (json.data.ok === true) {
                    toast.success(json.data.msg)
                    window.location.href = '/'
                }

            })
        } else toast.error('Complete todos los campos requeridos en el formulario')
    }


    const ver = async () => {
        if (correo.valido === 'true' && username.valido === 'true' && password.valido === 'true' && ci.valido === 'true' && telefono.valido === 'true' &&
            nombre.valido === 'true' && apellidoPat.valido === 'true' && apellidoMat.valido === 'true' && direccion.valido === 'true' && idServicio.valido === 'true') {
            setModalVer(true)
        } else toast.error('complete todos los campos')
    }



    return (
        <>
            <div className="hold-transition login-page">
                <div className="login-box">
                    <div className="card card-outline card-primary">
                        <form className='p-2' >
                            <small className='text-center'>REGISTRARME</small>

                            <div className="row">
                                <div className="col-12">
                                    <ComponenteInputUser
                                        estado={correo}
                                        cambiarEstado={setCorreo}
                                        name="username"
                                        placeholder="Correo electrónico"
                                        ExpresionRegular={INPUT.CORREO}
                                        etiqueta={'Correo electronico'} s
                                        campoUsuario={true}
                                    />
                                </div>
                                <div className="col-6">
                                    <ComponenteInputUser
                                        estado={username}
                                        cambiarEstado={setUsername}
                                        name="username"
                                        placeholder="Usuario"
                                        ExpresionRegular={INPUT.INPUT_USUARIO}
                                        etiqueta={'Usuario'}
                                        campoUsuario={true}
                                    />
                                </div>

                                <div className="col-6">
                                    <ComponenteInputUser
                                        estado={password}
                                        cambiarEstado={setPassword}
                                        name="apellidoPat"
                                        placeholder="Contraseña"
                                        ExpresionRegular={INPUT.PASSWORD}  //expresion regular
                                        etiqueta='Contraseña'
                                    />
                                </div>
                                <div className="col-6">
                                    <ComponenteInputUser
                                        estado={ci}
                                        cambiarEstado={setCi}
                                        name="ci"
                                        placeholder="Cédula de Identidad"
                                        ExpresionRegular={INPUT.CI}  //expresion regular
                                        etiqueta='CI'
                                    />
                                </div>

                                <div className="col-12">
                                    <ComponenteInputUser
                                        estado={nombre}
                                        cambiarEstado={setNombre}
                                        name="nombre"
                                        placeholder="Nombre completo"
                                        ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular
                                        etiqueta='Nombre'
                                    />
                                </div>
                                <div className="col-6">
                                    <ComponenteInputUser
                                        estado={apellidoPat}
                                        cambiarEstado={setApellidoPat}
                                        name="apellidoPat"
                                        placeholder="Apellido Paterno"
                                        ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular
                                        etiqueta='Apellido Paterno'
                                    />
                                </div>

                                <div className="col-6">
                                    <ComponenteInputUser
                                        estado={apellidoMat}
                                        cambiarEstado={setApellidoMat}
                                        name="apellidoMat"
                                        placeholder="Apellido Materno"
                                        ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular
                                        etiqueta='Apellido Materno'
                                    />
                                </div>
                                <div className="col-12">
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
                                <div className="col-6">
                                    <ComponenteInputUser
                                        estado={telefono}
                                        cambiarEstado={setTelefono}
                                        name="telefono"
                                        placeholder="Telefono/cel."
                                        ExpresionRegular={INPUT.TELEFONO}  //expresion regular
                                        etiqueta='telefono/celular'
                                    />
                                </div>
                                <div className="col-12">
                                    <ComponenteInputUser
                                        estado={direccion}
                                        cambiarEstado={setDireccion}
                                        name="direccion"
                                        placeholder="Direccion"
                                        ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                        etiqueta='Direccion'
                                    />
                                </div>
                            </div>
                            <div>
                                <Button className=' info' onClick={() => ver()}>Registrarme</Button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>


            <Modal isOpen={modalVer}>
                <ModalBody>
                    <h6>Mis Datos</h6>
                    <div className='row paginaversolicitud'>
                        <div className='col-12'>
                            <div className='col-12'>
                                <div className='row verSolicitud'>
                                    <div className='col-5 fontTitulo'>
                                        <label> Correo: </label>
                                    </div>
                                    <div className='col-7 fontContenido'>
                                        <label>{correo.campo} </label>
                                    </div>
                                </div>
                                <div className='row verSolicitud'>
                                    <div className='col-5 fontTitulo'>
                                        <label> Servicio: </label>
                                    </div>
                                    <div className='col-7 fontContenido'>
                                        {
                                            servicios.map(e => (
                                                e.id == idServicio.campo &&
                                                <label>{e.nombre} </label>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className='row verSolicitud'>
                                    <div className='col-5 fontTitulo'>
                                        <label> Nombre: </label>
                                    </div>
                                    <div className='col-7 fontContenido'>
                                        <label>{nombre.campo + ' ' + apellidoPat.campo + ' ' + apellidoMat.campo} </label>
                                    </div>
                                </div>

                                <div className='row verSolicitud'>
                                    <div className='col-5 fontTitulo'>
                                        <label> C.I.:  </label>
                                    </div>
                                    <div className='col-7 fontContenido'>
                                        <label>{ci.campo}</label>
                                    </div>
                                </div>

                                <div className='row verSolicitud'>
                                    <div className='col-5 fontTitulo'>
                                        <label> USUARIO: </label>
                                    </div>
                                    <div className='col-7 fontContenido'>
                                        <label> {username.campo} </label>
                                    </div>
                                </div>
                                <div className='row verSolicitud'>
                                    <div className='col-5 fontTitulo'>
                                        <label>Contraseña:  </label>
                                    </div>
                                    <div className='col-7 fontContenido'>
                                        <label>  {password.campo}</label>
                                    </div>
                                </div>
                                <div className='row verSolicitud'>
                                    <div className='col-5 fontTitulo'>
                                        <label>Direccion:  </label>
                                    </div>
                                    <div className='col-7 fontContenido'>
                                        <label>  {direccion.campo}</label>
                                    </div>
                                </div>
                                <div className='row verSolicitud'>
                                    <div className='col-5 fontTitulo'>
                                        <label>telefono : </label>
                                    </div>
                                    <div className='col-7 fontContenido'>
                                        <label>  {telefono.campo}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </ModalBody>
                <div className="row p-2" >
                    <div className="col-auto">
                        <Button className=' cancelarVentanaSolicitud ' onClick={() => setModalVer(false)} >Corregir <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                    </div>
                    <div className="col-auto" >
                        <Button className='  Historial' onClick={() => insertar()}>Registrar <span className='btnNuevoIcono'><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></span> </Button>
                    </div>
                </div>
            </Modal>
            <Toaster position='top-right' />
        </>


    );

}
export default Registrame;
