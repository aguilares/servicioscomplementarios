import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faCheckSquare,  faMicroscope, faNotesMedical  } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

import { useEffect, useState } from "react";

import useAuth from "../Auth/useAuth" // verificacion de la existencia de la sesion
import {
    ComponenteInputBuscar, ComponenteInputfecha, GenerarPdf, VerSolicitud,

} from './elementos/input';  // componente input que incluye algunas de las


import Home from './elementos/home';
import { URL, INPUT } from '../Auth/config'  // variables globales que estan disponibles para todo el sistema client
import axios from 'axios';
import { Line } from './elementos/estilos';  // componente input que incluye algunas de la



function RegistrarSolicitud() {
    const auth = useAuth()
    const [ciBuscar, setCiBuscar] = useState({ campo: null, valido: null })
    const [all, setall] = useState(0)
    const [acept, setAcept] = useState(0)
    const [pendding, setPendding] = useState(0)
    const [cantidad, setCantidad] = useState([]) // cantidad de solicitudes en inicio y registros
    const [solicitud, setSolicitud] = useState([])
    const [informe, setInforme] = useState([])
    const [laboratorio, setLaboratorio] = useState([])


    const [ventana, setVentana] = useState(1)



    const [fechaIni, setFechaIni] = useState({ campo: null, valido: null })
    const [fechaFin, setFechaFin] = useState({ campo: null, valido: null })





    try {
        const count = async () => {

            let list = []

            await axios.post(URL + '/solicitudS/countS').then(json => {
                json.data.map((datos) => (
                    list.push(datos.estado)
                ))
            })
            setall(list.length)
            setPendding(list.filter((num) => num === 0).length)
            setAcept(list.filter((num) => num === 1).length)
        }

        const listar = async () => {
            await axios.post(URL + '/solicitudS/listarS').then(json => {
                setCantidad(json.data)
            })
        }


        useEffect(() => {

            if (ciBuscar.valido === 'false')
                listar()
            if (ciBuscar.valido === null) {
                listar()
                count()
            }
        }, [ciBuscar])


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
            await axios.post(URL + '/solicitudS/ver', { dato: dato }).then(json => {
                setSolicitud(json.data[0])
                setVentana(2)
            })

        }
        const abandonarVentanaVer = () => {
            listar()
            setVentana(1)
            setSolicitud([])
            setSolicitud([])
        }


        const buscar = async () => {
            if (ciBuscar.valido === 'true') {
                await axios.post(URL + '/solicitudS/buscarS', { dato: ciBuscar.campo }).then(json => {
                    setCantidad(json.data)
                })
            }
        }

        const buscarPorFecha = async () => {
            // const fechaSolicitud = fechaHoy.toISOString().split('T')[0]

            if (fechaIni.valido === 'true' && fechaFin.valido === 'true') {
                await axios.post(URL + '/solicitudS/buscarfechaS', { ini: fechaIni.campo, fin: fechaFin.campo }).then(json => {
                    setCantidad(json.data)
                })
            }
        }



        const generarInforme = async (movil = false) => {

            console.log('gfenerar informe')
            if (solicitud[0].codigoSol) {

                let today = new Date()
                let fecha = today.toISOString().split('T')[0]
                await axios.post(URL + '/solicitudS/genInforme', {

                    codigoSol: solicitud[0].codigoSol,
                    fecha: fecha + ' ' + new Date().toLocaleTimeString()

                }).then(json => {

                    if (json.data.length > 0) {
                        console.log(json.data, 'infrome data')
                        setInforme(json.data[0])
                        setLaboratorio(json.data[1])

                        if (movil === true) {
                            // setInforme(json.data)
                            // if (jso !== null) {
                            document.getElementById('descargarDocu').click()
                            // setInforme([])
                            // }
                        }
                        else {
                            console.log('abrir pdf')
                            setVentana(3)
                        }
                    }

                })
            } else { alert('codigo null') }
        }

        return (
            <>
                <div className="hold-transition sidebar-mini">
                    <div className="wrapper">
                        <Home />
                        <div className="content-wrapper" >
                            <div className="content"    >
                                <div className="container-fluid" >
                                    <div className="page-wrapper" style={{ marginTop: '5px', background: '#e9eeeb' }}>
                                        {
                                            ventana === 1 && <div className='titloFormulario' >
                                                MIS SOLCITUDES
                                            </div>
                                        }
                                        {
                                            ventana === 1 &&

                                            <div className='row m-1' >

                                                <div className=' col-12 col-xl-10 col-lg-10 col-md-10 col-sm-12  '>
                                                    <div className="row mt-2 mb-2">


                                                        <div className='col-7 float-right'>

                                                            <ComponenteInputBuscar
                                                                estado={ciBuscar}
                                                                cambiarEstado={setCiBuscar}
                                                                name="buscarCi"
                                                                placeholder="C.I."
                                                                ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                                eventoBoton={buscar}
                                                                etiqueta={'Buscar'}
                                                            />
                                                        </div>

                                                    </div>
                                                    <div className=" table table-responsive custom mb-2 mt-3" style={{ marginBottom: "0px", padding: '0px', background: '#e9eeeb', height: '470px' }}>
                                                        {cantidad.length === 0 &&
                                                            <div className='paciente '><strong>NO SE ENCONTRO NINGUNA INFORMACION</strong></div>
                                                        }
                                                        {cantidad.map((c) => (
                                                            <div className='row pb-2 itemReportes' key={c.id} onClick={() => verSolicitud(c.codigoSol)}>
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
                                                                            <p className='codigoSolList'> {'CANTIDAD ' + c.cantidad}</p>

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

                                                <div className="col-12 col-xl-2 col-lg-2 col-md-2 col-sm-12 p-1" style={{ background: '#cdeodf' }}>
                                                    <div className="progress-group ">
                                                        <span className="progress-text  ">Pendientes</span>
                                                        <span className="float-right"><b>{pendding}</b>/{all}</span>
                                                        <div className="progress progress-sm pendientes">
                                                            <Line className="progress-bar bg-danger " valor={(pendding * 100) / all}></Line>
                                                        </div>
                                                    </div>
                                                    <div className="progress-group ">
                                                        <span className="progress-text ">Autorizados</span>
                                                        <span className="float-right"><b>{acept}</b>/{all}</span>

                                                        <div className="progress progress-sm aceptados">
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
                                                        <div className='pl-1'>
                                                            <Button className='info' onClick={() => buscarPorFecha()}>Consultar</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        {
                                            ventana === 2 &&
                                            <div style={{ marginTop: '10px' }}>
                                                <VerSolicitud solicitud={solicitud} abandonarVentanaVer={abandonarVentanaVer} generarInforme={generarInforme} reportes ={true} />
                                            </div>

                                        }
                                        {
                                            ventana === 3 &&
                                            <div>
                                                <GenerarPdf
                                                    informe={informe}
                                                    setEstado={setVentana}
                                                    numero={2}
                                                    lab={laboratorio}
                                                />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>

        );
    } catch (error) {
        auth.logout()
    }
}
export default RegistrarSolicitud;
