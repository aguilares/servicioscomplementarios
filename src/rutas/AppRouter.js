import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Check from './check';
import Formulario from '../login/login'
// import Registro from '../login/registro'
import React from 'react';

import PublicRoute from './publicRoute';

// import Nav from '../componentes/home';
import Usuario from '../componentes/usuario';
import ItemServicio from '../componentes/itemServicio';
import Solicitar from '../componentes/solicitar';

import AtorizarSolicitud from '../componentes/autorizarSolicitud';
import RegistrarSolicitud from '../componentes/registrarSolicitud';
import Resultado from '../componentes/resultados';

import Registrame from '../componentes/registrarme'

import ReportesEncargadoSP from '../componentes/reportes/reportesEncargadoSP'
import ReportesSolicitante from '../componentes/reportes/reportesSolicitante'
import ReportesTecnico from '../componentes/reportes/reportesTecnico'



import MiPerfil from '../componentes/miPerfil'
import Informaciones from '../componentes/informacion'
import Area from '../componentes/area'
import Servicio from '../componentes/servicio'
import Seguros from '../componentes/seguro'
import { useEffect } from "react";


import E500 from './e500'

import useAuth from "../Auth/useAuth";
import {TIEMPO_INACTIVO} from "../Auth/config";

export default function AppRouter() {

  const auth = useAuth()

  useEffect(() => {
    if (localStorage.getItem('token') != null) {
      const inter = setInterval(() => {
        const tiempo1 = localStorage.getItem('tiempo')
        if (!tiempo1 || localStorage.getItem('token') == null) { auth.logout() } // sino existe el cookie redireccionamos a la ventana login
        const tiempo2 = new Date().getMinutes()
        let dif = 0
        let aux1 = 0
        let aux2 = 0
        const maximo = 59
        const inicio = 0
        if (tiempo1 === tiempo2) {
          dif = 0
        }
        if (tiempo2 > tiempo1) {
          dif = tiempo2 - tiempo1
        } if (tiempo1 > tiempo2) {
          aux1 = maximo - tiempo1  //  59 - 50 = 10
          aux2 = tiempo2 - inicio  //  5 - 0  = 5
          dif = aux2 - aux1
        }
        if (dif >= TIEMPO_INACTIVO) {  // el tiempo de abandono tolerado, se define en el archivo varEntorno en unidades de tiempo MINUTOS
          auth.logout()
        }
      }, 10000);
      return inter;
    }

  }, [auth])

  const handleClick = () => {
    localStorage.setItem('tiempo', new Date().getMinutes())

  }

  const handleKeyPress = () => {
    localStorage.setItem('tiempo', new Date().getMinutes())
  }
  return (

    <BrowserRouter>
      <div onClick={handleClick} onKeyPress={handleKeyPress} >

        <Switch>
          <PublicRoute exact path="/" component={Formulario} />
          <PublicRoute exact path="/registrame" component={Registrame} />

          <Check exact path='/usuarios' component={Usuario} />
          <Check exact path='/area' component={Area} />
          <Check exact path='/servicios' component={Servicio} />
          <Check exact path='/seguros' component={Seguros} />

          <Check exact path='/autorizarsolicitud' component={AtorizarSolicitud} />
          <Check exact path='/reportesEncargadoSP' component={ReportesEncargadoSP} />



          <Check exact path='/reportesSolicitante' component={ReportesSolicitante} />
          <Check exact path='/solicitudes' component={Solicitar} />

          <Check exact path='/resultados' component={Resultado} />
          <Check exact path='/itemservicio' component={ItemServicio} />
          <Check exact path='/miPerfil' component={MiPerfil} />
          <Check exact path='/Hospital' component={Informaciones} />
          <Check exact path='/reportesTecnico' component={ReportesTecnico} />
          

          <Route exact path="*" component={E500} />

        </Switch>
      </div>
    </BrowserRouter>

  )
}

