import useAuth from "../Auth/useAuth";
import { useEffect } from "react";
import React from 'react';
import { useState } from "react";
import { URL, INPUT } from '../Auth/config';
import { ComponenteInputUser, ComponenteInputFile } from './elementos/input';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados

import { Button, Modal, ModalBody } from 'reactstrap';
import axios from 'axios';
import { Link } from 'react-router-dom'
import { faCaretLeft, faDatabase, faEdit, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Toaster, toast } from 'react-hot-toast'
import Home from './elementos/home'



function Informaciones() {
    const auth = useAuth()

    const [modalInsertar, setModalInsertar] = useState(false);

    const [modalEditar, setModalEditar] = useState(false);

    const [id, setId] = useState({ campo: null, valido: null })
    const [red, setRed] = useState({ campo: null, valido: null })
    const [nombre, setNombre] = useState({ campo: null, valido: null })
    const [telefono, setTelefono] = useState({ campo: null, valido: null })
    const [direccion, setDireccion] = useState({ campo: null, valido: null })
    const [correo, setCorreo] = useState({ campo: null, valido: null })
    const [file, setFile] = useState(null)
    const [fileName, setFileName] = useState(null);

 
    useEffect(() => {
        axios.post(URL + '/laboratorio/all').then(json => {
            console.log(json.data)
            if (json.data.length > 0) {

                // console.log(json.data.resultado)
                setId({ campo: json.data[0].id, valido: 'true' })
                setRed({ campo: json.data[0].red, valido: 'true' })
                setNombre({ campo: json.data[0].nombre, valido: 'true' })
                setTelefono({ campo: json.data[0].telefono, valido: 'true' })
                setDireccion({ campo: json.data[0].direccion, valido: 'true' })
                setCorreo({ campo: json.data[0].correo, valido: 'true' })
                setFileName(json.data[0].sello)
            } else {
                setModalInsertar(true)
            }

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


        const abrirModalEditar = () => {
            setModalEditar(true)
        }

        const insertar = async () => {
            if (nombre.valido === 'true' && red.valido === 'true' && telefono.valido === 'true' &&
                direccion.valido === 'true' && file.valido === 'true' && correo.valido === 'true') {
                let today = new Date()
                let fecha = today.toISOString().split('T')[0]

                try {
                    axios.post(URL + '/laboratorio/insertar', {
                        red: red.campo,
                        nombre: nombre.campo,
                        telefono: telefono.campo,
                        direccion: direccion.campo,
                        correo: correo.campo,
                        creado: fecha + ' ' + new Date().toLocaleTimeString(),
                    }).then(json => {
                        setId({ campo: json.data[0].id, valido: 'true' })
                        setRed({ campo: json.data[0].red, valido: 'true' })
                        setNombre({ campo: json.data[0].nombre, valido: 'true' })
                        setTelefono({ campo: json.data[0].telefono, valido: 'true' })
                        setDireccion({ campo: json.data[0].direccion, valido: 'true' })
                        setCorreo({ campo: json.data[0].correo, valido: 'true' })
                        setFileName(json.data[0].sello)
                        setModalInsertar(false)
                        toast.success('Operacion Exitosa')
                    })
                } catch (error) {
                    return error
                }
            } else {
                toast.error('Complete todos los campos')
            }
        }


        const actualizar = async (e) => {

            if (id.valido === 'true' && nombre.valido === 'true' && red.valido === 'true'
                && telefono.valido === 'true' && direccion.valido === 'true' && file !== null && correo.valido === 'true') {

                try {
                    let today = new Date()
                    let fecha = today.toISOString().split('T')[0]



                    let hora = new Date().toLocaleTimeString().split(':')[0]
                    let min = new Date().toLocaleTimeString().split(':')[1]
                    let sec = new Date().toLocaleTimeString().split(':')[2]
                    if (hora < 10) hora = '0' + hora
                    let horafinal = hora + ':' + min + ':' + sec


                    axios.post(URL + '/laboratorio/actualizar', {
                        id: id.campo,
                        red: red.campo,
                        nombre: nombre.campo,
                        telefono: telefono.campo,
                        direccion: direccion.campo,
                        correo: correo.campo,
                        modificado: fecha + ' ' + horafinal,

                    }).then(json => {
                        setId({ campo: json.data[0].id, valido: 'true' })
                        setRed({ campo: json.data[0].red, valido: 'true' })
                        setNombre({ campo: json.data[0].nombre, valido: 'true' })
                        setTelefono({ campo: json.data[0].telefono, valido: 'true' })
                        setDireccion({ campo: json.data[0].direccion, valido: 'true' })
                        setCorreo({ correo: json.data[0].correo, valido: 'true' })
                        setFileName(json.data[0].sello)
                        setModalEditar(false)
                        toast.success('Operacion Exitosa')
                    })
                } catch (error) {
                    console.log(error)
                    return error
                }
            } else {
                toast.error('Complete todos los campos')
            }

        }


        const enviarImagen = () => {
            if (file !== null) {
                const formatoData = new FormData()
                formatoData.append('sello', file)
                axios.post(URL + '/laboratorio/insertarImagen', formatoData)
            } else {
                toast.error('Debes cargar un archivo')
            }
        }

        const copiaseguridad = () => {
            let today = new Date()
            let fecha = today.toISOString().split('T')[0]



            let hora = new Date().toLocaleTimeString().split(':')[0]
            let min = new Date().toLocaleTimeString().split(':')[1]
            let sec = new Date().toLocaleTimeString().split(':')[2]
            if (hora < 10) hora = '0' + hora
            let horafinal = hora +  min + sec

            const formatoData = new FormData()
            formatoData.append('sello', file)
            axios.post(URL + '/laboratorio/copiaSeguridad',{fecha:fecha+horafinal}).then(json => {
                toast.success(json.data.msg)
            })

        }

        return (
            <div >
                <div className="hold-transition sidebar-mini" >
                    <div className="wrapper">
                        <Home />
                        <div className="content-wrapper" >
                            <div className="content" >
                                <div className="container-fluid" ></div>

                                <div className=" card-widget widget-user-2 col-lg-7 col-md-7 col-sm-10 col-sm-12 col-12 m-auto mt-3">
                                    <div className="widget-user-header bg-success " >
                                        <div className="widget-user-image">
                                            <img className="img-circle elevation-2" src="../../dist/img/sp.png" alt="User Avatar" />
                                        </div>
                                        <h3 className="widget-user-username">{nombre.campo}</h3>
                                        <h5 className="widget-user-desc">{red.campo}</h5>
                                    </div>
                                    <div className="card-footer p-0">
                                        <ul className="nav flex-column">
                                            <li className="nav-item">
                                                <Link to="#" className="nav-link">
                                                    {direccion.campo} <i className="fas fa-map-marker-alt mr-1"></i>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="#" className="nav-link">
                                                    {telefono.campo} <i className="fas fa-phone mr-1"></i>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="#" className="nav-link">
                                                    {correo.campo}
                                                </Link>
                                            </li>

                                            <div className=' p-2 mt-3 '>
                                                {fileName && <img src={URL + '/' + fileName} alt={'...'} className=' float-right' style={{ height: '150px', width: '150px' }} />}
                                            </div>
                                        </ul>
                                        <div className="row ">
                                            <div className="col-auto pl-3 pb-2">
                                                <Button className='  Historial' onClick={() => abrirModalEditar()}>ACTUALIZAR<span className='btnNuevoIcono'><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></span> </Button>
                                            </div>
                                            <div className="col-auto pl-3 pb-2">
                                                <Button className='eliminarVentanaSolicitud ' onClick={() => copiaseguridad()} >Copia de seguridad <span className='btnNuevoIcono'><FontAwesomeIcon icon={faDatabase}></FontAwesomeIcon></span> </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* </div> */}




                                <Modal isOpen={modalInsertar}>
                                    <div className='titloFormulario' >
                                        REGISTRAR HOSPITAL
                                    </div>
                                    <ModalBody>
                                        <form>
                                            <div className='row'>
                                                <div className="form-group col-12">
                                                    <ComponenteInputUser
                                                        estado={direccion}
                                                        cambiarEstado={setDireccion}
                                                        name="Dieccion"
                                                        placeholder="DIRECCION"
                                                        ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                        etiqueta='Direccion'
                                                    />
                                                </div>
                                                <div className="form-group col-12">
                                                    <ComponenteInputUser
                                                        estado={nombre}
                                                        cambiarEstado={setNombre}
                                                        name="nombre"
                                                        placeholder="LABORATORIO"
                                                        ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                        etiqueta='Nombre'
                                                    />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className="form-group col-6">
                                                    <ComponenteInputUser
                                                        estado={telefono}
                                                        cambiarEstado={setTelefono}
                                                        name="telefono"
                                                        placeholder="TELEFONO"
                                                        ExpresionRegular={INPUT.TELEFONO}  //expresion regular
                                                        etiqueta='Telefono'
                                                    />
                                                </div>
                                                <div className="form-group col-6">
                                                    <ComponenteInputUser
                                                        estado={red}
                                                        cambiarEstado={setRed}
                                                        name="red"
                                                        placeholder="RED"
                                                        ExpresionRegular={INPUT.SEGURO}  //expresion regular
                                                        etiqueta='Red'
                                                    />
                                                </div>
                                                <div className="form-group col-12">
                                                    <ComponenteInputUser
                                                        estado={correo}
                                                        cambiarEstado={setCorreo}
                                                        name="red"
                                                        placeholder="CORREO ELECTRONICO"
                                                        ExpresionRegular={INPUT.CORREO}  //expresion regular
                                                        etiqueta='CORREO ELECTRONIO'
                                                        campoUsuario={true}
                                                    />
                                                </div>
                                                <div className='col-12'>
                                                    <ComponenteInputFile
                                                        cambiarEstado={setFile}
                                                        name='imagenFile'
                                                        etiqueta={'seleccionar imagen'}

                                                    />
                                                </div>
                                            </div>
                                        </form>
                                    </ModalBody>

                                    <div className="row ">
                                        <div className="col-auto pl-3 pb-2">
                                            <Button className='cancelarVentanaSolicitud ' onClick={() => setModalInsertar(false)} >CERRAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                        </div>
                                        <div className="col-auto">
                                            <Button className='  Historial' onClick={() => insertar()}>REGISTRAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faSave}></FontAwesomeIcon></span> </Button>
                                        </div>
                                    </div>
                                </Modal>

                                <Modal isOpen={modalEditar}>
                                    <div className='titloFormulario' >
                                        ACTUALIZAR DATOS
                                    </div>
                                    <ModalBody>
                                        <form>
                                            <div className='row'>
                                                <div className="form-group col-12">
                                                    <ComponenteInputUser
                                                        estado={direccion}
                                                        cambiarEstado={setDireccion}
                                                        name="Dieccion"
                                                        placeholder="DIRECCION"
                                                        ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                        etiqueta='Direccion'
                                                    />
                                                </div>
                                                <div className="form-group col-12">
                                                    <ComponenteInputUser
                                                        estado={nombre}
                                                        cambiarEstado={setNombre}
                                                        name="nombre"
                                                        placeholder="LABORATORIO"
                                                        ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                        etiqueta='Nombre'
                                                    />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className="form-group col-6">
                                                    <ComponenteInputUser
                                                        estado={telefono}
                                                        cambiarEstado={setTelefono}
                                                        name="telefono"
                                                        placeholder="TELEFONO"
                                                        ExpresionRegular={INPUT.TELEFONO}  //expresion regular
                                                        etiqueta='Telefono'
                                                    />
                                                </div>
                                                <div className="form-group col-6">
                                                    <ComponenteInputUser
                                                        estado={red}
                                                        cambiarEstado={setRed}
                                                        name="red"
                                                        placeholder="RED"
                                                        ExpresionRegular={INPUT.SEGURO}  //expresion regular
                                                        etiqueta='Red'
                                                    />
                                                </div>
                                                <div className="form-group col-12">
                                                    <ComponenteInputUser
                                                        estado={correo}
                                                        cambiarEstado={setCorreo}
                                                        name="red"
                                                        placeholder="CORREO ELECTRONICO"
                                                        ExpresionRegular={INPUT.CORREO}  //expresion regular
                                                        etiqueta='CORREO ELECTRONIO'
                                                        campoUsuario={true}
                                                    />
                                                </div>
                                                <div className='pt-4'>
                                                    <ComponenteInputFile
                                                        estado={file}
                                                        cambiarEstado={setFile}
                                                        name='imagenFile'
                                                        etiqueta={'seleccionar imagen'}
                                                        ExpresionRegular={INPUT.IMG}
                                                    />
                                                </div>
                                            </div>
                                        </form>
                                    </ModalBody>
                                    <div className="row ">
                                        <div className="col-auto pl-3 pb-2">
                                            <Button className='cancelarVentanaSolicitud ' onClick={() => setModalEditar(false)} >Cancelar <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                        </div>
                                        <div className="col-auto">
                                            <Button className='  Historial' onClick={() => { actualizar(); enviarImagen() }}>Actualizar <span className='btnNuevoIcono'><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></span> </Button>
                                        </div>
                                    </div>
                                </Modal>
                                <Toaster position='top-right' />

                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    } catch (error) {
        auth.logout()
    }

}
export default Informaciones;