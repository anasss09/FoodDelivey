import React, { useEffect } from "react";
import { replace, useNavigate } from "react-router-dom";
import axios from '../utils/axios'
import { Navbar } from "react-bootstrap";

const Logout = () => {

    const navigate = useNavigate()
    useEffect(() => {
        async function logoutUser() {
            try {
                await axios.get('/logout')
                navigate('/')
                window.location.reload()
                

            } catch (error) {
                alert(error.response.data.message)
            }
        }

        logoutUser()
    }, [])
  return null
};

export default Logout;

