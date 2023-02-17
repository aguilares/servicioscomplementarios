import { Button, Modal, ModalBody, } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faNotesMedical, faCheckSquare, faMicroscope, faCaretLeft, faUpload, faTrashAlt, faExpand, faSearch, faRegistered, faExclamation } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

import { useEffect, useState } from "react";

import useAuth from "../Auth/useAuth" // verificacion de la existencia de la sesion
import {
    ComponenteInputfecha, ComponenteInputUserArea, VerSolicitudComplementarios, ComponenteInputFile, ComponenteInputUserDiagnostico, ComponenteInputUserCodigo, ComponenteInputfechaBuscar
} from './elementos/input';  // componente input que incluye algunas de las


import { InputTabla, Select } from './elementos/estilos';
import Home from './elementos/home';
import { URL, INPUT } from '../Auth/config'  // variables globales que estan disponibles para todo el sistema client
import axios from 'axios';
import { Line } from './elementos/estilos';  // componente input que incluye algunas de la

import { Toaster, toast } from 'react-hot-toast'


function Resultados() {
    const auth = useAuth()

    const [ciBuscar, setCiBuscar] = useState({ campo: null, valido: null })
    const [resultado, setResultado] = useState({ campo: null, valido: null })
    const [all, setall] = useState(0)
    const [acept, setAcept] = useState(0)
    const [pendding, setPendding] = useState(0)
    const [cantidad, setCantidad] = useState([]) // cantidad de solicitudes en inicio
    const [solicitud, setSolicitud] = useState([])
    const [campoCodigoPacienteCardex, setCampoCodigoPacienteCardex] = useState({ campo: null, valido: null })
    const [campoFechaPacienteCardex, setCampoFechaPacienteCardex] = useState({ campo: null, valido: null })
    const [area, setArea] = useState({ campo: null, valido: null })


    const [modalLaboratorio, setModalLaboratorio] = useState(false)   // despachar solicitud en caso de banco de sangre y servicio de hemoterapia
    const [modalTransfusional, setModalTransfusional] = useState(false)   // despachar solicitud en caso de banco de sangre y servicio de hemoterapia

    // const [mensaje, setMensaje] = useState(null)
    const [intervalo, setIntervalo] = useState([])
    const [ventana, setVentana] = useState(1)

    const [codigo, setCodigo] = useState([])
    const [indice, setIndice] = useState(0)
    const [indiceVer, setIndiceVer] = useState(0)
    const [mensaje, setMensaje] = useState(null)
    const [rol, setRol] = useState(0)

    const [file, setFile] = useState(null)
    const [item, setItem] = useState(null)
    const [fileNames, setFileNames] = useState([]);
    const [imagen, setImagen] = useState(null);
    const [obs, setObs] = useState(null);




    let fecha = new Date().toLocaleDateString()
    // console.log('fecha de loggg : ', fecha.toLocaleString())
    let año = fecha.split('/')[2]
    let mes = fecha.split('/')[1]
    let dia = fecha.split('/')[0]
    if (mes < 10) {
        mes = 0 + '' + mes
    }
    if (dia < 10) {
        dia = 0 + '' + dia

    }
    const [fechaHoy, setFechaHoy] = useState({ campo: año + '-' + mes + '-' + dia, valido: 'true' })
    const [fechaIni, setFechaIni] = useState({ campo: null, valido: null })
    const [fechaFin, setFechaFin] = useState({ campo: null, valido: null })

    try {

        const count = async () => {

            let list = []

            await axios.post(URL + '/solicitudL/countL').then(json => {
                json.data.map((datos) => (
                    list.push(datos.estado)
                ))
            })
            setall(list.length)
            setPendding(list.filter((num) => num === 0).length)
            setAcept(list.filter((num) => num === 1).length)

        }

        const listar = async () => {
            // console.log('ya viene la lista')
            await axios.post(URL + '/solicitudL/listarL').then(json => {
                setCantidad(json.data)
            })
        }


        useEffect(() => {
            if (ciBuscar.valido === 'false') {
                listar()
                count()
            }
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


        const buscar = async () => {
            if (ciBuscar.valido === 'true' || campoCodigoPacienteCardex.valido === 'true' || campoFechaPacienteCardex.valido === 'true') {
                let dato = null
                if (ciBuscar.valido === 'true') {
                    dato = ciBuscar.campo
                }
                if (campoCodigoPacienteCardex.valido === 'true') {
                    dato = campoCodigoPacienteCardex.campo
                }
                if (campoFechaPacienteCardex.valido === 'true') {
                    dato = campoFechaPacienteCardex.campo
                }
                await axios.post(URL + '/solicitudL/buscarL', { dato: dato }).then(json => {
                    setCantidad(json.data)
                })
            }
        }

        const buscarPorFecha = async () => {
            console.log('fecha actual: ', fechaIni, fechaFin)

            if (fechaIni.valido === 'true' && fechaFin.valido === 'true') {
                await axios.post(URL + '/solicitudL/buscarfechaL', { ini: fechaIni.campo, fin: fechaFin.campo }).then(json => {
                    setCantidad(json.data)
                })
            }
        }





        const verSolicitud = async (dato) => {
            setIndice(0)
            setIndiceVer(0)

            let today = new Date()
            let fecha = today.toISOString().split('T')[0]
            let hora = new Date().toLocaleTimeString()
            await axios.post(URL + '/solicitudL/verL', { dato: dato, fecha: fecha, hora: hora }).then(json => {
                let data = []
                json.data[0].forEach(element => {
                    data.push(element.codigo)
                });
                console.log(data, 'codigo de la solicitud')

                let sel = data.filter((item, index) => {
                    return data.indexOf(item) === index
                })
                setCodigo(sel)
                setSolicitud(json.data[0])
                setRol(json.data[1])
                setVentana(2)
                console.log(json.data[0], 'Datos de la silicitudsssssssssssssss')
            })
        }
























        const listarIntervalos = async (codigo) => {

            if (codigo != null) {
                axios.post(URL + '/intervalo/listarporcodigo', { codigo: codigo }).then(json => {
                    setIntervalo(json.data)
                })
            }
        }



        const cargarPermisos = async (item = null) => {

            if (solicitud.length > 0) {
                if (rol === 3) {
                    setModalLaboratorio(true)
                    listarIntervalos(solicitud[0].codigoSol)
                    abrirFormulario()
                }

                if (rol === 4) {
                    setModalTransfusional(true)
                }

                if (rol > 4 && rol < 9) {
                    // Se listan las imagens que ya fueron actualizados en la base de datos
                    setObs(item.obs)
                    axios.post(URL + '/solicitudL/listarImagenes', { id: item.id }).then(json => {
                        setFileNames(json.data)
                        setArea({ campo: json.data[0].obs, valido: 'true' })
                    })
                    setVentana(3)
                }
            }
        }


        const abrirFormulario = () => {
            setTimeout(() => {
                solicitud.forEach(ele => {
                    let i = solicitud.findIndex(e => e.id === ele.id)
                    document.getElementById(ele.id + 'resultado').value = solicitud[i].resultado
                    document.getElementById(ele.id + 'intervalo').value = solicitud[i].intervalo
                })
            }, 700)
        }




        const guardarResultadosLaboratorio = () => {
            let res = true
            // alert('entes del bucle')
            solicitud.forEach(ele => {
                if ((document.getElementById(ele.id + 'resultado').value != '') && (document.getElementById(ele.id + 'intervalo').value == '') ||

                    (document.getElementById(ele.id + 'resultado').value == '') && (document.getElementById(ele.id + 'intervalo').value != '')) {
                    res = false
                    // console.log(document.getElementById(ele.id + 'intervalo').value, 'intervalo')
                }
            })

            if (res) {
                solicitud.forEach(ele => {
                    let i = solicitud.findIndex(e => e.id === ele.id)
                    if (document.getElementById(ele.id + 'resultado').value != '' && document.getElementById(ele.id + 'intervalo').value != '') {
                        solicitud[i].resultado = document.getElementById(ele.id + 'resultado').value
                        solicitud[i].intervalo = parseInt(document.getElementById(ele.id + 'intervalo').value)
                    }
                    else {
                        solicitud[i].resultado = null
                        solicitud[i].intervalo = null
                    }
                })

                axios.post(URL + '/solicitudL/grabarResultadosLaboratorio', {
                    solicitud: solicitud,
                    url: localStorage.getItem('url'),
                    fechaHoraPublicacionRes: fecha + ' ' + new Date().toLocaleTimeString()
                }).then(json => {
                    setSolicitud(json.data.data)
                    setMensaje(json.data.msg)
                    toast.success('Registro Guardado')
                    setModalLaboratorio(false)
                })
            }
            else toast.error("Si introduce el resultado tambien deberá seleccionar el intevalo o viceversa")
        }





        const repotarResultadoLaboraotrio = async () => {

            let res = true
            solicitud.forEach(ele => {
                let i = solicitud.findIndex(e => e.id === ele.id)
                if (solicitud[i].resultado == null && solicitud[i].intervalo == null) {
                    res = false
                }
            })
            if (res) {
                let today = new Date()
                let fecha = today.toISOString().split('T')[0]
                await axios.post(URL + '/solicitudL/reportarResultados', { codigo: solicitud[0].codigoSol, fecha: fecha + ' ' + new Date().toLocaleTimeString() }).then(json => {
                    setSolicitud(json.data[0])
                    setRol(json.data[1])
                    toast.success('Reporte exitoso')
                    listar()
                    setVentana(1)
                })
            }
        }


        const enviarImagen = async () => {
            console.log(file)
            if (file !== null) {
                const formatoData = new FormData()
                formatoData.append('resultado', file)

                let hora = new Date().toLocaleTimeString().split(':')[0]
                let min = new

                    Date().toLocaleTimeString().split(':')[1]
                let sec = new Date().toLocaleTimeString().split(':')[2]
                if (hora < 10) hora = '0' + hora
                let horafinal = hora + min + sec

                axios.post(URL + '/solicitudL/insertarResultadoImagen', formatoData, {
                    params: {
                        'id': item.id, 'nombreArchivo': item.id + item.codigoSol + '' + horafinal, 'codigo': item.codigoSol, obs: area.campo
                    }
                }).then(j => {
                    // console.log(j.data, 'datos de la imagen')
                    setFileNames(j.data[0])
                    setSolicitud(j.data[1])
                    setFile(null)
                    document.getElementsByName('imagenFile').value = null
                    setArea({ campo: null, valido: null })
                })
            } else toast.error('Debes cargar un archivo')
        }

        const eliminarImagen = async (imagen) => {
            let ok = window.confirm('Desea eliminar esta imagen?')
            if (ok) {
                axios.post(URL + '/solicitudL/eliminarImagen', { imagen: imagen, codigo: item.codigoSol, id: item.id }).then(j => {
                    setFileNames(j.data[0])
                    setSolicitud(j.data[1])
                    setFile(null)
                })
            }
        }









        // if (item) console.log(item, 'item cargado')



        return (
            <div>
                <div className="hold-transition sidebar-mini">
                    <div className="wrapper">
                        <Home />
                        <div className="content-wrapper">
                            <div className="content">
                                <div className="container-fluid ">
                                    <div className="page-wrapper mt-2" style={{ marginTop: '5px', background: '#e9eeeb' }}>




















                                        {
                                            ventana === 1 &&
                                            <>
                                                {
                                                    ventana === 1 && <div className='titloFormulario' >
                                                        Solicitudes entrantes
                                                    </div>
                                                }
                                                <div className='row p-1'>
                                                    <div className=' col-12 col-xl-10 col-lg-10 col-md-10 col-sm-12'>
                                                        {/* <div className="row mt-2 mb-2">
                                                            
                                                            <div className='col-12 col-xl-7 col-lg-7 col-md-7 col-sm-7'>
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

                                                        </div> */}





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




                                                        {/* <br /> */}
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
                                            </>
                                        }

















                                        {
                                            ventana === 2 &&
                                            <div >
                                                <VerSolicitudComplementarios solicitud={solicitud} cerrar={setVentana} openForm={cargarPermisos}
                                                    reportar={repotarResultadoLaboraotrio} rol={rol} setItem={setItem} />
                                            </div>
                                        }





                                        {
                                            ventana === 3 &&
                                            <div style={{ height: 'auto' }}>
                                                <div className='titloFormulario' >
                                                    Resultados
                                                </div>
                                                {item &&
                                                    <div>
                                                        <div className='row p-2'>
                                                            <div className='col-8'>
                                                                <p className='medicoList' style={{ textAlign: 'left' }}><strong> {'PAC. ' + item.paciente}</strong></p>
                                                                <p className='diagnosticoList'> {'DIAGNOSTICO: ' + item.diagnostico}</p>
                                                                <p className='nhcList'> {'NUMERO HISTORIAL CLINICO ' + item.nhc}</p>
                                                            </div>
                                                            <div className='col-4'>
                                                                <p className='medicoList' style={{ textAlign: 'left' }}><strong> {'SERVICIO SOLICITADO : ' + item.servicioSolicitado}</strong></p>
                                                                <p className='codigoSolList'> {'CODIGO ' + item.codigoSol}</p>
                                                            </div>
                                                        </div>
                                                        <div className='row pt-2'>
                                                            {item.resultadoRecibido === 0 &&
                                                                <>
                                                                    <div className='col-5'>
                                                                        <ComponenteInputFile
                                                                            estado={file}
                                                                            cambiarEstado={setFile}
                                                                            name='imagenFile'
                                                                            // etiqueta={'seleccionar imagen'}
                                                                            ExpresionRegular={INPUT.IMG}
                                                                        />
                                                                    </div>

                                                                    <div className='col-6'>
                                                                        <div className="row p-2" >
                                                                            <div className="col-auto" >
                                                                                <Button className=' Historial ' onClick={() => enviarImagen()}>Subir imagen <span className='btnNuevoIcono'><FontAwesomeIcon icon={faUpload}></FontAwesomeIcon></span> </Button>
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                    <div className='col-5'>
                                                                        <ComponenteInputUserArea
                                                                            estado={area}
                                                                            cambiarEstado={setArea}
                                                                            name='area'
                                                                            placeholder={'Observaciones'}
                                                                            etiqueta={'Observaciones'}
                                                                            ExpresionRegular={INPUT.DIRECCION}
                                                                        />
                                                                    </div>
                                                                </>
                                                            }
                                                        </div>
                                                    </div>
                                                }
                                                <div className='col-12  table-responsive custom mt-3' style={{ height: '370px' }}>


                                                    {fileNames.length > 0 && <div className=' p-2 mt-2 m-0 ' style={{ background: 'rgb(42, 42, 42)'}}>
                                                        <div className='gallery-container'>
                                                            {fileNames.map((e) => (
                                                                e.idSolicitud === item.id &&
                                                                <div className='gallery__item' key={e.idSolicitud}>
                                                                    <img src={URL + '/' + e.imagen} alt={'...'} className='gallery__img' onClick={() => { setImagen(e.imagen); setVentana(4) }} />
                                                                    {item.resultadoRecibido === 0 && <h1 className=' gallery__title ' onClick={() => eliminarImagen(e.imagen)}
                                                                    >QUITAR IMAGEN <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon></h1>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    }

                                                </div >
                                                {obs && <p className='nhcList' style={{ color: '#dc3545', textAlign: 'right' }}><span className='btnNuevoIcono' ><FontAwesomeIcon icon={faExclamation} style={{ color: '#dc3545' }}></FontAwesomeIcon></span> {obs}</p>}
                                                <div className="row p-2" >
                                                    <div className="col-auto">
                                                        <Button className='  cancelarVentanaSolicitud' onClick={() => setVentana(2)} >Cerrar <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        }


                                        {
                                            ventana === 4 && <div >
                                                {/* <div className='p-1 pt-0'> */}
                                                <article className='light-box pt-1'>
                                                    <p className='medicoList' style={{ textAlign: 'left', color: 'white', paddingLeft: '44px' }}><strong> {'PAC. ' + item.paciente}</strong></p>

                                                    <img src={URL + '/' + imagen} alt={'...'} className='gallery__imgModal' />
                                                    <div className="row p-2" >
                                                        <div className="col-auto" style={{ paddingLeft: '40px' }}>
                                                            <Button className='  cancelarVentanaSolicitud' onClick={() => setVentana(3)} >CERRAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                                        </div>
                                                        <div className="col-auto" style={{ paddingLeft: '40px' }}>
                                                            <p className='medicoList' style={{ textAlign: 'left', color: 'white', paddingLeft: '44px' }}><strong> {'DIAGNOSTICO : ' + item.diagnostico}</strong></p>
                                                            <p className='medicoList' style={{ textAlign: 'left', color: 'white', paddingLeft: '44px' }}><strong> {'ESTUDIO REALIZADO : ' + item.servicioSolicitado}</strong></p>

                                                        </div>
                                                        <div className="col-auto" style={{ paddingLeft: '40px' }}>
                                                        </div>
                                                    </div>
                                                </article>
                                            </div>
                                        }













                                        {
                                            <Modal isOpen={modalLaboratorio}>
                                                <div className='titloFormulario pb-0' >
                                                    RESULTADOS
                                                </div>
                                                <ModalBody>

                                                    {solicitud.length > 0 &&
                                                        <div className='row pb-1'>
                                                            <div className='col-8'>
                                                                <p className='medicoList' style={{ textAlign: 'left' }}><strong> {'PAC. ' + solicitud[0].paciente}</strong></p>
                                                                <p className='diagnosticoList'> {'DIAGNOSTICO: ' + solicitud[0].diagnostico}</p>
                                                                <p className='nhcList'> {'NUMERO HISTORIAL CLINICO ' + solicitud[0].nhc}</p>
                                                            </div>
                                                            <div className='col-4'>
                                                                <p className='codigoSolList'> {'CODIGO ' + solicitud[0].codigoSol}</p>
                                                            </div>
                                                        </div>
                                                    }
                                                    <div className='col-12  table-responsive custom' style={{ height: '430px' }}>
                                                        <div className='row'>
                                                            <div className='col-7'>
                                                                <p className='diagnostico'><strong> {'Resultados'}</strong></p>
                                                            </div>
                                                            <div className='col-5'>
                                                                <p className='diagnostico'><strong> {'Intervalo de referencia'}</strong></p>
                                                            </div>
                                                        </div>

                                                        {
                                                            codigo.map(cod => (
                                                                solicitud.map(input => (
                                                                    cod === input.codigo &&
                                                                    <div key={input.id} className="field ">
                                                                        {
                                                                            // input.encabezado === 0 &&
                                                                            <div className='row'>

                                                                                {
                                                                                    input.encabezado === 1 && <div className='col-7'>
                                                                                        <label>  {input.servicioSolicitado + ' : *'}  </label>
                                                                                        <InputTabla className="form-control form-control-sm" id={input.id + 'resultado'} style={{ border: '1px solid #007286' }} />
                                                                                    </div>
                                                                                }

                                                                                {input.encabezado === 0 && <div className='col-7'>
                                                                                    <label>  {input.servicioSolicitado + ' : *'}  </label>
                                                                                    <InputTabla className="form-control form-control-sm" id={input.id + 'resultado'} style={{ border: '1px solid #007286' }} />
                                                                                </div>}

                                                                                <div className='col-5' >
                                                                                    <div className="field">
                                                                                        <label>  Intervalo *  </label>
                                                                                        {input.encabezado === 0 && <Select className="form-control form-control-sm" id={input.id + 'intervalo'} style={{ border: '2px solid #17a2b8' }}  >
                                                                                            <option></option>
                                                                                            {
                                                                                                intervalo.map((i) => (
                                                                                                    i.idItemServicio === input.idItemServicio &&
                                                                                                    <option key={i.id} value={i.id} id={i.id + 'opcion-inter'}>{i.descripcion}</option>
                                                                                                ))}

                                                                                        </Select>}

                                                                                        {input.encabezado === 1 &&

                                                                                            <Select className="form-control form-control-sm" id={input.id + 'intervalo'} style={{ border: '2px solid #17a2b8' }}  >
                                                                                                <option></option>
                                                                                                {
                                                                                                    intervalo.map((i) => (
                                                                                                        i.idItemServicio === input.idItemServicio &&
                                                                                                        <option key={i.id} value={i.id} id={i.id + 'opcion-inter'}>{i.descripcion}</option>
                                                                                                    ))}

                                                                                            </Select>
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                ))
                                                            ))
                                                        }

                                                    </div >
                                                </ModalBody>



                                                <div className="row p-2" >
                                                    <div className="col-auto">
                                                        <Button className='  cancelarVentanaSolicitud' onClick={() => setModalLaboratorio(false)} >CANCELAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                                    </div>
                                                    <div className="col-auto" >
                                                        <Button className='  Historial' onClick={() => guardarResultadosLaboratorio()}>ACTUALIZAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></span> </Button>
                                                    </div>
                                                </div>
                                            </Modal>
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>




                <Modal isOpen={modalTransfusional}>
                    <ModalBody>
                        <form>
                            <div className="row">
                                <div>
                                    <h3>Modificar Registro</h3>
                                </div>
                                <div className='col-12'>
                                    <ComponenteInputfecha
                                        estado={fechaHoy}
                                        cambiarEstado={setFechaHoy}
                                        name="fechaSolicitud"
                                        ExpresionRegular={INPUT.FECHA}  //expresion regular
                                        etiqueta='fecha analisis'
                                    />
                                </div>
                                <div className="form-group col-12 mb-2 mt-1 pl-1">
                                    <ComponenteInputUserArea
                                        estado={resultado}
                                        cambiarEstado={setResultado}
                                        name="resultado"
                                        placeholder="DESCRIPCION"
                                        ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                        etiqueta='Descripcion detallada del Servicio'
                                    />
                                </div>

                            </div>
                        </form>
                    </ModalBody>
                    <div className="card-footer clearfix" style={{ paddingTop: '0px' }}>
                        <ul className="pagination pagination-sm m-0 float-right">
                            <button className='info' style={{ marginRight: '5px' }}>GUARDAR</button>
                            <button className='danger' onClick={() => setModalTransfusional(false)} >Cancelar</button>
                        </ul>
                    </div>
                </Modal>
















                <Toaster position='top-right' />
            </div >

        );
    } catch (error) {
        auth.logout()
    }
}
export default Resultados;

