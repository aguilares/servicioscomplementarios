import useAuth from "../../Auth/useAuth";
import { Link } from "react-router-dom";
import React from 'react';
// import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentMedical, faHospital, faHospitalUser, faShieldAlt, faUserFriends, faUserNurse } from '@fortawesome/free-solid-svg-icons';


function Home() {
    const auth = useAuth()

    // const [dropdown, setDropDown] = useState(false)

    // const abrirMenu = () => {
    //     setDropDown(!dropdown)
    // }


    const salir = () => {
        let ok = window.confirm('Cerrar Sesion ?')
        if (ok) {
            auth.logout()
        }
    }

    return (
        <>
            <div>
                <nav className="main-header navbar navbar-expand navbar-white navbar-light" style={{ height: '60px' }}>
                    <ul className="navbar-nav" style={{ paddingTop: '10px' }}>
                        <li key="uniqueId1" className="nav-item">
                            <p className="nav-link" data-widget="pushmenu" role="button"><i className="fas fa-bars"></i></p>
                        </li>
                        <li key="uniqueId2" className="nav-item d-none d-sm-inline-block">
                            <Link to="/" className="nav-link">Inicio</Link>
                        </li>
                    </ul>

                </nav>
                <aside className="main-sidebar sidebar-dark-primary " style={{ height: '100%' }}>
                    <div className="brand-link pb-0" >
                        <div className="text-center">
                            <img src="dist/img/sp.png" alt="perfil" className="img-circle elevation-4" style={{ width: '50px', height: '50px' }} />
                        </div>
                        <div className="text-center">
                            <p className="brand-text font-weight-light" style={{ fontSize: '14px' }}>{localStorage.getItem('nombre') + ' ' + localStorage.getItem('apellido')}</p>
                            <p><small className="brand-text font-weight-light" style={{ fontSize: '14px' }}>{localStorage.getItem('rol')}</small></p>
                            {/*<small className="brand-text font-weight-light" style={{ fontSize: '10px' }}>{localStorage.getItem('servicio')}</small>
                        <small className="brand-text font-weight-light" style={{ fontSize: '10px' }}>{localStorage.getItem('rol')}</small> */}

                        </div>
                    </div>

                    <div className="sidebar">
                        <nav className="mt-1">
                            {parseInt(localStorage.getItem('numRol')) === 22 && <div>
                                <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

                                    {/* <Dropdown isOpen={dropdown} toggle={abrirMenu} >
                                        <DropdownToggle caret className="abrirMenu" >
                                            Ejemplo 1
                                        </DropdownToggle>

                                        <DropdownMenu>
                                          
                                            <li key="uniqueId7" className="itemMenu">
                                                <Link to='/servicio' className="nav-link">
                                                    <i className="fas fa-clinic-medical nav-icon"></i>
                                                    <p>servicios</p>
                                                </Link>
                                            </li>
                                            <li key="uniqueId7" className="nav-item ">
                                                <Link to='/servicio' className="nav-link">
                                                    <i className="fas fa-clinic-medical nav-icon"></i>
                                                    <p>servicios</p>
                                                </Link>
                                            </li>
                                            <li key="uniqueId7" className="nav-item ">
                                                <Link to='/servicio' className="nav-link">
                                                    <i className="fas fa-clinic-medical nav-icon"></i>
                                                    <p>servicios</p>
                                                </Link>
                                            </li>
                                        </DropdownMenu>
                                    </Dropdown> */}
                                    <li key="uniqueId1s0" className="nav-item">
                                        <Link to='/usuarios' className="nav-link">
                                            <FontAwesomeIcon icon={faUserFriends} className='nav-icon'></FontAwesomeIcon>
                                            <p>usuarios</p>
                                        </Link>
                                    </li>
                                    <li key="uniqueId7s" className="nav-item ">
                                        <Link to='/area' className="nav-link">
                                            <i className="fas fa-clinic-medical nav-icon"></i>
                                            <p>Area</p>
                                        </Link>
                                    </li>
                                    <li key="uniquseId7" className="nav-item ">
                                        <Link to='/servicios' className="nav-link">
                                            <FontAwesomeIcon icon={faHospitalUser} className='nav-icon'></FontAwesomeIcon>
                                            <p>Servicios</p>
                                        </Link>
                                    </li>
                                    <li key="uniqsueId7" className="nav-item ">
                                        <Link to='/seguros' className="nav-link">
                                            <FontAwesomeIcon icon={faShieldAlt} className='nav-icon'></FontAwesomeIcon>
                                            <p>Seguros</p>
                                        </Link>
                                    </li>
                                    <li key="uniqueId10" className="nav-item">
                                        <Link to='/hospital' className="nav-link">
                                            {/* <i className="fas fa-hospital-user nav-icon"></i> */}
                                            <FontAwesomeIcon icon={faHospital} className='nav-icon'></FontAwesomeIcon>
                                            <p>Hospital</p>
                                        </Link>
                                    </li>

                                </ul>
                            </div>}

                            {parseInt(localStorage.getItem('numRol')) === 1 && <div>
                                <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

                                    <li key="uniqueId64" className="nav-item">
                                        <Link to='/autorizarsolicitud' className="nav-link">
                                            <i className="fas fa-notes-medical nav-icon"></i>
                                            <p>Solicitudes</p>
                                        </Link>
                                    </li>
                                    <li key="uniqueId02" className="nav-item">
                                        <Link to='/reportesEncargadoSP' className="nav-link">
                                            <i className="fas fa-laptop-medical nav-icon"></i>
                                            <p>Reportes</p>
                                        </Link>
                                    </li>
                                </ul>
                            </div>}

                            {(parseInt(localStorage.getItem('numRol')) === 3 || parseInt(localStorage.getItem('numRol')) === 4 ||
                                parseInt(localStorage.getItem('numRol')) === 5 || parseInt(localStorage.getItem('numRol')) === 6 ||
                                parseInt(localStorage.getItem('numRol')) === 7 || parseInt(localStorage.getItem('numRol')) === 8) && <div>
                                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

                                        <li key="uniqueIdss41" className="nav-item">
                                            <Link to='/resultados' className="nav-link">
                                                <i className="fas fa-notes-medical nav-icon"></i>
                                                <p>Resultados </p>
                                            </Link>
                                        </li>

                                        <li key="uniqueId8" className="nav-item">
                                            <Link to='/itemservicio' className="nav-link">
                                                <i className="fas fa-list nav-icon"></i>
                                                <p>Servicios</p>
                                            </Link>
                                        </li>
                                        <li key="uniqueId02" className="nav-item">
                                        <Link to='/reportesTecnico' className="nav-link">
                                            <i className="fas fa-laptop-medical nav-icon"></i>
                                            <p>Reportes</p>
                                        </Link>
                                    </li>
                                    </ul>
                                </div>}
                            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                                {/* <li key="uniqueId04" className="nav-item" >
                                    <Link to='#' className="nav-link">
                                        <i className="nav-icon fas fa-power-off"></i>
                                        <p>
                                            CERRAR SESION
                                            <i className="right fas fa-angle-left"></i>
                                        </p>
                                    </Link>
                                    <ul className="nav nav-treeview"> */}

                                {parseInt(localStorage.getItem('numRol')) === 2 && <div>
                                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

                                        <li key="uniqueIdss47" className="nav-item">
                                            <Link to='/solicitudes' className="nav-link">
                                                <i className="fas fa-notes-medical nav-icon"></i>
                                                <p>Pacientes </p>
                                            </Link>
                                        </li>
                                    </ul>
                                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                                        <li key="uniqueId01" className="nav-item">
                                            <Link to='/reportesSolicitante' className="nav-link">
                                                <i className="fas fa-laptop-medical nav-icon"></i>

                                                <p>
                                                    Reportes
                                                    {/* <span className="right badge badge-danger">New</span> */}
                                                </p>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>}
                                <br></br>
                                <li key="uniqueI05" className="nav-item">
                                    <Link to='/miPerfil' className="nav-link">
                                        <i className="nav-icon fas fa-user"></i>
                                        <p>Mi Perfil</p>
                                    </Link>
                                </li>
                                <li key="uniqueI025" className="nav-item">
                                    <Link to='#' onClick={salir} className="nav-link">
                                        <i className="nav-icon fas fa-power-off"></i>
                                        <p>Salir</p>
                                    </Link>
                                </li>
                                {/* </ul>
                                </li> */}
                            </ul>
                        </nav>
                    </div>
                </aside>
            </div >

        </>
    )
}
export default Home;