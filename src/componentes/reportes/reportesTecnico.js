import { Table, Button } from 'reactstrap';
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faFileExcel, faList, faDownload, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import Home from '../elementos/home'
import { URL, INPUT } from '../../Auth/config'  // variables globales que estan disponibles para todo el sistema client

import useAuth from "../../Auth/useAuth" // verificacion de la existencia de la sesion
import { ComponenteInputfecha, Select1, ComponenteInputMes } from '../elementos/input';  // componente input que incluye algunas de las
import axios from 'axios';
import {
    Chart as chartJs,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'

import { Bar } from 'react-chartjs-2'
// import { utils, writeFile } from 'https://unpkg.com/xlsx/xlsx.mjs';
import { utils, writeFile } from 'sheetjs-style';
import { Toaster, toast } from 'react-hot-toast'





var año = new Date().getFullYear();
var mes = new Date().getMonth();


const dias = new Date(año, mes + 1, 0).getDate()
const ini = new Date(año, mes, 1).toISOString().split('T')[0]
const fin = new Date(año, mes, dias).toISOString().split('T')[0]


var labels = [] // labels in of char


for (let i = 1; i <= dias; i++) {

    let date = new Date(año, mes, i);

    let options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    labels.push(date.toLocaleDateString('es-MX', options).split(',')[0] + '  ' + i)
}

chartJs.register(
    CategoryScale,
    ArcElement,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)


function ReportesTecnico() {

    const [mes1, setMes1] = useState({ campo: ini.split('-')[0] + '-' + ini.split('-')[1], valido: 'true' })


    const [fechaIni, setFechaIni] = useState({ campo: ini, valido: 'true' })


    const [fechaFin, setFechaFin] = useState({ campo: fin, valido: 'true' })


    const [cantidad, setCantidad] = useState([]) // cantidad de solicitudes en inicio y registros
    const [data, setData] = useState([]) // cantidad de solicitudes en inicio y registros
    const [seguro, setSeguro] = useState([]) // cantidad de solicitudes en inicio y registros
    const [servicio, setServicio] = useState([]) // cantidad de solicitudes en inicio y registros
    const [x, setX] = useState([]) // cantidad de solicitudes en inicio y registros
    const [verReports, setVerReports] = useState(false)
    const [verGrafic, setVerGrafic] = useState(true)
    const [mensaje, setMensaje] = useState(null)
    const [idSeguro, setIdSeguro] = useState({ campo: null, valido: null })
    const [listSeguro, setListaSeguro] = useState([])

    const [idServicio, setIdServicio] = useState({ campo: null, valido: null })
    const [servicioReportes, setServicioReportes] = useState([])

    const [idMedico, setIdMedico] = useState({ campo: null, valido: null })
    const [medicos, setMedicos] = useState([])
    const [criterios, setCriterio] = useState([
        { id: 1, nombre: 'Listar en el rango de fechas' }, { id: 2, nombre: 'Listar en el rango de fechas considerando los seguros' },
        { id: 5, nombre: 'Consultar Solicitudes atedidos por servicio' }, { id: 6, nombre: 'listar por Medico solicitante' }])

    const [idCriterio, setIdCriterio] = useState({ campo: null, valido: null })

    const [total, setTotal] = useState(0)


    useEffect(() => {
        inicio()
    }, [])

    useEffect(() => {
        setTimeout(() => {
            setMensaje(null)
        }, 10000)
    }, [mensaje])

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

    let scores = []
    const inicio = async () => {
        try {
            await axios.post(URL + '/solicitudL/datoGraficos', { ini: ini, fin: fin }).then(json => {

                // console.log(json.data[2])
                for (let i = 1; i <= dias; i++) {
                    let dia = i
                    if (i < 10) {
                        dia = '0' + i
                    }

                    let month = mes + 1
                    if (month < 10) month = '0' + month
                    let fecha = año + '-' + month + '-' + dia

                    // console.log(fecha)
                    let found = json.data[2].find(element => element.fecha === fecha)
                    if (found === undefined) {
                        scores.push(0)
                    } else {
                        scores.push(json.data[2].find(element => element.fecha === fecha).cantidad)
                    }
                }
                setX(scores)

                let totalSeguro = 0
                json.data[0].forEach(element => {
                    totalSeguro = totalSeguro + element.cantidad
                });
                json.data[0].push({ 'seguro': 'TOTAL', 'cantidad': totalSeguro })
                setSeguro(json.data[0])


                let totalServicio = 0
                json.data[1].forEach(element => {
                    totalServicio = totalServicio + element.cantidad
                });
                json.data[1].push({ 'servicio': 'TOTAL', 'cantidad': totalServicio })
                setServicio(json.data[1])
            })

        } catch (error) {
            // console.log(error)
            return error

        }
    }



    const inicioInput = async (ini, fin) => {
        labels = []
        try {
            await axios.post(URL + '/solicitudL/datoGraficos', { ini: ini, fin: fin }).then(json => {
                console.log(json.data[2], 'cantidad de dias')

                let cantidadDias = new Date(fin).getDate()
                let cantidadMes = new Date(fin).getMonth()
                let cantidadAños = new Date(fin).getFullYear()

                for (let i = 1; i <= cantidadDias + 1; i++) {

                    let date = new Date(cantidadAños, cantidadMes, i);

                    let options = {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    };

                    labels.push(date.toLocaleDateString('es-MX', options).split(',')[0] + '  ' + i)
                }



                for (let i = 1; i <= cantidadDias; i++) {
                    let dia = i
                    if (i < 10) {
                        dia = '0' + i
                    }

                    let month = cantidadMes + 1
                    if (month < 10) month = '0' + month
                    let fecha = año + '-' + month + '-' + dia

                    console.log(fecha, 'fecha seleccionado')
                    let found = json.data[2].find(element => element.fecha === fecha)
                    if (found === undefined) {
                        scores.push(0)
                    } else {
                        scores.push(json.data[2].find(element => element.fecha === fecha).cantidad)
                    }
                }
                setX(scores)

                let totalSeguro = 0
                json.data[0].forEach(element => {
                    totalSeguro = totalSeguro + element.cantidad
                });
                json.data[0].push({ 'seguro': 'TOTAL', 'cantidad': totalSeguro })
                setSeguro(json.data[0])


                let totalServicio = 0
                json.data[1].forEach(element => {
                    totalServicio = totalServicio + element.cantidad
                });
                json.data[1].push({ 'servicio': 'TOTAL', 'cantidad': totalServicio })
                setServicio(json.data[1])
            })

        } catch (error) {
            // console.log(error)
            return error

        }
    }












    const option = {
        responsive: true,
        fill: true,
        scales: {
            y: {
                min: 0,
            },
        },
        plugins: {
            legend: {
                display: true // renderiza title  
            },
        },
    }

    let mesActual = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date(fechaFin.campo));
    const data1 = {
        datasets: [
            {
                label: 'TENDENCIA MENSUAL (' + mesActual + ' ' + año + ')',
                data: x,
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            }
        ], labels
    }

    try {


        const cargarData = () => {
            if (fechaIni.valido === 'true' && fechaFin.valido === 'true') {
                axios.post(URL + '/solicitudL/reportes', { ini: fechaIni.campo, fin: fechaFin.campo }).then(json => {
                    setListaSeguro(json.data[0])
                    setCantidad(json.data[1])
                    setData(json.data[1])
                    setServicioReportes(json.data[2])
                    setMedicos(json.data[3])
                    setTotal(json.data[1].length)
                    inicio()
                    console.log(json.data[1])

                })
            }
        }

        const listar = async () => {
            // setCantidad([])
            if (idCriterio.valido === 'true') {
                if (idCriterio.campo == 1) {
                    if (fechaIni.valido === 'true' && fechaFin.valido === 'true') {
                        await axios.post(URL + '/solicitudL/reportes', { ini: fechaIni.campo, fin: fechaFin.campo }).then(json => {
                            setListaSeguro(json.data[0])
                            setCantidad(json.data[1])
                            setData(json.data[1])
                            setServicioReportes(json.data[2])
                            setMedicos(json.data[3])
                            setTotal(json.data[1].length)
                            inicio()
                        })
                    } else toast.error('Seleccione las fechas')
                }
                if (idCriterio.campo == 2) {
                    // alert(idCriterio.campo)

                    if (idSeguro.valido === 'true' && fechaIni.valido === 'true' && fechaFin.valido === 'true') {
                        await axios.post(URL + '/solicitudL/reportes1', { ini: fechaIni.campo, fin: fechaFin.campo, idSeguro: idSeguro.campo }).then(json => {
                            setCantidad(json.data)
                            setData(json.data)
                            inicio()
                            setTotal(json.data.length)

                        })
                    } else toast.error('Seleccione correctamente el intevalos de fechas y el correspondiente seguro')
                }

                if (idCriterio.campo == 5) {
                    if (fechaIni.valido === 'true' && fechaFin.valido === 'true' && idServicio.valido === 'true') {
                        await axios.post(URL + '/solicitudL/reportesS', { ini: fechaIni.campo, fin: fechaFin.campo, idServicio: idServicio.campo }).then(json => {
                            setCantidad(json.data)
                            setData(json.data)

                            setTotal(json.data.length)
                            inicio()
                        })
                    } else toast.error('Seleccione correctamente el intevalos de fechas y el correspodiente servicio')
                }
                if (idCriterio.campo == 6) {
                    if (idMedico.valido === 'true' && fechaIni.valido === 'true' && fechaFin.valido === 'true') {
                        await axios.post(URL + '/solicitudL/reportesMedico', { ini: fechaIni.campo, fin: fechaFin.campo, idMedico: idMedico.campo }).then(json => {
                            setCantidad(json.data)
                            setData(json.data)
                            setTotal(json.data.length)
                            inicio()
                        })
                    } else toast.error('Seleccione correctamente el intevalos de fechas y el correspodiente Medico Solicitante')
                }
            } else toast.error('Seleccione el criterio de consulta')
        }





        const genExcel = () => {
            let name = 'REPORTE DE LAS SOLICITUDES DESDE EL MES ' + fechaIni.campo + '  HASTA ' + fechaFin.campo
            let defaultCellStyle = {
                font: {
                    name: "Verdana",
                    sz: 8,
                    color: "FF00FF88"
                },
                fill: {
                    fgColor: { rgb: "000000" }
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "red" } }
                },
            };

            var wb = utils.book_new();
            wb.Props = {
                Title: "INFORME",
                Subject: "LABORATORIO CLINICO HOSPITAL LAJASTAMBO",
                Author: "ADMINISTRACION DE SERVICIOS COMPLEMENTARIOS HOSPITAL LAJASTAMBO",
                CreatedDate: new Date()
            };
            wb.SheetNames.push("PRESTACION"); // libro de trabajo
            // wb.SheetNames.push("PRESTACION POR SEGURO"); // libro de trabajo
            // wb.SheetNames.push("PRESTACION POR SERVICIO"); // libro de trabajo

            const title1 = [{ seguro: '', solicitante: 'wdwqdwqdwqd', paciente: 'dqwdwqdwqdwqd', ci: '', codigosol: 'wdwqdwqdw', item: '', servicio: '' }]
            const title2 = [{ seguro: '', solicitante: '', paciente: '', ci: '', codigosol: '', item: '', servicio: '' }]
            const title3 = [{ seguro: '', solicitante: '', paciente: '', ci: '', codigosol: '', item: '', servicio: '' }]
            const title4 = [{ seguro: 'qfwfqwfqwfwqf', solicitante: 'qwfwqfwqfwq', paciente: 'qwfrwqfqwfwq', ci: 'dvasknvkjaskvjnaskjvnkj', codigosol: '', item: '', servicio: '' }]
            const title5 = [{ seguro: '', solicitante: '', paciente: '', ci: '', codigosol: '', item: 'asvvvvvvvvvvvvvvv', servicio: 'dvsavasss' }]
            const title6 = [{ seguro: '', solicitante: '', paciente: '', ci: '', codigosol: '', item: '', servicio: '' }]
            const title7 = [{ seguro: '', solicitante: '', paciente: '', ci: '', codigosol: '', item: '', servicio: '' }]
            // const title8 = [{seguro: '', solicitante: '', paciente: '', ci: '', codigosol: '',item:'', servicio:''}]



            data.unshift(title1)
            data.unshift(title2)
            data.unshift(title3)
            data.unshift(title4)
            data.unshift(title5)
            data.unshift(title6)
            data.unshift(title7)
            // data.unshift(title8)
            var ws = utils.json_to_sheet(data);
            let cat = null

            criterios.forEach(e => {
                if (e.id == idCriterio.campo) cat = e.nombre
                if (idCriterio.valido === null) cat = 'ESPECIFICADO EN EL RANGO DE FECHA  ' + fechaIni.campo + '  -  ' + fechaFin.campo
            })


            utils.sheet_add_aoa(ws, [['', "", "", "", "", "", '', '']], { origin: 'A1' });
            utils.sheet_add_aoa(ws, [['', "", 'UNIDAD', localStorage.getItem('servicio'), "", "", "", "", '']], { origin: 'A2' });

            utils.sheet_add_aoa(ws, [['', 'Reporte generado por: ' + localStorage.getItem('nombre') + ' ' + localStorage.getItem('apellido')]], { origin: 'A3' });
            utils.sheet_add_aoa(ws, [['', '', '']], { origin: 'A4' });
            // utils.sheet_add_aoa(ws, [['',"REPORTE DE LAS SOLCITUDES " + cat ]], { origin: 'A5' });
            utils.sheet_add_aoa(ws, [['', 'Fecha Generacion reporte:  ' + new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString()]], { origin: 'A5' });
            utils.sheet_add_aoa(ws, [['', , '', '', 'Desde ' + fechaIni.campo + ' hasta ' + fechaFin.campo]], { origin: 'A6' });
            utils.sheet_add_aoa(ws, [['', "SEGURO", "SOLICITANTE", "PACIENTE", "C.I.", "CODIGO", "SERVICIO", 'PRESTACION']], { origin: 'A8' });

            ws["B2"].s = {
                font: {
                    name: 'times new roman',
                    sz: 14,
                    bold: true,
                    color: { rgb: "000000" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },

                fill: {
                    fgColor: {
                        rgb: "FFFF00"
                    }
                },

            };
            ws["C2"].s = {
                font: {
                    name: 'times new roman',
                    sz: 14,
                    bold: true,
                    color: { rgb: "000000" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'right'
                },

                fill: {
                    fgColor: {
                        rgb: "FFFF00"
                    }
                },

            };
            ws["D2"].s = {
                font: {
                    name: 'times new roman',
                    sz: 14,
                    bold: true,
                    color: { rgb: "000000" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },

                fill: {
                    fgColor: {
                        rgb: "FFFF00"
                    }
                },

            };
            ws["E2"].s = {
                font: {
                    name: 'times new roman',
                    sz: 14,
                    bold: true,
                    color: { rgb: "000000" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },

                fill: {
                    fgColor: {
                        rgb: "FFFF00"
                    }
                },

            };
            ws["F2"].s = {
                font: {
                    name: 'times new roman',
                    sz: 14,
                    bold: true,
                    color: { rgb: "000000" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },

                fill: {
                    fgColor: {
                        rgb: "FFFF00"
                    }
                },

            };
            ws["G2"].s = {
                font: {
                    name: 'times new roman',
                    sz: 14,
                    bold: true,
                    color: { rgb: "000000" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },

                fill: {
                    fgColor: {
                        rgb: "FFFF00"
                    }
                },

            };
            ws["H2"].s = {
                font: {
                    name: 'times new roman',
                    sz: 14,
                    bold: true,
                    color: { rgb: "000000" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },

                fill: {
                    fgColor: {
                        rgb: "FFFF00"
                    }
                },

            };

            ws["B3"].s = {
                font: {
                    name: 'arial',
                    sz: 10,
                    bold: true,
                    color: { rgb: "008080" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },

                fill: {
                    fgColor: {
                        rgb: "FFFFFF"
                    }
                },

            };
            // ws["F5"].s = {
            //     font: {
            //         name: 'arial',
            //         sz: 10,
            //         bold: true,
            //         color: { rgb: "6E6E6E" },
            //     },
            //     alignment: {
            //         vertical: 'center',
            //         horizontal: 'left'
            //     },

            //     fill: {
            //         fgColor: {
            //             rgb: "FFFFFF"
            //         }
            //     },

            // };
            ws["A1"].s = {
                font: {
                    name: 'arial',
                    sz: 10,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "FFFFFF" } }
                },
                fill: {
                    fgColor: {
                        rgb: "FFFFFF"
                    }
                },

            };
            ws["B8"].s = {
                font: {
                    name: 'arial',
                    sz: 10,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "000000" } }
                },
                fill: {
                    fgColor: {
                        rgb: "006572"
                    }
                }
            };
            ws["C8"].s = {									// set the style for target cell
                font: {
                    name: 'arial',
                    sz: 10,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "000000" } }
                },
                fill: {
                    fgColor: {
                        rgb: "006572"
                    }
                }
            };
            ws["D8"].s = {									// set the style for target cell
                font: {
                    name: 'arial',
                    sz: 10,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "000000" } }
                },
                fill: {
                    fgColor: {
                        rgb: "006572"
                    }
                }
            };
            ws["E8"].s = {									// set the style for target cell
                font: {
                    name: 'arial',
                    sz: 10,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "000000" } }
                },
                fill: {
                    fgColor: {
                        rgb: "006572"
                    }
                }
            };
            ws["F8"].s = {									// set the style for target cell
                font: {
                    name: 'arial',
                    sz: 10,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "000000" } }
                },
                fill: {
                    fgColor: {
                        rgb: "006572"
                    }
                }
            };
            ws["G8"].s = {									// set the style for target cell
                font: {
                    name: 'arial',
                    sz: 10,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "000000" } }
                },
                fill: {
                    fgColor: {
                        rgb: "006572"
                    }
                }
            };
            ws["H8"].s = {									// set the style for target cell
                font: {
                    name: 'arial',
                    sz: 10,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "000000" } }
                },
                fill: {
                    fgColor: {
                        rgb: "006572"
                    }
                }
            };
            const vacio = data.reduce((w, r) => Math.max(w, 'este'.length + 2), 1);
            const sol = data.reduce((w, r) => Math.max(w, 'estevfvsdvdsvdsvdsvdvsddv'.length + 2), 1);
            const paciente = data.reduce((w, r) => Math.max(w, 'este la cadena mas larganjj'.length + 4), 1);
            const servicios = data.reduce((w, r) => Math.max(w, 'este la cadena mas largadvdv '.length + 2), 1);
            const codigosol = data.reduce((w, r) => Math.max(w, 'este es '.length + 2), 1);
            const seguros = data.reduce((w, r) => Math.max(w, 'estjoioimoe es '.length + 2), 1);
            const ci = data.reduce((w, r) => Math.max(w, 'este es la'.length + 2), 1);
            const item = data.reduce((w, r) => Math.max(w, 'este es la cadena mas '.length + 2), 1);



            ws["!cols"] = [{ wch: vacio }, { wch: seguros }, { wch: sol }, { wch: paciente }, { wch: ci }, { wch: codigosol }, { wch: servicios }, { wch: item }];


            var security = utils.json_to_sheet(seguro);
            utils.sheet_add_aoa(security, [["SEGURO", "CANTIDAD"]], { origin: 'A1' });
            security["A1"].s = {									// set the style for target cell
                font: {
                    name: 'arial',
                    sz: 10,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "000000" } }
                },
                fill: {
                    fgColor: {
                        rgb: "006572"
                    }
                }
            };
            security["B1"].s = {									// set the style for target cell
                font: {
                    name: 'arial',
                    sz: 10,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "000000" } }
                },
                fill: {
                    fgColor: {
                        rgb: "006572"
                    }
                }
            };
            const tamSeguro = seguro.reduce((w, r) => Math.max(w, r.seguro.length + 2), 1);
            security["!cols"] = [{ wch: tamSeguro }]


            /// SERVICIOS


            var ser = utils.json_to_sheet(servicio);
            utils.sheet_add_aoa(ser, [["SERVICIO", "CANTIDAD"]], { origin: 'A1' });
            ser["A1"].s = {									// set the style for target cell
                font: {
                    name: 'arial',
                    sz: 10,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "000000" } }
                },
                fill: {
                    fgColor: {
                        rgb: "006572"
                    }
                }
            };
            ser["B1"].s = {									// set the style for target cell
                font: {
                    name: 'arial',
                    sz: 10,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "000000" } }
                },
                fill: {
                    fgColor: {
                        rgb: "006572"
                    }
                }
            };

            const tamServicio = servicio.reduce((w, r) => Math.max(w, r.servicio.length + 2), 1);
            ser["!cols"] = [{ wch: tamServicio }]



            wb.Sheets["PRESTACION"] = ws;
            wb.Sheets["PRESTACION POR SEGURO"] = security;
            wb.Sheets["PRESTACION POR SERVICIO"] = ser;
            writeFile(wb, name + '.xlsx', { defaultCellStyle: defaultCellStyle });
        }


        return (
            <>
                <div className="hold-transition sidebar-mini" >
                    <div className="wrapper" >
                        <Home />
                        <div className="content-wrapper" style={{ background: 'white' }}>
                            <div className="content" >
                                <div className="container-fluid ">
                                    <div className="page-wrapper mt-1" >

                                        {
                                            verGrafic &&
                                            <div >

                                                <div className='col-auto' style={{ height: '33px', background: '#A3E4D7 ', marginBottom: '10px', fontSize: '18px' }}>
                                                    Estadísticas
                                                </div>
                                                <div className='row ' >

                                                    <div className='col-12  col-xl-4 col-lg-4 col-md-4 col-sm-12 text-center pr-2' >
                                                        <div className='row mb-1'>
                                                            <div className='col-auto'>
                                                                <Button className='Historial ' onClick={() => { setVerGrafic(false); setVerReports(true); cargarData() }}>Reportes<span className='btnNuevoIcono'><FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon></span> </Button>
                                                            </div>
                                                        </div>
                                                        <div className='col-12'>
                                                            <ComponenteInputMes
                                                                estado={mes1}
                                                                cambiarEstado={setMes1}
                                                                name="fechaini"
                                                                ExpresionRegular={INPUT.MES}  //expresion regular
                                                                etiqueta='Mes'
                                                                setIni={setFechaIni}
                                                                setFin={setFechaFin}
                                                                funcion={inicioInput}
                                                            />
                                                        </div>
                                                        <label className='labels' style={{}}>
                                                            {
                                                                new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date(fechaFin.campo))[0].toUpperCase() +
                                                                new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date(fechaFin.campo)).substring(1) + ' ' + año
                                                            }</label>

                                                        <div className='mt-3' style={{ borderBottom: "3px solid rgba(255, 99, 132, 0.5)" }}>
                                                            {seguro.map(e => (
                                                                <div className='row' key={e.seguro}>
                                                                    <div className='smalldiv col-1' style={{ background: 'rgba(255, 99, 132, 0.5)' }}></div>
                                                                    <label className='col-7 labels float-left'>{e.seguro}</label>
                                                                    <label className='col-4 labels float-left'>{e.cantidad}</label>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className=' mt-4' style={{ borderBottom: "3px solid rgba(53, 162, 235, 0.5)" }}>
                                                            {servicio.map(s => (
                                                                <div className='row' key={s.servicio}>
                                                                    <div className='smalldiv col-1' style={{ background: 'rgba(53, 162, 235, 0.5)' }}></div>
                                                                    <label className='col-10 labels float-left'>{s.servicio}</label>
                                                                    <label className='col-1 labels float-left'>{s.cantidad}</label>
                                                                </div>
                                                            ))}
                                                        </div>

                                                    </div>
                                                    <div className='col-12  col-xl-8 col-lg-8 col-md-8 col-sm-12 mt-5' >
                                                        <Bar data={data1} options={option} />
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {verReports &&
                                            <div className='card '>
                                                <div className='row '>
                                                    <div className='col-12 col-sm-3 col-md-2 col-lg-2'>
                                                        <ComponenteInputfecha
                                                            estado={fechaIni}
                                                            cambiarEstado={setFechaIni}
                                                            name="fechaini"
                                                            ExpresionRegular={INPUT.FECHA}  //expresion regular
                                                            etiqueta='Fecha inicio'
                                                        />
                                                    </div>
                                                    <div className='col-12 col-sm-3 col-md-2 col-lg-2'>
                                                        <ComponenteInputfecha
                                                            estado={fechaFin}
                                                            cambiarEstado={setFechaFin}
                                                            name="fechaini"
                                                            ExpresionRegular={INPUT.FECHA}  //expresion regular
                                                            etiqueta=' fecha fin'
                                                        />

                                                    </div>
                                                    <div className='col-12 col-sm-3 col-md-2 col-lg-2'>
                                                        <Select1
                                                            name="seguro"
                                                            estado={idSeguro}
                                                            cambiarEstado={setIdSeguro}
                                                            ExpresionRegular={INPUT.ID}
                                                            lista={listSeguro}
                                                            etiqueta='Seguros'
                                                        />
                                                    </div>
                                                    <div className='col-12 col-sm-3 col-md-2 col-lg-2'>
                                                        <Select1
                                                            estado={idServicio}
                                                            cambiarEstado={setIdServicio}
                                                            name="nombre"
                                                            ExpresionRegular={INPUT.ID}  //expresion regular
                                                            lista={servicioReportes}
                                                            etiqueta='Servicios'
                                                        />
                                                    </div>
                                                    <div className='col-12 col-sm-3 col-md-2 col-lg-2'>
                                                        <Select1
                                                            name="seguro"
                                                            estado={idMedico}
                                                            cambiarEstado={setIdMedico}
                                                            ExpresionRegular={INPUT.ID}
                                                            lista={medicos}
                                                            etiqueta='Medico Solicitante'
                                                        />
                                                    </div>
                                                    <div className="row p-2">
                                                        <div className='col-12 col-sm-3 col-md-2 col-lg-2'>
                                                            <Select1
                                                                name="seguro"
                                                                estado={idCriterio}
                                                                cambiarEstado={setIdCriterio}
                                                                ExpresionRegular={INPUT.ID}
                                                                lista={criterios}
                                                                etiqueta='Criterios de consulta'
                                                            />
                                                        </div>
                                                        <div className="col-auto mt-4">
                                                            <Button className=' btnReporte ' onClick={() => listar()}  >Consultar<span className='btnNuevoIcono'><FontAwesomeIcon icon={faDownload}></FontAwesomeIcon></span> </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="table table-responsive custom p-1 pt-0" style={{ height: '360px' }}>

                                                    <Table id="example12" className=" table table-sm">
                                                        <thead>
                                                            <tr >
                                                                <th className="col-1  ">CODIGO</th>
                                                                <th className="col-1  ">SEGURO</th>
                                                                <th className="col-2  ">SERVICIO</th>
                                                                <th className="col-2  ">ITEM</th>
                                                                <th className="col-3  ">MEDICO SOLICITANTE</th>
                                                                <th className="col-2  ">PACIENTE</th>
                                                                <th className="col-1  ">C.I.</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                            {
                                                                cantidad.map((c) => (
                                                                    c.codigosol != null &&
                                                                    <tr className='item' key={c.id}>
                                                                        <td className="col-1  ">{c.codigosol}</td>
                                                                        <td className="col-1 ">{c.seguro}</td>
                                                                        <td className="col-2  ">{c.servicio}</td>
                                                                        <td className="col-2  ">{c.item}</td>
                                                                        <td className="col-3 ">{c.solicitante}</td>
                                                                        <td className="col-2 ">{c.paciente}</td>
                                                                        <td className="col-1 ">{c.ci}</td>
                                                                    </tr>
                                                                ))}
                                                        </tbody>
                                                        <tfoot>

                                                        </tfoot>
                                                    </Table>
                                                </div>
                                                <div className="col-auto" style={{ height: '20px' }} >
                                                    <p className='textSombreado'>{'Items Solicitados : ' + total}</p>
                                                </div>
                                                <div className="row p-2" >
                                                    <div className="col-auto">
                                                        <Button className=' cancelarVentanaSolicitud ' onClick={() => { setVerGrafic(true); setVerReports(false) }}  >Cerrar<span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                                    </div>
                                                    <div className="col-auto">
                                                        <Button className=' Historial ' onClick={() => genExcel()} >Exportar Excel <span className='btnNuevoIcono'><FontAwesomeIcon icon={faFileExcel}></FontAwesomeIcon></span> </Button>
                                                    </div>
                                                    <div className="col-auto" >
                                                        <Button className='  solicitar' onClick={() => cargarData()}>Limpiar <span className='btnNuevoIcono'><FontAwesomeIcon icon={faList}></FontAwesomeIcon></span> </Button>
                                                    </div>
                                                </div>

                                            </div>
                                        }

                                    </div>
                                </div>
                            </div>
                        </div >
                    </div>
                    <Toaster position='top-right' />
                </div>
            </>
        );
    } catch (error) {
        auth.logout()
    }
}
export default ReportesTecnico;
