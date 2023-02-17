import { Route, Redirect } from "react-router-dom"
import React from 'react';
import useAuth from "../Auth/useAuth"



export default function PublicRoute({ component: Component, ...rest }) {
    const auth = useAuth();
    let url = null
    if (parseInt(localStorage.getItem('numRol'))=== 1) {
        url = "/autorizarsolicitud"
    }
    if (parseInt(localStorage.getItem('numRol')) === 2) {
        url = "/solicitudes"
    }
    if (parseInt(localStorage.getItem('numRol')) === 3 || parseInt(localStorage.getItem('numRol')) === 4 ||
    parseInt(localStorage.getItem('numRol')) === 5 || parseInt(localStorage.getItem('numRol')) === 6 ||
    parseInt(localStorage.getItem('numRol')) === 7 || parseInt(localStorage.getItem('numRol')) === 8 ) {
        url = "/resultados"
    }

    if (parseInt(localStorage.getItem('numRol')) === 22) {
        url = "/usuarios"
    }

    return (
        <Route {...rest}>
            {auth.isLogged() ? (
                // window.location.href = url
                <Redirect to = {url} />

            ) : (
                <Component />
            )}
        </Route>
    );
} 