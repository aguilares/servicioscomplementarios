
import React from 'react';

import { Link } from 'react-router-dom';
import { Button, Modal, ModalBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faList, faArrowRight, faNotesMedical, faCheckSquare, faMicroscope, faCaretLeft, faUserPlus, faSave, faSearch, faExclamation, } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../Auth/useAuth"
import {
    Select1, ComponenteInputUser, ComponenteInputfecha, ComponenteInputfechaBuscar, ComponenteInputUserCodigo,
    ComponenteInputHora, ComponenteInputUserDisabledRow, ComponenteInputUserRow, ComponenteInputUserDisabled, SelectRow, ComponenteCheck,
    ComponenteInputBuscarSolicitud, VerSolicitud, GenerarPdf, GenerarPdfTransfusional, ComponenteInputBuscar
} from './elementos/input';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados
import Home from './elementos/home'
import { useState } from "react";
import { URL, INPUT } from '../Auth/config';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast'


function Solicitar() {

    const [pacienteSolicitud, setPacienteSolicitud] = useState([])
    const [sexos] = useState([{ id: "M", nombre: "Masculino" }, { id: "F", nombre: "Femenino" }]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [idPacienteRegistro, setIdPacienteRegistro] = useState({ campo: '', valido: null })
    const [ciPaciente, setCiPaciente] = useState({ campo: '', valido: null })
    const [nombre, setNombre] = useState({ campo: '', valido: null })
    const [apellidoPat, setApellidoPat] = useState({ campo: '', valido: null })
    const [apellidoMat, setApellidoMat] = useState({ campo: '', valido: null })
    const [nhcRegistro, setNhcRegistro] = useState({ campo: null, valido: null })
    const [fechaNacRegistro, setFechaNacRegistro] = useState({ campo: '', valido: null })
    const [sexoRegistro, setSexoRegistro] = useState({ campo: '', valido: null })
    const [telefono, setTelefono] = useState({ campo: '', valido: null })
    const [direccion, setDireccion] = useState({ campo: '', valido: null })
    const [inputBuscar, setInputBuscar] = useState({ campo: '', valido: null })
    const [pacienteCardex, setPacienteCardex] = useState(null)
    const [idPacienteCardex, setIdPacienteCardex] = useState(null)
    const [campoCodigoPacienteCardex, setCampoCodigoPacienteCardex] = useState({ campo: null, valido: null })
    const [campoFechaPacienteCardex, setCampoFechaPacienteCardex] = useState({ campo: null, valido: null })
    const [obs, setObs] = useState(null)

    const [ventana, setVentana] = useState(1)
    const [privilegios, setPrivilegios] = useState(0)
    const [rol, setRol] = useState(0)
    const [fileNames, setFileNames] = useState([]);
    const [item, setItem] = useState(null)
    const [imagen, setImagen] = useState(null)






















    const [solicitud, setSolicitud] = useState([])
    const [informe, setInforme] = useState([])
    const [laboratorio, setLaboratorio] = useState([])
    const [cantidad, setCantidad] = useState([])
    const [seguros, setSeguros] = useState([])
    const [servicio, setServicio] = useState([])
    const [verListaExamen, setVerListarExamen] = useState(false)
    const [idServicio, setIdServicio] = useState({ campo: null, valido: null })
    const [examenesSeleccionados, setExamenesSeleccionados] = useState([])
    const [examenesSeleccionadosMostrar, setExamenesSeleccionadosMostrar] = useState([])
    // const [mensaje, setMensaje] = useState(null)




    const [examen, setExamen] = useState([])

    let fecha = new Date().toLocaleDateString()
    let año = fecha.split('/')[2]
    let mes = fecha.split('/')[1]
    let dia = fecha.split('/')[0]
    if (mes < 10) {
        mes = 0 + '' + mes
    }
    if (dia < 10) {
        dia = 0 + '' + dia

    }
    const [fechaSolicitud, setFechaSolicitud] = useState({ campo: año + '-' + mes + '-' + dia, valido: 'true' })
    const [codigoSol, setCodigoSol] = useState(null)
    const [idPaciente, setIdPaciente] = useState(null)
    const [ci, setCi] = useState({ campo: null, valido: null })
    const [edad, setEdad] = useState({ campo: null, valido: null })
    const [sexo, setSexo] = useState({ campo: null, valido: null })
    const [nhc, setNhc] = useState({ campo: null, valido: null })
    const [fechaNac, setFechaNac] = useState({ campo: null, valido: null })
    const [nombrePaciente, setNombrePaciente] = useState({ campo: null, valido: null })
    const [diagnostico, setDiagnostico] = useState({ campo: null, valido: null })
    let hora = new Date().toLocaleTimeString()
    let uno = hora.split(":")[0]
    let dos = hora.split(":")[1]
    let tres = hora.split(":")[2]
    if (uno < 10)
        uno = '0' + uno

    const [HoraSolicitud, setHoraSolicitud] = useState({ campo: uno + ':' + dos + ':' + tres, valido: 'true' })
    const [idSeguro, setIdseguro] = useState({ campo: null, valido: null })

    const [modalResult, setModalResult] = useState(false)
























    const auth = useAuth()
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

        const vaciarDatos = () => {
            setIdPacienteRegistro({ campo: '', valido: null })
            setCiPaciente({ campo: '', valido: null })
            setNombre({ campo: '', valido: null })
            setApellidoPat({ campo: '', valido: null })
            setApellidoMat({ campo: '', valido: null })
            setFechaNacRegistro({ campo: '', valido: null })
            setNhcRegistro({ campo: null, valido: null })

            setSexoRegistro({ campo: '', valido: null })
            setTelefono({ campo: '', valido: null })
            setDireccion({ campo: '', valido: null })
        }


        const rellenar = async (ids) => {
            setIdPacienteRegistro({ campo: ids.id, valido: 'true' })
            setCiPaciente({ campo: ids.ci, valido: 'true' })
            setNombre({ campo: ids.nombre, valido: 'true' })
            setApellidoPat({ campo: ids.apellidoPaterno, valido: 'true' })
            setApellidoMat({ campo: ids.apellidoMaterno, valido: 'true' })
            setNhcRegistro({ campo: ids.nhc, valido: 'true' })
            setFechaNacRegistro({ campo: ids.fechaNac, valido: 'true' })
            setSexoRegistro({ campo: ids.sexo, valido: 'true' })
            setTelefono({ campo: ids.telefono, valido: 'true' })
            setDireccion({ campo: ids.direccion, valido: 'true' })
            setModalEditar(true)

        }


        const insertarPaciente = async (e) => {

            if (ciPaciente.valido === 'true' && nombre.valido === 'true' && apellidoPat.valido === 'true' &&
                apellidoMat.valido === 'true' && fechaNacRegistro.valido === 'true' &&
                sexoRegistro.valido === 'true' && telefono.valido === 'true' && direccion.valido === 'true') {
                let today = new Date()
                let fecha = today.toISOString().split('T')[0]
                axios.post(URL + '/paciente/insertar', {
                    ci: ciPaciente.campo,
                    nombre: nombre.campo,
                    apellidoPaterno: apellidoPat.campo,
                    apellidoMaterno: apellidoMat.campo,
                    nhc: nhcRegistro.campo,
                    fechaNac: fechaNacRegistro.campo,
                    sexo: sexoRegistro.campo,
                    telefono: telefono.campo,
                    direccion: direccion.campo,
                    creado: fecha + ' ' + new Date().toLocaleTimeString()
                }).then(json => {
                    if (json.data.ok) {
                        setPacienteSolicitud(json.data.data)
                        vaciarDatos()
                        setModalInsertar(false)
                        toast.success("Registro Guardado correctamente")

                    }
                    else
                        toast.error(json.data.msg)
                })

            } else {
                toast.error('formulario incompleto')
            }
        }


        const actualizarPaciente = async (e) => {
            if (idPacienteRegistro.valido === 'true' && ciPaciente.valido === 'true' && nombre.valido === 'true' && apellidoPat.valido === 'true' &&
                apellidoMat.valido === 'true' && fechaNacRegistro.valido === 'true' && sexoRegistro.valido === 'true' &&
                telefono.valido === 'true' && direccion.valido === 'true') {
                console.log('pasa validaciones')

                let today = new Date()
                let fecha = today.toISOString().split('T')[0]
                axios.post(URL + '/paciente/actualizar', {
                    id: idPacienteRegistro.campo,
                    ci: ciPaciente.campo,
                    nombre: nombre.campo,
                    apellidoPaterno: apellidoPat.campo,
                    apellidoMaterno: apellidoMat.campo,
                    nhc: nhcRegistro.campo,
                    fechaNac: fechaNacRegistro.campo,
                    sexo: sexoRegistro.campo,
                    telefono: telefono.campo,
                    direccion: direccion.campo,
                    modificado: fecha + ' ' + new Date().toLocaleTimeString()
                }).then(json => {
                    if (json.data.ok) {
                        setPacienteSolicitud(json.data.data)
                        vaciarDatos()
                        setModalEditar(false)
                        toast.success("Registro actualizado correctamente")

                    }
                    else
                        toast.error(json.data.msg)
                })
            } else {
                toast.error('formulario incompleto')
            }
        }


        const buscarPaciente = () => {
            if (inputBuscar.valido === 'true') {
                axios.post(URL + '/paciente/buscar', { dato: inputBuscar.campo }).then(json => {
                    setPacienteSolicitud(json.data)
                    if (json.data.length === 0) toast.error('No se encontraron registro')
                })
            }
        }

























        const historialPaciente = async (id = null) => {
            if (id != null) {
                await axios.post(URL + '/solicitudS/cardex', { id: id.id }).then(json => {
                    setCantidad(json.data)
                    setPacienteCardex(id.nombre + ' ' + id.apellidoPaterno + ' ' + id.apellidoMaterno)
                    setIdPacienteCardex(id.id)
                    setVentana(3)
                })
            }
        }

        const buscarhistorialEspecifico = async () => {
            if (campoCodigoPacienteCardex.valido === 'true' || campoFechaPacienteCardex.valido === 'true') {
                let dato = null
                if (campoCodigoPacienteCardex.valido === 'true') {
                    dato = campoCodigoPacienteCardex.campo
                }
                if (campoFechaPacienteCardex.valido === 'true') {
                    dato = campoFechaPacienteCardex.campo
                }
                await axios.post(URL + '/solicitudS/cardexEspecifico', { id: idPacienteCardex, campo: dato }).then(json => {
                    setCantidad(json.data)
                    setVentana(3)
                })
            }
        }


        const buscarPacienteSolicitud = async (ci = null) => {

            if (ci != null) {

                await axios.post(URL + '/paciente/buscar', { dato: ci }).then(json => {

                    if (json.data.length > 0) {
                        setIdPaciente(json.data[0].id) // el atributo .id consuce directamente a un error de modo que cuando no se encuentre ningun registro para dicho ci 
                        setCi({ campo: json.data[0].ci, valido: 'true' })
                        setNombrePaciente({ campo: json.data[0].nombre + ' ' + json.data[0].apellidoPaterno + ' ' + json.data[0].apellidoMaterno, valido: 'true' })
                        setNhc({ campo: json.data[0].nhc, valido: 'true' })
                        setSexo({ campo: json.data[0].sexo, valido: 'true' })
                        setFechaNac({ campo: json.data[0].fechaNac.split('T')[0], valido: 'true' })
                        let hoy = new Date()
                        let antes = new Date(json.data[0].fechaNac) // formato: yyyy-MM-dd
                        let edad1 = hoy.getFullYear() - antes.getFullYear()
                        let mes = hoy.getMonth() - antes.getMonth()
                        if (mes < 0 || (mes === 0 && hoy.getDate() < antes.getDate())) {
                            edad1--
                        }
                        if (edad1 < 1)
                            edad1 = 'TODAVIA NO CUMPLE'
                        setEdad({ campo: edad1, valido: 'true' })
                        setVentana(4)
                        // console.log('Paciente: ', json.data)
                        cargarServicio()
                        listaSeguro()
                    }
                })
            }
        }


        const listaSeguro = async () => {

            axios.post(URL + '/solicitudS/seguro').then(json => {
                setSeguros(json.data)
            })
        }







        const vaciarFormulario = () => {
            setIdPaciente(null)
            setCodigoSol(null)
            setCi({ campo: null, valido: null })
            setEdad({ campo: null, valido: null })
            setSexo({ campo: null, valido: null })
            setNhc({ campo: null, valido: null })
            setFechaNac({ campo: null, valido: null })
            setNombrePaciente({ campo: null, valido: null })
            setDiagnostico({ campo: null, valido: null })
            setIdseguro({ campo: null, valido: null })
            setIdServicio({ campo: null, valido: null })
            setExamenesSeleccionados([])
            setExamen([])
        }


        const verSolicitud = async (dato) => {

            await axios.post(URL + '/solicitudS/ver', { dato: dato }).then(json => {
                setSolicitud(json.data[0])
                setPrivilegios(json.data[1])

                // console.log('priveliegiosd en componente solicitar: ', json.data[1])
                setPacienteCardex(json.data[0][0].paciente)
                setRol(json.data[0][0].rol)
                setVentana(5)
                // CARGA LA LISTA DELHISTORIAL DEL PACIENTE, CON LA NUEVA SOLICITUD SE ACTUALIZARÁ el historial
                axios.post(URL + '/solicitudS/cardex', { id: json.data[0][0].idPaciente }).then(json => {
                    setCantidad(json.data)
                })
            })

        }
        const abandonarVentanaVer = () => {
            setVentana(3)
            setSolicitud([])
            setSolicitud([])
        }
        const abandonarFormularioEditar = () => {
            setExamenesSeleccionados([])
            setVerListarExamen(false)
            setExamenesSeleccionadosMostrar([])
            setVentana(5)
            setIdServicio({ campo: null, valido: null })
        }
        const abandonarFormularioInsertar = () => {
            setIdServicio({ campo: null, valido: null })
            setExamenesSeleccionadosMostrar([])
            setExamenesSeleccionados([])

            setVentana(1)
        }


        const actualizarSolicitud = () => {
            setCodigoSol(solicitud[0].codigoSol)
            setCi({ campo: solicitud[0].ci, valido: 'true' })
            setIdPaciente(solicitud[0].idPaciente)
            setFechaNac({ campo: solicitud[0].fechaNac, valido: 'true' })
            setFechaSolicitud({ campo: solicitud[0].fecha, valido: 'true' })
            setHoraSolicitud({ campo: solicitud[0].horaSol, valido: 'true' })
            setNombrePaciente({ campo: solicitud[0].paciente, valido: 'true' })
            setDiagnostico({ campo: solicitud[0].diagnostico, valido: 'true' })
            let hoy = new Date()
            let antes = new Date(solicitud[0].fechaNac) // formato: yyyy-MM-dd
            let edad1 = hoy.getFullYear() - antes.getFullYear()
            let mes = hoy.getMonth() - antes.getMonth()
            if (mes < 0 || (mes === 0 && hoy.getDate() < antes.getDate())) {
                edad1--
            }
            setEdad({ campo: edad1, valido: 'true' })
            setSexo({ campo: solicitud[0].sexo, valido: 'true' })
            setIdseguro({ campo: solicitud[0].idSeguro, valido: 'true' })
            setNhc({ campo: solicitud[0].nhc, valido: 'true' })
            // setIdServicio({ campo: solicitud[0].idServicio, valido: 'true' })
            cargarServicio()
            listaSeguro()
            setVentana(4)
            solicitud.forEach(x => {
                examenesSeleccionados.push(x.idItemServicio)  // ASIGNMOS EN EXAMENS SELECCIONADOS EL ID DE LOS ITEMS SOLICITADOS
            })
            listarExamenes(solicitud[0].idServicio)
            // asignarExamenesSeleccionados()
        }


        const cargarServicio = async () => {

            await axios.post(URL + '/solicitudS/servicio').then(json => {
                setServicio(json.data)
                // console.log(json.data[0], 'id Servicio')
                // listarExamenes(json.data[0].id)
                // setIdServicio({ campo: json.data[0].id, valido: 'true' })
                if (solicitud.length > 0)
                    setIdServicio({ campo: solicitud[0].idServicio, valido: 'true' })
                else
                    setIdServicio({ campo: json.data[0].id, valido: 'true' })


                // console.log(json.data)
            })
        }





        const listarExamenes = async (id = null) => {
            // setIdServicio({ campo: id, valido: 'true' })
            const ids = idServicio.campo || id
            if (id === null) {
                setExamenesSeleccionados([])
            }
            if (ids !== null) {

                await axios.post(URL + '/solicitudS/item', { id: ids }).then(json => {
                    setExamen(json.data)
                    // console.log(examenesSeleccionados, 'examenes seleccionados')

                    let data = []
                    examenesSeleccionados.forEach(x => {
                        json.data.forEach(y => {
                            if (x === y.idItemServicio) {
                                data.push({ nombre: y.servicioSolicitado })
                                // console.log(y)
                                // document.getElementById(y.idItemServicio).

                            } else {
                            }
                        })
                    })

                    // console.log(data, 'examens seleccinados para mostrar')
                    setExamenesSeleccionadosMostrar(data)






















                    // if (solicitud.length === 0) {
                    //     setExamen(json.data)
                    // } else {

                    //     let data = []
                    //     let c = 0
                    //     json.data.forEach(x => {
                    //         solicitud.forEach(y => {
                    //             if (y.idItemServicio === x.idItemServicio) {

                    //                 data.push({ id: x.idItemServicio, item: x.servicioSolicitado, checked: true })
                    //                 delete (json.data[c])
                    //             }
                    //         })
                    //         c++
                    //     })
                    //     json.data.forEach(dato =>{
                    //         data.push({id: dato.idItemServicio, item: dato.servicioSolicitado, checked: false})
                    //     })
                    //     setInputChecked(data)
                    // }
                    // setExamenesSeleccionados([])








                })
            }
        }



        const asignarExamenesSeleccionados = async () => {
            setExamenesSeleccionadosMostrar([])
            let data = []
            examenesSeleccionados.forEach(x => {
                examen.forEach(y => {
                    // console.log(x, y)


                    if (x === y.idItemServicio) {
                        data.push({ nombre: y.servicioSolicitado })
                    }

                })
            })
            setExamenesSeleccionadosMostrar(data)
        }














        const registrar = async () => {
            // console.log(fechaSolicitud, HoraSolicitud, idSeguro, diagnostico, 'idPaciente: ',idPaciente)
            if (fechaSolicitud.valido === 'true' && HoraSolicitud.valido === 'true' && idSeguro.valido === 'true' &&
                diagnostico.valido === 'true' && idPaciente !== null) {
                let seleccionExamen = []
                let ce = 0
                examenesSeleccionados.forEach(adm => {
                    if (adm !== null) {
                        seleccionExamen[ce] = adm
                        ce++
                    }
                });
                // console.log(fechaSolicitud, HoraSolicitud, idSeguro, diagnostico, idPaciente, seleccionExamen)

                if (seleccionExamen.length > 0) {
                    await axios.post(URL + '/solicitudS/listarexamen', { examen: seleccionExamen }).then(
                        json => {
                            // console.log('data final',json.data)
                            axios.post(URL + '/solicitudS/registrarS', {
                                fecha: fechaSolicitud.campo,
                                hora: HoraSolicitud.campo,
                                diagnostico: diagnostico.campo,
                                seguro: idSeguro.campo,
                                paciente: idPaciente,
                                examen: json.data
                            }).then(json => {
                                // console.log(json.data.codigo, '  codigo')
                                verSolicitud(json.data.codigo)
                                setExamenesSeleccionadosMostrar([])
                                vaciarFormulario()
                                toast.success("Operacion exitoso")

                            })
                        }
                    )
                }
                else {
                    toast.error("Seleccione almenos un servicio")
                }
            }
            else {
                toast.error("Formulario incompleto")
            }
        }







        const actualizar = async () => {
            if (fechaSolicitud.valido === 'true' && HoraSolicitud.valido === 'true' && idSeguro.valido === 'true' &&
                nhc.valido === 'true' && diagnostico.valido === 'true' && idPaciente !== null && codigoSol !== null) {
                let seleccionExamen = []
                let ce = 0
                console.log('examens seleccionados : ', examenesSeleccionados)
                examenesSeleccionados.forEach(adm => {
                    if (adm !== null) {
                        seleccionExamen[ce] = adm
                        ce++
                    }
                });
                console.log('lista afinado : ', seleccionExamen)
                if (seleccionExamen.length > 0) {
                    console.log('dentro del bucle')
                    await axios.post(URL + '/solicitudS/listarexamen', { examen: seleccionExamen }).then(  //OPBETENER LISTA DE LOS EXAMENES DE DICHA CATEGORIA
                        json => {
                            console.log(json.data, 'Datos de la bd')
                            axios.post(URL + '/solicitudS/actualizarS', {
                                codigoSol: codigoSol,
                                fecha: fechaSolicitud.campo,
                                hora: HoraSolicitud.campo,
                                diagnostico: diagnostico.campo,
                                seguro: idSeguro.campo,
                                paciente: idPaciente,
                                examen: json.data
                            }).then(json => {
                                if (json.data.msg == null) {
                                    console.log(json.data, 'operacion exitosa')
                                    setSolicitud(json.data)
                                    abandonarFormularioEditar()
                                    vaciarFormulario()
                                    toast.success("Operacion Exitoso")
                                } else {
                                    toast.error(json.data.msg)
                                }

                            })
                        })
                }
                else {
                    toast.error('Seleccione almenos un servicio')
                }
            }
            else {
                toast.error('Formulacion incompleto')
            }
        }

        const eliminarSolicitud = () => {
            const ok = window.confirm('DESEA ELIMINAR ESTE REGISTRO ?')
            if (ok && solicitud[0].codigoSol !== null) {
                axios.post(URL + '/solicitudS/eliminarS', { codigoSol: solicitud[0].codigoSol, id: solicitud[0].idPaciente }).then(json => {
                    setCantidad(json.data)
                })
                setVentana(3)
                setSolicitud([])
                toast.success("Operacion Exitoso")
            }
        }


        const generarInforme = async (movil = false) => {

            console.log('gfenerar informe', rol)
            // alert('test', rol)

            if (solicitud[0].codigoSol && (rol === 3 || rol === 4)) {

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
                            // console.log('abrir pdf')
                            if (rol === 3) setVentana(6)
                            if (rol === 4) setVentana(7)
                        }
                    }

                })
            }

            if (solicitud[0].codigoSol && (rol > 3 && rol < 9)) {

                let today = new Date()
                let fecha = today.toISOString().split('T')[0]
                let hora = new Date().toLocaleTimeString().split(':')[0]
                let min = new Date().toLocaleTimeString().split(':')[1]
                let sec = new Date().toLocaleTimeString().split(':')[2]
                if (hora < 10) hora = '0' + hora
                let horafinal = hora + ':' + min + ':' + sec
                await axios.post(URL + '/solicitudS/genInformeImagenes', {

                    codigoSol: solicitud[0].codigoSol,
                    fecha: fecha + ' ' + horafinal

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
                            setVentana(8)  // VENTANA SERVICIOS RADIOALOGIA
                        }
                    }

                })
            }
        }






        const verResultados = async (item_p) => {
            let today = new Date()
            let fecha = today.toISOString().split('T')[0]
            let hora = new Date().toLocaleTimeString().split(':')[0]
            let min = new Date().toLocaleTimeString().split(':')[1]
            let sec = new Date().toLocaleTimeString().split(':')[2]
            if (hora < 10) hora = '0' + hora
            let horafinal = hora + ':' + min + ':' + sec
            // console.log(item_p, 'parametro item cargado correctamente')
            axios.post(URL + '/solicitudS/recibirResultadosImagen', {
                id: item_p.id, codigoSol: item_p.codigoSol,
                fecha: fecha + ' ' + horafinal,
            }).then(j => {
                setFileNames(j.data)
                // console.log(j.data, 'filenames')
                // setSolicitud(j.data[1])
                setObs(j.data[0].obs)
                setVentana(8)
            })
        }



        return (
            <div  >
                <div className="hold-transition sidebar-mini" >
                    <div className="wrapper">
                        <Home />
                        <div className="content-wrapper" >
                            <div className="content" >
                                <div className="container-fluid" >











                                    {
                                        ventana === 1 && <>


                                            <div className='row' style={{ background: '#e8e0d3', height: '560px' }}>
                                                <div className='col-11'>
                                                    <div className='row'>
                                                        <div className='col-5 mt-5'>
                                                            <div className='nombreHospital '><strong>HOSPITAL SAN PEDRO CLAVER </strong></div>
                                                            <p className='nombreSC'>UNIDAD DE SERVICIOS COMPLEMENTARIOS</p>

                                                            <div className='ItemSolicitado' style={{ marginTop: "20px" }}>
                                                                <label className='titulo'>INGRESE EL CI DEL PACIENTE</label>
                                                                <p className='nhc'>OTROS PARAMETROS</p>
                                                                <li className='codigoSol'> NOMBRE COMPLETO</li>
                                                                <li className='codigoSol'> APELLIDOS</li>
                                                            </div>

                                                        </div>
                                                        <div className='col-7 mt-3'>
                                                            <div class="box">
                                                                <div class="container-4" style={{ marginLeft: '6px' }}>

                                                                    <ComponenteInputBuscarSolicitud
                                                                        estado={inputBuscar}
                                                                        cambiarEstado={setInputBuscar}
                                                                        name="inputBuscar"
                                                                        ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                                        placeholder="C.I."
                                                                        eventoBoton={buscarPaciente}
                                                                        etiqueta={'Buscar'}
                                                                    />
                                                                </div>
                                                            </div>
                                                            {pacienteSolicitud.length > 0 &&
                                                                <div className=" table table-responsive custom" style={{ marginBottom: "0px", marginTop: '0px', background: '#e8e0d3', height: '285px' }}>
                                                                    {pacienteSolicitud.map((p) => (
                                                                        <div className='pb-2 item' key={p.id} style={{ height: 'auto' }}>

                                                                            <div className='row bloque' >
                                                                                <div className='col-1 pb-0'>
                                                                                    <Button className='modificar' onClick={() => rellenar(p)}><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon> </Button>
                                                                                </div>
                                                                                <div className='col-8 pb-0' style={{ position: 'relative' }}>
                                                                                    <p className='medicoList' style={{ textAlign: 'left' }}><strong> {'PAC. ' + p.nombre + ' ' + p.apellidoPaterno + ' ' + p.apellidoMaterno}</strong></p>
                                                                                    <p className='diagnosticoList'> {'C.I. ' + p.ci} <span className='codigoSolList'>{'SEXO ' + p.sexo}</span></p>

                                                                                    <p className='nhcList'> {'FECHA DE NACIMIENTO. ' + p.fechaNac}</p>
                                                                                    <p className='codigoSolList'></p>

                                                                                    <p className='codigoSolList'>{'NUMERO HISTORIAL CLINICO. ' + p.nhc}</p>
                                                                                    <p className='codigoSolList'>{'DIRECCION ' + p.direccion}  <span className='codigoSolList'>{'TELF.  ' + p.telefono}</span></p>
                                                                                </div>

                                                                                <div className='col-3 row pt-2'>
                                                                                    <Button className='Historial' onClick={() => historialPaciente(p)}>HISTORIAL <span className='btnNuevoIcono'><FontAwesomeIcon icon={faList}></FontAwesomeIcon></span> </Button>

                                                                                    <Button className='solicitar' onClick={() => buscarPacienteSolicitud(p.ci)}>SOLICITAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon></span> </Button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            }
                                                            <div className='row'>
                                                                <div className='col-auto mt-2 ml-1'>
                                                                    <Button className=' Historial ' onClick={() => setModalInsertar(true)} style={{ textAlign: 'right' }}>Registrar paciente<span className='btnNuevoIcono' ><FontAwesomeIcon icon={faUserPlus}></FontAwesomeIcon></span> </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-1' style={{ background: '#062b48' }}>
                                                </div>
                                            </div>



                                        </>
                                    }








































                                    <>
                                        <Modal isOpen={modalInsertar} >
                                            <div className='titloFormulario' >
                                                Nuevo Paciente
                                            </div>
                                            <ModalBody>
                                                <form>
                                                    <div className="row">
                                                        {/* <p></p> */}
                                                        <div className="form-group col-5 mb-2 mt-1 pl-1">
                                                            <ComponenteInputUser
                                                                estado={ciPaciente}
                                                                cambiarEstado={setCiPaciente}
                                                                name="ciPaciente"
                                                                placeholder="CEDULA DE IDENTIDAD"
                                                                ExpresionRegular={INPUT.CI}  //expresion regular
                                                                etiqueta='CI'
                                                            />
                                                        </div>
                                                        <div className="form-group col-7 mb-2 mt-1 pl-1">
                                                            <ComponenteInputUser
                                                                estado={nombre}
                                                                cambiarEstado={setNombre}
                                                                name="nombre"
                                                                placeholder="NOMBRE COMPLETO"
                                                                ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular
                                                                etiqueta='Nombre'
                                                            />
                                                        </div>

                                                        <div className="form-group col-6  mb-2 mt-1 pr-1 pl-1">
                                                            <ComponenteInputUser
                                                                estado={apellidoPat}
                                                                cambiarEstado={setApellidoPat}
                                                                name="apellidoPat"
                                                                placeholder="Apellido Paterno"
                                                                ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular
                                                                etiqueta='Apellido Paterno'
                                                            />
                                                        </div>

                                                        <div className="form-group col-6  mb-2 mt-1 pr-1 pl-1">
                                                            <ComponenteInputUser
                                                                estado={apellidoMat}
                                                                cambiarEstado={setApellidoMat}
                                                                name="apellidoMat"
                                                                placeholder="Apellido Materno"
                                                                ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular
                                                                etiqueta='Apellido Materno'
                                                            />
                                                        </div>

                                                        <div className="form-group col-5 mb-2 mt-1 pr-1 pl-1">
                                                            <ComponenteInputUser
                                                                estado={nhcRegistro}
                                                                cambiarEstado={setNhcRegistro}
                                                                name="nhcRegistro"
                                                                ExpresionRegular={INPUT.NHC}  //expresion regular
                                                                placeholder="numero historial clinico "
                                                                etiqueta='Numero historial clinico SICE'
                                                            />
                                                        </div>
                                                        <div className="form-group col-7 mb-2 mt-1 pr-1 pl-1">
                                                            <ComponenteInputfecha
                                                                estado={fechaNacRegistro}
                                                                cambiarEstado={setFechaNacRegistro}
                                                                name="fechaNacRegistro"
                                                                ExpresionRegular={INPUT.FECHA}  //expresion regular
                                                                etiqueta='FECHA NAC.'
                                                            />
                                                        </div>
                                                        <div className="form-group col-12 mb-2 mt-1 pr-1 pl-1">
                                                            <Select1
                                                                estado={sexoRegistro}
                                                                cambiarEstado={setSexoRegistro}
                                                                name="sexoRegistro"
                                                                ExpresionRegular={INPUT.SEXO}  //expresion regular
                                                                lista={sexos}
                                                                etiqueta='Sexo'
                                                            />
                                                        </div>
                                                        <div className="form-group col-12 mb-2 mt-1 pr-1 pl-1">
                                                            <ComponenteInputUser
                                                                estado={direccion}
                                                                cambiarEstado={setDireccion}
                                                                name="direccion"
                                                                placeholder="direccion"
                                                                ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                                etiqueta='Direccion'
                                                            />
                                                        </div>
                                                        <div className="form-group col-12 mb-2 mt-1 pr-1 pl-1">
                                                            <ComponenteInputUser
                                                                estado={telefono}
                                                                cambiarEstado={setTelefono}
                                                                name="telefono"
                                                                placeholder="telefono"
                                                                ExpresionRegular={INPUT.TELEFONO}  //expresion regular
                                                                etiqueta='telefono/celular'
                                                            />
                                                        </div>
                                                    </div>
                                                </form>
                                            </ModalBody>
                                            <div className="row p-2">
                                                <div className="col-auto">
                                                    <Button className=' cancelarVentanaSolicitud' onClick={() => { setModalInsertar(false); vaciarDatos() }} >Cerrar <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                                </div>
                                                <div className="col-auto">
                                                    <Button className='   Historial' onClick={() => insertarPaciente()}>Registrar <span className='btnNuevoIcono'><FontAwesomeIcon icon={faSave}></FontAwesomeIcon></span> </Button>
                                                </div>
                                            </div>
                                        </Modal>

                                        <Modal isOpen={modalEditar} >
                                            <div className='titloFormulario' >
                                                Actualizar paciente
                                            </div>
                                            <ModalBody>
                                                <form>
                                                    <div className="row">
                                                        <div className="form-group col-5 mb-2 mt-1 pl-1">
                                                            <ComponenteInputUser
                                                                estado={ciPaciente}
                                                                cambiarEstado={setCiPaciente}
                                                                name="ciPaciente"
                                                                placeholder="CEDULA DE IDENTIDAD"
                                                                ExpresionRegular={INPUT.CI}  //expresion regular
                                                                etiqueta='CI'
                                                            />
                                                        </div>
                                                        <div className="form-group col-7 mb-2 mt-1 pl-1">
                                                            <ComponenteInputUser
                                                                estado={nombre}
                                                                cambiarEstado={setNombre}
                                                                name="nombre"
                                                                placeholder="NOMBRE COMPLETO"
                                                                ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular
                                                                etiqueta='Nombre'
                                                            />
                                                        </div>

                                                        <div className="form-group col-6  mb-2 mt-1 pr-1 pl-1">
                                                            <ComponenteInputUser
                                                                estado={apellidoPat}
                                                                cambiarEstado={setApellidoPat}
                                                                name="apellidoPat"
                                                                placeholder="Apellido Paterno"
                                                                ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular
                                                                etiqueta='Apellido Paterno'
                                                            />
                                                        </div>

                                                        <div className="form-group col-6  mb-2 mt-1 pr-1 pl-1">
                                                            <ComponenteInputUser
                                                                estado={apellidoMat}
                                                                cambiarEstado={setApellidoMat}
                                                                name="apellidoMat"
                                                                placeholder="Apellido Materno"
                                                                ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular
                                                                etiqueta='Apellido Materno'
                                                            />
                                                        </div>
                                                        <div className='col-5'>
                                                            <ComponenteInputUser
                                                                estado={nhcRegistro}
                                                                cambiarEstado={setNhcRegistro}
                                                                name="nhcRegistro"
                                                                placeholder="N.H.CL. "
                                                                ExpresionRegular={INPUT.NHC}  //expresion regular
                                                                etiqueta='Numero historial Clinico SICE'
                                                            />
                                                        </div>

                                                        <div className="form-group col-7 mb-2 mt-1 pr-1 pl-1">
                                                            <ComponenteInputfecha
                                                                estado={fechaNacRegistro}
                                                                cambiarEstado={setFechaNacRegistro}
                                                                name="fechaNacRegistro"
                                                                ExpresionRegular={INPUT.FECHA}  //expresion regular
                                                                etiqueta='fecha Nac.'
                                                            />
                                                        </div>
                                                        <div className="form-group col-12 mb-2 mt-1 pr-1 pl-1">
                                                            <Select1
                                                                estado={sexoRegistro}
                                                                cambiarEstado={setSexoRegistro}
                                                                name="sexoRegistro"
                                                                ExpresionRegular={INPUT.SEXO}  //expresion regular
                                                                lista={sexos}
                                                                etiqueta='Sexo'
                                                            />
                                                        </div>
                                                        <div className="form-group col-12 mb-2 mt-1 pr-1 pl-1">
                                                            <ComponenteInputUser
                                                                estado={direccion}
                                                                cambiarEstado={setDireccion}
                                                                name="direccion"
                                                                placeholder="direccion"
                                                                ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                                etiqueta='Direccion'
                                                            />
                                                        </div>
                                                        <div className="form-group col-12 mb-2 mt-1 pr-1 pl-1">
                                                            <ComponenteInputUser
                                                                estado={telefono}
                                                                cambiarEstado={setTelefono}
                                                                name="telefono"
                                                                placeholder="telefono"
                                                                ExpresionRegular={INPUT.TELEFONO}  //expresion regular
                                                                etiqueta='telefono/celular'
                                                            />
                                                        </div>
                                                    </div>
                                                </form>

                                            </ModalBody>
                                            <div className="row p-2" >
                                                <div className="col-auto">
                                                    <Button className=' cancelarVentanaSolicitud ' onClick={() => { setModalEditar(false); vaciarDatos() }} >Cancelar <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                                </div>
                                                <div className="col-auto" >
                                                    <Button className='  Historial' onClick={() => actualizarPaciente()}>actualizar <span className='btnNuevoIcono'><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></span> </Button>
                                                </div>
                                            </div>
                                        </Modal>
                                    </>


































                                    {
                                        ventana === 3 &&
                                        <div className="page-wrapper">
                                            <div className='card ' >
                                                <div className='col-12 tituloHistorial'>
                                                    {pacienteCardex}
                                                </div>
                                                <div style={{ background: '#e8e0d3' }}>
                                                    <div className="row mt-2 mb-2">

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
                                                            <Button className="btnBuscar" onClick={buscarhistorialEspecifico} >Buscar <span className='btnNuevoIcono'><FontAwesomeIcon icon={faSearch}></FontAwesomeIcon></span> </Button>
                                                        </div>
                                                    </div>
                                                    <div className=" table table-responsive custom" style={{ marginBottom: "0px", padding: '0px', height: '460px' }}>
                                                        {cantidad.length === 0 &&
                                                            <>
                                                                <div className='paciente '><strong>NO SE ENCONTRO NINGUNA INFORMACION</strong></div>

                                                                <div className="row mt-2 mb-2">
                                                                    <Button className="btnBuscar" onClick={() => historialPaciente({ id: idPacienteCardex })} > Volver a cargar <span className='btnNuevoIcono'><FontAwesomeIcon icon={faList}></FontAwesomeIcon></span> </Button>
                                                                </div>
                                                            </>

                                                        }
                                                        {cantidad.map((c) => (
                                                            <div className='row pb-2 item' key={c.id} onClick={() => verSolicitud(c.codigoSol)}>
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
                                                                            {c.estado === 1 && <div className='col-5 estadoSi'><strong> AUTORIZADO</strong></div>}
                                                                            {c.estado === 0 && c.eliminar === 0 && <div className='col-5 estadoNo'><strong> PENDIENTE</strong></div>}
                                                                            {c.estado === 0 && c.eliminar === 1 && <div className='col-5 estadoNo' style={{ color: '#dc3545' }}><strong> RECHAZADO</strong></div>}
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
                                                                        {c.eliminar === 1 &&
                                                                            <p className='codigoSolList' style={{ color: '#dc3545' }}>{c.observacion}</p>}
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
                                                    <div className='row m-2'>
                                                        <div className='col-auto'>
                                                            <Button className=' cancelarVentanaSolicitud ' onClick={() => setVentana(1)}>CERRAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }


















                                    {ventana === 4 &&

                                        <div className="mt-2" style={{ background: '#e8e0d3' }}>
                                            {
                                                solicitud.length > 0 &&
                                                <div className="col-12 titloFormulario" >ACTUALIZAR SOLICITUD</div>

                                            }
                                            {
                                                solicitud.length === 0 &&
                                                <div className="col-12 titloFormulario" >SOLICITUD DE SERVICIOS UNIDAD SERVICIOS COMPLEMENTARIOS </div>

                                            }
                                            <div className="row p-2">
                                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                                    <div className='row'>
                                                        <div className='col-12 col-xl-7 col-lg-7 col-md-7 col-sm-7 '>
                                                            <ComponenteInputUserDisabled
                                                                estado={ci}
                                                                cambiarEstado={setCi}
                                                                name="ci"
                                                                placeholder="C.I."
                                                                ExpresionRegular={INPUT.CI}  //expresion regular
                                                                // eventoBoton={buscarPacienteSolicitud}
                                                                etiqueta='Cédula de Identidad'
                                                            />
                                                        </div>
                                                        <div className='col-12 col-xl-5 col-lg-5 col-md-5 col-sm-5 '>
                                                            <ComponenteInputUserDisabled
                                                                estado={fechaNac}
                                                                cambiarEstado={setFechaNac}
                                                                name="fechaNac"
                                                                ExpresionRegular={INPUT.FECHA}  //expresion regular
                                                                etiqueta='Fecha de Nacimiento'
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                                    <div className='row'>
                                                        <div className='col-12 col-xl-6 col-lg-6 col-md-6 col-sm-6 '>
                                                            <ComponenteInputfecha
                                                                estado={fechaSolicitud}
                                                                cambiarEstado={setFechaSolicitud}
                                                                name="fechaSolicitud"
                                                                ExpresionRegular={INPUT.FECHA}  //expresion regular
                                                                className_="form-control form-control-sm"
                                                                etiqueta='FECHA DE SOLICITUD'
                                                            />
                                                        </div>
                                                        <div className='col-12 col-xl-6 col-lg-6 col-md-6 col-sm-6'>
                                                            <ComponenteInputHora
                                                                estado={HoraSolicitud}
                                                                cambiarEstado={setHoraSolicitud}
                                                                name="horaSolicitud"
                                                                ExpresionRegular={INPUT.HORA}  //expresion regular
                                                                className_="form-control form-control-sm"
                                                                etiqueta='HORA DE SOLICITUD'
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <ComponenteInputUserDisabledRow
                                                    estado={nombrePaciente}
                                                    cambiarEstado={setNombrePaciente}
                                                    name="paciente"
                                                    ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular
                                                    etiqueta='PACIENTE'
                                                />
                                                <ComponenteInputUserRow
                                                    estado={diagnostico}
                                                    cambiarEstado={setDiagnostico}
                                                    name="DIAGNOSTICO"
                                                    ExpresionRegular={INPUT.DIAGNOSTICO}  //expresion regular
                                                    etiqueta={'DIAGNOSTICO  '}
                                                />
                                                <div className="col-12" >
                                                    <div className='row'>
                                                        <div className='col-12 col-xl-3 col-lg-3 col-md-3 col-sm-6'>
                                                            <ComponenteInputUserDisabled
                                                                estado={edad}
                                                                cambiarEstado={setEdad}
                                                                name="edad"
                                                                ExpresionRegular={INPUT.EDAD}  //expresion regular
                                                                etiqueta='EDAD'
                                                            />
                                                        </div>
                                                        <div className='col-12 col-xl-3 col-lg-3 col-md-3 col-sm-6'>
                                                            <ComponenteInputUserDisabled
                                                                estado={sexo}
                                                                cambiarEstado={setSexo}
                                                                name="sexo"
                                                                ExpresionRegular={INPUT.SEXO}  //expresion regular
                                                                etiqueta='SEXO'
                                                            />
                                                        </div>
                                                        <div className='col-12 col-xl-3 col-lg-3 col-md-3 col-sm-6'>
                                                            <Select1
                                                                name="seguro"
                                                                estado={idSeguro}
                                                                cambiarEstado={setIdseguro}
                                                                ExpresionRegular={INPUT.ID}
                                                                lista={seguros}
                                                                etiqueta='SEGURO'
                                                            />
                                                        </div>

                                                        <div className='col-12 col-xl-3 col-lg-3 col-md-3 col-sm-6'>
                                                            <ComponenteInputUserDisabled
                                                                estado={nhc}
                                                                cambiarEstado={setNhc}
                                                                name="nhc"
                                                                ExpresionRegular={INPUT.NHC}  //expresion regular
                                                                etiqueta='N.H.C.'
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    examenesSeleccionadosMostrar.length > 0 &&
                                                    <div className='showExamen' >
                                                        {examenesSeleccionadosMostrar.map((x) => (
                                                            <small key={x.nombre}>{x.nombre + '           '}</small>
                                                        ))
                                                        }
                                                    </div>
                                                }

                                                {
                                                    ventana === 4 && solicitud.length === 0 &&
                                                    <>
                                                        <div className=" col-12 " >
                                                            <SelectRow
                                                                estado={idServicio}
                                                                cambiarEstado={setIdServicio}
                                                                name="nombre"
                                                                ExpresionRegular={INPUT.ID}  //expresion regular
                                                                lista={servicio}
                                                                funcion={listarExamenes}
                                                                etiqueta='Servicio'
                                                            />
                                                        </div>

                                                        <div className='row mt-2  table-responsive custom' style={{ height: '250px' }}>

                                                            {examen.map((x) => (

                                                                <div key={x.servicioSolicitado} className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3" >
                                                                    {
                                                                        <ComponenteCheck
                                                                            id={x.idItemServicio}
                                                                            item={x.servicioSolicitado}
                                                                            admitidos={examenesSeleccionados}
                                                                            // funcion={asignarExamenesSeleccionados}
                                                                            examen={examen}
                                                                            mostrar={setExamenesSeleccionadosMostrar}
                                                                        />
                                                                    }
                                                                </div>

                                                            ))}
                                                        </div>
                                                    </>
                                                }
                                                {
                                                    ventana === 4 && solicitud.length > 0 &&
                                                    <>
                                                        <div className=" col-12 " >
                                                            <SelectRow
                                                                estado={idServicio}
                                                                cambiarEstado={setIdServicio}
                                                                name="nombre"
                                                                ExpresionRegular={INPUT.ID}  //expresion regular
                                                                lista={servicio}
                                                                funcion={listarExamenes}
                                                                etiqueta='Servicio'
                                                            />
                                                        </div>


                                                        <div className='row mt-2 table-responsive custom' style={{ height: '220px' }}>
                                                            {examen.map((x) => (
                                                                <div key={x.servicioSolicitado} className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 ">
                                                                    {
                                                                        <ComponenteCheck
                                                                            id={x.idItemServicio}
                                                                            item={x.servicioSolicitado}
                                                                            admitidos={examenesSeleccionados}
                                                                            // funcion={asignarExamenesSeleccionados}
                                                                            examen={examen}
                                                                            mostrar={setExamenesSeleccionadosMostrar}

                                                                        />
                                                                    }
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                }


                                                <div className='row pt-3'>
                                                    {
                                                        solicitud.length > 0 &&
                                                        <div className='col-auto '>
                                                            <Button className=' cancelarVentanaSolicitud ' onClick={() => abandonarFormularioEditar()}>CERRAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                                        </div>
                                                    }

                                                    {
                                                        solicitud.length === 0 &&
                                                        <div className='col-auto '>
                                                            <Button className=' cancelarVentanaSolicitud ' onClick={() => abandonarFormularioInsertar()}>CERRAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                                        </div>
                                                    }
                                                    {
                                                        solicitud.length === 0 &&
                                                        <div className='col-auto'>
                                                            <Button className=' Historial ' onClick={() => registrar()}>REGISTRAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faSave}></FontAwesomeIcon></span> </Button>
                                                        </div>
                                                    }
                                                    {solicitud.length > 0 &&
                                                        <div className='col-auto'>
                                                            <Button className=' Historial ' onClick={() => actualizar()}>EDITAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></span> </Button>
                                                        </div>
                                                    }
                                                </div>
                                            </div >
                                        </div>

                                    }













                                    {ventana === 5 &&

                                        <div style={{ marginTop: '10px' }}>
                                            <VerSolicitud solicitud={solicitud} abandonarVentanaVer={abandonarVentanaVer} actualizarSolicitud={actualizarSolicitud}
                                                eliminarSolicitud={eliminarSolicitud} generarInforme={generarInforme} privilegios={privilegios} setItem={setItem}
                                                verResultados={verResultados}
                                            />
                                        </div>
                                    }









                                    {ventana === 6 &&
                                        <div className=''>
                                            <GenerarPdf
                                                informe={informe}
                                                setEstado={setVentana}
                                                lab={laboratorio}
                                            />
                                        </div>
                                    }
                                    {ventana === 7 &&     // INFORME SERVICIO TRANSFUSIONAL
                                        <div>
                                            <GenerarPdfTransfusional
                                                informe={informe}
                                                setEstado={setVentana}
                                                lab={laboratorio}
                                            />
                                        </div>
                                    }
                                    {ventana === 8 &&  // INFORMES EN TIPO RESULTADO; ECOGRAFIA, ENDOSCOPIA REYOS X Y TOMOGRAFIA
                                        <div className='col-12 m-auto mt-3 '>
                                            <div className='titloFormulario' >
                                                RESULTADOS
                                            </div>
                                            {item &&
                                                <div className='row p-2'>
                                                    <div className='col-8'>
                                                        <p className='medicoList' style={{ textAlign: 'left' }}><strong> {'PAC. ' + item.paciente}</strong></p>
                                                        <p className='diagnosticoList'> {'DIAGNOSTICO: ' + item.diagnostico}</p>
                                                        <p className='nhcList'> {'NUMERO HISTORIAL CLINICO ' + item.nhc}</p>
                                                    </div>
                                                    <div className='col-4'>
                                                        <p className='medicoList' style={{ textAlign: 'left', fontSize: "10px" }}><strong> {'RESULTADO(S)'}</strong></p>
                                                        <p className='medicoList' style={{ textAlign: 'left', fontSize: '18px' }}><strong> {item.servicioSolicitado}</strong></p>
                                                        <p className='codigoSolList'> {'CODIGO ' + item.codigoSol}</p>
                                                    </div>
                                                </div>
                                            }
                                            <div className='col-12  table-responsive custom mt-1'>

                                                {fileNames.length > 0 && <div className=' p-2 mt-2 m-0 ' style={{ background: 'rgb(42, 42, 42)' , height: '400px' }}>
                                                    <div className='gallery-container'>
                                                        {fileNames.map((e) => (
                                                            e.idSolicitud === item.id &&
                                                            <div className='gallery__item' key={e.idSolicitud}>
                                                                <img src={URL + '/' + e.imagen} alt={'...'} className='gallery__img' onClick={() => { setImagen(e.imagen); setVentana(9) }} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                }

                                            </div >
                                            {obs && <p className='nhcList' style={{ color: '#dc3545', textAlign: 'right' }}><span className='btnNuevoIcono' ><FontAwesomeIcon icon={faExclamation} style={{ color: '#dc3545' }}></FontAwesomeIcon></span> {obs}</p>}
                                            <div className='row'>
                                                <div className='col-auto ml-2'>
                                                    <Button className=' cancelarVentanaSolicitud ' onClick={() => setVentana(5)}>CERRAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {
                                        ventana === 9 && <div >
                                            {/* <div className='p-1 pt-0'> */}
                                            <article className='light-box pt-1'>
                                                <p className='medicoList' style={{ textAlign: 'left', color: 'white', paddingLeft: '50px' }}><strong> {'PAC. ' + item.paciente}</strong></p>

                                                <img src={URL + '/' + imagen} alt={'...'} className='gallery__imgModal' />
                                                <div className="row p-2 " >
                                                    <div className="col-auto pl-5" style={{ paddingLeft: '40px' }}>
                                                        <Button className='  cancelarVentanaSolicitud' onClick={() => setVentana(8)} >CERRAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                                    </div>
                                                    <div className="col-auto" style={{ paddingLeft: '40px' }}>
                                                        <p className='medicoList' style={{ textAlign: 'left', color: 'white', paddingLeft: '50px' }}><strong> {'DIAGNOSTICO : ' + item.diagnostico}</strong></p>
                                                        <p className='medicoList' style={{ textAlign: 'left', color: 'white', paddingLeft: '50px' }}><strong> {'ESTUDIO REALIZADO : ' + item.servicioSolicitado}</strong></p>

                                                    </div>
                                                    {/* <div className="col-auto" style={{ paddingLeft: '40px' }}></div> */}
                                                </div>
                                            </article>


                                            {/* </div> */}
                                        </div>
                                    }


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
export default Solicitar;



