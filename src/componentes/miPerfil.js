

import React from 'react';
import useAuth from "../Auth/useAuth"
import { Button } from 'reactstrap';
import Home from './elementos/home'
import { useState, useEffect } from "react";
import { URL, INPUT } from '../Auth/config';
import axios from 'axios';
import { ComponenteInputUserRow, ComponenteInputUser } from './elementos/input'
import { Modal, ModalBody } from 'reactstrap'
import md5 from 'md5'
import { Toaster, toast } from 'react-hot-toast'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faCaretLeft, faHospital, faLocationArrow, faLock, faMailBulk, faPhone, faUser, faUserEdit, } from '@fortawesome/free-solid-svg-icons';

function MiPerfil() {
    const [nombre, setNombre] = useState({ campo: null, valido: null })
    const [apellidoPaterno, setApellidoPaterno] = useState({ campo: null, valido: null })
    const [apellidoMaterno, setApellidoMaterno] = useState({ campo: null, valido: null })
    const [ci, setCi] = useState({ campo: null, valido: null })
    const [correo, setCorreo] = useState({ campo: null, valido: null })
    const [telefono, setTelefono] = useState({ campo: null, valido: null })
    const [direccion, setDireccion] = useState({ campo: null, valido: null })
    const [user, setUser] = useState({ campo: null, valido: null })
    const [servicio, setServicio] = useState({ campo: null, valido: null })
    const [rol, setRol] = useState({ campo: null, valido: null })

    const [Pass1, setPass1] = useState({ campo: null, valido: null })
    const [Pass2, setPass2] = useState({ campo: null, valido: null })
    const [Pass3, setPass3] = useState({ campo: null, valido: null })
    const [PassDB, setPassDB] = useState({ campo: null, valido: null })

    const [modal, setModal] = useState(false)
    const [modalPass, setModalPass] = useState(false)
    const auth = useAuth()
    useEffect(() => {
        axios.post(URL + '/miPerfil/ver').then(json => {
            // setData(json.data)
            setNombre({ campo: json.data[0].nombre, valido: 'true' })
            setApellidoPaterno({ campo: json.data[0].apellidoPaterno, valido: 'true' })
            setApellidoMaterno({ campo: json.data[0].apellidoMaterno, valido: 'true' })
            setCi({ campo: json.data[0].ci, valido: 'true' })
            setCorreo({ campo: json.data[0].correo, valido: 'true' })
            setTelefono({ campo: json.data[0].telefono, valido: 'true' })
            setDireccion({ campo: json.data[0].direccion, valido: 'true' })
            setUser({ campo: json.data[0].username, valido: 'true' })
            setServicio({ campo: json.data[0].servicio, valido: 'true' })
            setRol({ campo: json.data[0].rol, valido: 'true' })
            setPassDB({ campo: json.data[0].pass, valido: 'true' })
        }).catch(() => {
            auth.logout()
        })

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

    try {
        const actualizar = async () => {
            if (nombre.valido === 'true' && apellidoPaterno.valido === 'true' && apellidoMaterno.valido === 'true' &&
                ci.valido === 'true' && correo.valido === 'true' && telefono.valido === 'true' && direccion.valido === 'true') {
                try {


                    axios.post(URL + '/miPerfil/actualizarMiPerfil', {
                        nombre: nombre.campo,
                        apellidoPaterno: apellidoPaterno.campo,
                        apellidoMaterno: apellidoMaterno.campo,
                        ci: ci.campo,
                        correo: correo.campo,
                        telefono: telefono.campo,
                        direccion: direccion.campo

                    }).then(json => {

                        if (json.data.msg != null) {
                            toast.error(json.data.msg)
                        }
                        else {
                            setNombre({ campo: json.data[0].nombre, valido: 'true' })
                            setApellidoPaterno({ campo: json.data[0].apellidoPaterno, valido: 'true' })
                            setApellidoMaterno({ campo: json.data[0].apellidoMaterno, valido: 'true' })
                            setCi({ campo: json.data[0].ci, valido: 'true' })
                            setCorreo({ campo: json.data[0].correo, valido: 'true' })
                            setTelefono({ campo: json.data[0].telefono, valido: 'true' })
                            setDireccion({ campo: json.data[0].direccion, valido: 'true' })
                            setUser({ campo: json.data[0].username, valido: 'true' })
                            setServicio({ campo: json.data[0].servicio, valido: 'true' })
                            setRol({ campo: json.data[0].rol, valido: 'true' })
                            setModal(false)
                            toast.success('Operacion exitosa')
                        }
                    })
                } catch (error) {
                    console.log(error)
                }
            }
            else toast.error('Complete todos los campos')
        }

        const cambiarContraseña = () => {
            let passMd5 = md5(Pass1.campo)
            if (Pass1.valido === 'true' && Pass2.valido === 'true' && Pass3.valido === 'true') {
                if (passMd5 === PassDB.campo) {
                    if (Pass2.campo === Pass3.campo) {
                        axios.post(URL + '/miPerfil/cambiarMiContrasena', { pass1: passMd5, pass2: md5(Pass2.campo) }).then(j => {
                            if (j.data.ok) {
                                setModalPass(false)
                                toast.success('Su nueva contrasena se ha guardado')
                                setPass1({ campo: null, valido: null })
                                setPass2({ campo: null, valido: null })
                                setPass3({ campo: null, valido: null })
                            }
                        })
                    } else { toast.error('Confirme corresctamente su nueva contraseña'); return }
                } else { toast.error('Su contraseña actual es incorrecto'); return }
            }
            else { toast.error('Complete todos los campos'); return }
        }

        return (
            <div  >
                <div className="hold-transition sidebar-mini">
                    <div className="wrapper">
                        <Home />
                        <div className="content-wrapper">
                            <div className="content">
                                <div className="container-fluid">

                                    <div className="col-lg-6 col-xl-6 col-md-7 col-sm-8 col-12 card card-primary card-outline m-auto mt-3" >
                                        <div className="card-body box-profile row">
                                            <div className='col-5'>
                                                <div className="text-center">
                                                    <img className="profile-user-img img-fluid img-circle"
                                                        src="../../dist/img/profile.png"
                                                        alt="SAN PEDRO CLAVER LAJASTAMBO" />
                                                </div>
                                                <div className='usuario '><strong>{nombre.campo + ' ' + apellidoPaterno.campo + ' ' + apellidoMaterno.campo}</strong></div>
                                                <p className='usuarioCi'>{ci.campo}</p>
                                            </div>
                                            <div className='col-7'>
                                                <div className='row pt-4'>
                                                    <div className='col-1 '>
                                                        <div className='iconoPerfil'><FontAwesomeIcon icon={faUser} /></div>
                                                    </div>
                                                    <div className='col-11 cajaDatosUser'>
                                                        <p className='medico'><strong> {'user ' + user.campo}</strong></p>
                                                        <p className='rol'><strong> {'rol ' + rol.campo}</strong></p>
                                                    </div>
                                                </div>
                                                <div className='row pt-4'>
                                                    <div className='col-1 '>
                                                        <div className='iconoPerfil'><FontAwesomeIcon icon={faHospital} /></div>
                                                    </div>
                                                    <div className='col-11 cajaDatosUser'>
                                                        <p className='codigoSol'>{'SERVICIO ' + servicio.campo}</p>
                                                    </div>
                                                </div>

                                                <div className='row pt-2'>
                                                    <div className='col-1 '>
                                                        <div className='iconoPerfil'><FontAwesomeIcon icon={faPhone} /></div>
                                                    </div>
                                                    <div className='col-11 cajaDatosUser'>
                                                        <p className='nhc'> {'CELULAR/TELEF ' + telefono.campo}</p>
                                                    </div>
                                                </div>
                                                <div className='row pt-2'>
                                                    <div className='col-1 '>
                                                        <div className='iconoPerfil'><FontAwesomeIcon icon={faMailBulk} /></div>
                                                    </div>
                                                    <div className='col-11 cajaDatosUser'>
                                                        <p className='codigoSol'> {'Email ' + correo.campo}</p>
                                                    </div>
                                                </div>
                                                <div className='row pt-2'>
                                                    <div className='col-1 '>
                                                        <div className='iconoPerfil'><FontAwesomeIcon icon={faLocationArrow} /></div>
                                                    </div>
                                                    <div className='col-11 cajaDatosUser'>
                                                        <p className='codigoSol'> {'DIR. ' + direccion.campo}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='row pt-2 pb-0'>
                                                <div className='col-auto '>
                                                    <Button className=' Historial ' onClick={() => setModal(true)}>ACTUALIZAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faUserEdit}></FontAwesomeIcon></span> </Button>
                                                </div>
                                                <div className='col-auto '>
                                                    <Button className=' eliminarVentanaSolicitud ' onClick={() => setModalPass(true)}>CAMBIAR CONTRASEÑA<span className='btnNuevoIcono'><FontAwesomeIcon icon={faLock}></FontAwesomeIcon></span> </Button>
                                                </div>

                                            </div>
                                        </div>



                                        <Modal isOpen={modal}>
                                            <div className='titloFormulario' >
                                                ACTUALIZAR MI PERFIL
                                            </div>
                                            <ModalBody>
                                                <div className="tab-pane">
                                                    <form className="form-horizontal">
                                                        <div className="form-group row">
                                                            <div className="col-sm-12">
                                                                <div className="form-group col-12 mb-2 mt-1 pl-1">
                                                                    <ComponenteInputUserRow
                                                                        estado={nombre}
                                                                        cambiarEstado={setNombre}
                                                                        name="NOMBRE"
                                                                        placeholder="NOMBRE COMPLETO"
                                                                        ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular
                                                                        etiqueta='NOMBRE'
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <div className="col-sm-12">
                                                                <div className="form-group col-12 mb-2 mt-1 pl-1">
                                                                    <ComponenteInputUserRow
                                                                        estado={apellidoPaterno}
                                                                        cambiarEstado={setApellidoPaterno}
                                                                        name="ci"
                                                                        placeholder="APELLIDO PATERNO"
                                                                        ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular
                                                                        etiqueta='APELLIDO PATERNO'
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <div className="col-sm-12">
                                                                <div className="form-group col-12 mb-2 mt-1 pl-1">
                                                                    <ComponenteInputUserRow
                                                                        estado={apellidoMaterno}
                                                                        cambiarEstado={setApellidoMaterno}
                                                                        name="apellido materno"
                                                                        placeholder="APELLIDO MATERNO"
                                                                        ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular
                                                                        etiqueta='APELLIDO MATERNO'
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <div className="col-sm-12">
                                                                <div className="form-group col-12 mb-2 mt-1 pl-1">
                                                                    <ComponenteInputUserRow
                                                                        estado={ci}
                                                                        cambiarEstado={setCi}
                                                                        name="CI"
                                                                        placeholder="CEDULA DE IDENTIDAD"
                                                                        ExpresionRegular={INPUT.CI}  //expresion regular
                                                                        etiqueta='CEDULA DE IDENTIDAD'
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <div className="col-sm-12">
                                                                <div className="form-group col-12 mb-2 mt-1 pl-1">
                                                                    <ComponenteInputUserRow
                                                                        estado={telefono}
                                                                        cambiarEstado={setTelefono}
                                                                        name="telefono"
                                                                        placeholder="TELEFONO/CELULAR"
                                                                        ExpresionRegular={INPUT.TELEFONO}  //expresion regular
                                                                        etiqueta='TELEFONO'
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <div className="col-sm-12">
                                                                <div className="form-group col-12 mb-2 mt-1 pl-1">
                                                                    <ComponenteInputUserRow
                                                                        estado={correo}
                                                                        cambiarEstado={setCorreo}
                                                                        name="CORREO"
                                                                        placeholder="CORREO ELECTRONICO"
                                                                        ExpresionRegular={INPUT.CORREO}  //expresion regular
                                                                        campoUsuario={true}
                                                                        etiqueta='CORREO'
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <div className="col-sm-12">
                                                                <div className="form-group col-12 mb-2 mt-1 pl-1">
                                                                    <ComponenteInputUserRow
                                                                        estado={direccion}
                                                                        cambiarEstado={setDireccion}
                                                                        name="direccion"
                                                                        placeholder="DIRECCION"
                                                                        ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                                        etiqueta='DIRECCION'
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </ModalBody>
                                            <div className="row  ">
                                                <div className="col-auto pl-3 pb-2">
                                                    <Button className='cancelarVentanaSolicitud ' onClick={() => setModal(false)} >CANCELAR<span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                                </div>
                                                <div className="col-auto">
                                                    <Button className='  Historial' onClick={() => actualizar()}>ACTUALIZAR PERFIL <span className='btnNuevoIcono'><FontAwesomeIcon icon={faUserEdit}></FontAwesomeIcon></span> </Button>
                                                </div>
                                            </div>
                                        </Modal>

                                        <Modal isOpen={modalPass}>
                                            <div className='titloFormulario' >
                                                CAMBIAR CONTRASEÑA
                                            </div>
                                            <ModalBody>
                                                <div className="tab-pane">
                                                    <form className="form-horizontal">
                                                        <div className="form-group row">
                                                            <div className="col-sm-12">
                                                                <div className="form-group col-12 mb-2 mt-1 pl-1">
                                                                    <ComponenteInputUser
                                                                        estado={Pass1}
                                                                        cambiarEstado={setPass1}
                                                                        name="pass1"
                                                                        placeholder="CONTRASEÑA ACTUAL"
                                                                        ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                                        etiqueta='CONTRASEÑA ACTUAL'
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <div className="col-sm-12">
                                                                <div className="form-group col-12 mb-2 mt-1 pl-1">
                                                                    <ComponenteInputUser
                                                                        estado={Pass2}
                                                                        cambiarEstado={setPass2}
                                                                        name="pass1"
                                                                        placeholder="NUEVA CONTRASEÑA"
                                                                        ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                                        etiqueta='NUEVA CONTRASEÑA'
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <div className="col-sm-12">
                                                                <div className="form-group col-12 mb-2 mt-1 pl-1">
                                                                    <ComponenteInputUser
                                                                        estado={Pass3}
                                                                        cambiarEstado={setPass3}
                                                                        name="pass1"
                                                                        placeholder="CONFIRMA CONTRASEÑA"
                                                                        ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                                        etiqueta='CONFIRMAR CONTRASEÑA'
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </ModalBody>
                                            <div className="row ">
                                                <div className="col-auto pl-3 pb-2">
                                                    <Button className='cancelarVentanaSolicitud ' onClick={() => setModalPass(false)} >CERRAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                                </div>
                                                <div className="col-auto">
                                                    <Button className='  Historial' onClick={() => cambiarContraseña()}>CAMBIAR CONTRASEÑA <span className='btnNuevoIcono'><FontAwesomeIcon icon={faLock}></FontAwesomeIcon></span> </Button>
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

            </div >

        );
    } catch (error) {
        auth.logout()
    }

}
export default MiPerfil;
