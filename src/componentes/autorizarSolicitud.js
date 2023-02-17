import { Button, Modal, ModalBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faNotesMedical, faMicroscope, faExclamation, faCaretLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useEffect, useState } from "react";

import Home from './elementos/home'
import { URL, INPUT } from '../Auth/config'  // variables globales que estan disponibles para todo el sistema client

import useAuth from "../Auth/useAuth" // verificacion de la existencia de la sesion
import { ComponenteInputBuscar, ComponenteInputfecha, ComponenteInputfechaBuscar, ComponenteInputUser, ComponenteInputUserCodigo, ComponenteInputUserDiagnostico, VerSolicitudAutorizar } from './elementos/input';  // componente input que incluye algunas de las
import { Line } from './elementos/estilos';  // componente input que incluye algunas de las
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast'


function AtorizarSolicitud() {


    const auth = useAuth()

    const [fechaIni, setFechaIni] = useState({ campo: null, valido: null })
    const [fechaFin, setFechaFin] = useState({ campo: null, valido: null })
    const [ciBuscar, setCiBuscar] = useState({ campo: null, valido: null })
    const [cantidad, setCantidad] = useState([]) // cantidad de solicitudes en inicio y registros
    const [solicitud, setSolicitud] = useState([]) // cantidad de solicitudes en inicio y registros
    const [all, setall] = useState(0)
    const [acept, setAcept] = useState(0)
    const [pendding, setPendding] = useState(0)


    const [descripcion, setDescripcion] = useState(false)
    const [texto, setTexto] = useState({ campo: null, valido: false })

    const [ventana, setVentana] = useState(1)


    const [campoCodigoPacienteCardex, setCampoCodigoPacienteCardex] = useState({ campo: null, valido: null })
    const [campoFechaPacienteCardex, setCampoFechaPacienteCardex] = useState({ campo: null, valido: null })


    useEffect(() => {
        if (ciBuscar.valido === null || ciBuscar.valido === 'false') {
            listar()
            count()
            // alert('ejecution')
        }
    }, [ciBuscar])


    const count = async () => {
        try {
            let list = []

            await axios.post(URL + '/solicitudA/countA').then(json => {
            console.log(json.data,'Contar Solicitrudes')

                json.data.map((datos) => (
                    list.push(datos.estado)
                ))
            })

            setall(list.length)
            setPendding(list.filter((num) => num === 0).length)
            setAcept(list.filter((num) => num === 1).length)

        } catch (error) {

            // auth.logout()
            return error
        }
    }
    const listar = async () => {
        try {

            await axios.post(URL + '/solicitudA/listarA').then(json => {
                setCantidad(json.data)
                console.log(json.data,'Listar solicitudes')
            })

        } catch (error) {

            // auth.logout()
            return error

        }
    }

    try {



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



        const verSolicitud = async (dato) => {

            await axios.post(URL + '/solicitudA/ver', { dato: dato }).then(json => {
                setSolicitud(json.data)
            })
            setVentana(2)
        }

        const autorizar = async () => {

            let ok = window.confirm('AUTORIZAR SOLICITUD ?')
            if (ok === true && solicitud !== null && solicitud[0].estado === 0) {
                let today = new Date()
                let fecha = today.toISOString().split('T')[0]

                await axios.post(URL + '/solicitudA/autorizar', {

                    codigoSol: solicitud[0].codigoSol,
                    fecha: fecha + ' ' + new Date().toLocaleTimeString()

                }).then(json => {

                    // console.log(json.data)
                    setSolicitud(json.data)
                    cantidad.forEach(e => {
                        if (e.codigoSol === solicitud[0].codigoSol) {
                            e.estado = 1
                        }
                    })
                    count()
                    toast.success('Solicitud autorizado')
                })
            }
            else alert('ja ja')
        }
        const eliminar = async () => {

            let ok = window.confirm('RETENER SOLICITUD ?')

            if (ok === true && solicitud !== null && texto.valido === 'true' && solicitud[0].codigoSol != null) {

                let today = new Date()
                let fecha = today.toISOString().split('T')[0]

                await axios.post(URL + '/solicitudA/eliminarA', {

                    codigoSol: solicitud[0].codigoSol,
                    texto: texto.campo + ': solicitud detenida en fecha  ' + fecha + ' a horas  ' + new Date().toLocaleTimeString()

                }).then(json => {

                    setCantidad(json.data)
                    setDescripcion(false)
                    setVentana(1)
                    setTexto({ campo: null, valido: null })
                    setSolicitud([])
                    toast.success('Solicitud Rechazado')
                })
            } else toast.error('Ocurrió un error')
        }




        const buscar = async () => {
            if (ciBuscar.valido === 'true' ||campoCodigoPacienteCardex.valido === 'true' || campoFechaPacienteCardex.valido === 'true') {
                let dato = null
                if(ciBuscar.valido === 'true'){
                    dato = ciBuscar.campo
                }
                if(campoCodigoPacienteCardex.valido === 'true'){
                    dato = campoCodigoPacienteCardex.campo
                }
                if(campoFechaPacienteCardex.valido === 'true'){
                    dato = campoFechaPacienteCardex.campo
                }
                await axios.post(URL + '/solicitudA/buscarA', { dato: dato }).then(json => {
                    setCantidad(json.data)
                })
            }
        }

        const buscarPorFecha = async () => {

            if (fechaIni.valido === 'true' && fechaFin.valido === 'true') {
                await axios.post(URL + '/solicitudA/buscarfechaA', { ini: fechaIni.campo, fin: fechaFin.campo }).then(json => {
                    setCantidad(json.data)
                    if (json.data.length === 0) toast.error('No se encontró registros')
                })
            }
        }


        return (
            <>
                <div className="hold-transition sidebar-mini" >
                    <div className="wrapper">
                        <Home />
                        <div className="content-wrapper">
                            <div className="content">
                                <div className="container-fluid ">
                                    <div className="page-wrapper" style={{ marginTop: '5px', background: '#e9eeeb' }}>
                                        {
                                            ventana === 1 && <div className='titloFormulario' >
                                                Solicitudes Entrantes
                                            </div>
                                        }
                                        {ventana === 1 &&
                                            <div className='row p-2'>
                                                <div className='col-12 col-xl-10 col-lg-10 col-md-10 col-sm-12'>
                                                    <div className="row">
                                                        <div className=" col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
                                                            <ComponenteInputUserDiagnostico
                                                                estado={ciBuscar}
                                                                cambiarEstado={setCiBuscar}
                                                                tipo="text"
                                                                name="buscarCi"
                                                                placeholder="C.I."
                                                                ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                            />
                                                        </div>

                                                        <div className='col-xl-2 col-lg-2 col-md-3 col-sm-3 col-6'>
                                                            <ComponenteInputUserCodigo
                                                                estado={campoCodigoPacienteCardex}
                                                                cambiarEstado={setCampoCodigoPacienteCardex}
                                                                name="buscarCampo"
                                                                placeholder="Codigo de solicitud"
                                                                ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                            />
                                                        </div>
                                                        <div className='col-xl-2 col-lg-2 col-md-3 col-sm-3 col-6'>
                                                            <ComponenteInputfechaBuscar
                                                                estado={campoFechaPacienteCardex}
                                                                cambiarEstado={setCampoFechaPacienteCardex}
                                                                name="fechaSolicitud"
                                                                ExpresionRegular={INPUT.FECHA}  //expresion regular
                                                            />
                                                        </div>
                                                        <div className='col-12 col-sm-5 col-md-4 col-lg-4 ml-1'>
                                                            <Button className="btnBuscar" style={{ width: '40%' }} onClick={buscar} >Buscar <span className='btnNuevoIcono'><FontAwesomeIcon icon={faSearch}></FontAwesomeIcon></span> </Button>
                                                        </div>
                                                    </div>
                                                    <div className=" table table-responsive custom mb-2 mt-3" style={{ marginBottom: "0px", padding: '0px', background: '#e9eeeb', height: '470px' }}>
                                                        {cantidad.length === 0 &&
                                                            <div className='paciente '><strong>NO SE ENCONTRO NINGUNA INFORMACION</strong></div>
                                                        }

                                                        {cantidad.map((c) => (
                                                            <div className='row pb-2 itemReportes' key={c.id} onClick={() => { verSolicitud(c.codigoSol) }}>
                                                                <div className='col-1' style={{ width: '5px' }}>
                                                                    <div className='iconoverSolicitudList'><FontAwesomeIcon icon={faNotesMedical} /></div>
                                                                </div>
                                                                <div className='col-10 bloque' >
                                                                    <div className='row pb-0'>
                                                                        <div className='col-6'>
                                                                            <p className='medicoList' style={{ textAlign: 'left' }}><strong> {'PAC. ' + c.paciente}</strong></p>
                                                                            <p className='diagnosticoList'> {'DIAGNOSTICO: ' + c.diagnostico}</p>
                                                                        </div>
                                                                        <div className='col-6 row'>
                                                                            {c.estado === 1 ? <div className='col-5 estadoSi'><strong> AUTORIZADO</strong></div>
                                                                                : <div className='col-5 estadoNo'><strong> PENDIENTE</strong></div>}
                                                                            <p className='nhcList'> {'CODIGO ' + c.codigoSol}</p>

                                                                        </div>
                                                                    </div>

                                                                    <div className='row pt-0'>
                                                                        <div className='col-6'>
                                                                            <p className='nhcList'> {'NUMERO HISTORIAL CLINICO ' + c.nhc}</p>
                                                                            <p className='codigoSolList'> {'ITEMS ' + c.cantidad}</p>

                                                                        </div>
                                                                        <div className='col-6'>
                                                                            <p className='codigoSolList'>{'FECHA DE SOLICITUD ' + c.fecha}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='col-1'>
                                                                    {c.recibidoLab === 1 ? <div className='col-1 recepcionSi'><FontAwesomeIcon icon={faMicroscope} /></div>
                                                                        : <div className='col-1 recepcionNo'> <FontAwesomeIcon icon={faMicroscope} /></div>}
                                                                    {c.publisher === 1 ? <div className='col-1 recepcionSi'><FontAwesomeIcon icon={faCheckSquare} /></div>
                                                                        : <div className='col-1 recepcionNo'> <FontAwesomeIcon icon={faCheckSquare} /></div>}
                                                                </div>

                                                            </div>
                                                        ))}

                                                    </div>
                                                </div>
                                                <div className="col-12 col-xl-2 col-lg-2 col-md-2 col-sm-12">

                                                    <div className="progress-group">
                                                        Pendientes
                                                        <span className="float-right"><b>{pendding}</b>/{all}</span>
                                                        <div className="progress progress-sm">
                                                            <Line className="progress-bar bg-danger" valor={(pendding * 100) / all}></Line>
                                                        </div>
                                                    </div>

                                                    <div className="progress-group">
                                                        <span className="progress-text">Aceptados</span>
                                                        <span className="float-right"><b>{acept}</b>/{all}</span>
                                                        <div className="progress progress-sm">
                                                            <Line className="progress-bar bg-success " valor={(acept * 100) / all}></Line>
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className='col-xl-12 col-lg-12 col-md-12 col-sm-6 col-6'>
                                                            <ComponenteInputfecha
                                                                estado={fechaIni}
                                                                cambiarEstado={setFechaIni}
                                                                name="fechaSolicitud"
                                                                ExpresionRegular={INPUT.FECHA}  //expresion regular
                                                                etiqueta='DESDE'
                                                            />
                                                        </div>
                                                        <div className='col-xl-12 col-lg-12 col-md-12 col-sm-6 col-6'>

                                                            <ComponenteInputfecha
                                                                estado={fechaFin}
                                                                cambiarEstado={setFechaFin}
                                                                name="fechaSolicitud"
                                                                ExpresionRegular={INPUT.FECHA}  //expresion regular
                                                                etiqueta='HASTA'
                                                            />
                                                        </div>
                                                        <div className='col-12'>
                                                            <Button className='info' onClick={() => buscarPorFecha()}>Consultar</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>



                                        }

                                        {
                                            ventana === 2 &&
                                            <VerSolicitudAutorizar solicitud={solicitud} cerrar={setVentana} autorizar={autorizar} eliminar={setDescripcion} />

                                        }
                                        <Modal isOpen={descripcion}>
                                            <div className='titloFormulario' >
                                                RECHAZAR SOLICITUD
                                            </div>
                                            <ModalBody>
                                                <ComponenteInputUser
                                                    estado={texto}
                                                    cambiarEstado={setTexto}
                                                    name="servicio"
                                                    placeholder="motivo"
                                                    ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                    etiqueta='Motivo'
                                                />

                                            </ModalBody>

                                            <div className="row p-2" >

                                                <div className="col-auto">
                                                    <Button className=' cancelarVentanaSolicitud' onClick={() => { setDescripcion(false); setTexto({ campo: null, valido: false }) }} >CANCELAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                                </div>
                                                <div className="col-auto" >
                                                    <Button className=' reportar ' onClick={() => eliminar()}>RECHAZAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faExclamation}></FontAwesomeIcon></span> </Button>
                                                </div>
                                            </div>
                                        </Modal>
                                    </div>
                                </div>
                            </div>
                        </div >
                    </div>
                </div>
                <Toaster position='top-right' />
            </>
        );
    } catch (error) {
        auth.logout()
    }
}
export default AtorizarSolicitud;
