import React, { useEffect } from "react";
import axios from "../../utils/axios";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Badge, Image, Button, Dropdown } from "react-bootstrap";
import Styles from './Navbar.module.css'
import { useDispatch, useSelector } from "react-redux";
import ProfileImage from "../ProfileImage";

const NavbarApp = () => {
    const userData = useSelector(state => state.userReducer)
    const cartData = useSelector(state => state.cartReducer || { items: [] }); // Add cart data if available
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(() => {
        const isLoggedIn = async () => {
            try {
                const { data } = await axios.get('/getuser');                
                if (data.user) {
                    console.log("DATA ", data.user);
                    // SET THE DATA TO REDUX
                    dispatch({ type: 'SET_USER', payload: data.user })
                }
            } catch (error) {
                console.log(error.response?.data?.message || "Authentication failed")
            }
        }
        isLoggedIn();
    }, [dispatch, navigate]); // Added dependencies

    function handleLogout() {
        navigate('/logout')
    }

    // Calculate cart items count
    const cartItemsCount = cartData?.items?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

    return (
        <Navbar bg="light" expand="lg" className="shadow-sm py-3">
            <Container>
                {/* Brand / Logo */}
                <Navbar.Brand 
                    as={NavLink} 
                    to='/app'
                    className="fw-bold text-primary fs-4 text-decoration-none"
                >
                    🍴 Foodie
                </Navbar.Brand>

                {/* Toggle button for mobile */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        {!userData?.isLoggedIn ? (
                            <>
                                <Nav.Link as={NavLink} to="/login" className="mx-2">
                                    Login
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/signup" className="mx-2">
                                    Sign Up
                                </Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={NavLink} to="/app" className="mx-2">
                                    Home
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/history" className="mx-2">
                                    History
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/cart" className="mx-2 position-relative">
                                    Cart
                                    {cartItemsCount > 0 && (
                                        <Badge 
                                            bg="danger" 
                                            className="position-absolute top-0 start-100 translate-middle"
                                            style={{ fontSize: "0.6rem" }}
                                        >
                                            {cartItemsCount}
                                        </Badge>
                                    )}
                                </Nav.Link>

                                <Dropdown align="end" className="ms-3">
                                    <Dropdown.Toggle
                                        variant="light"
                                        id="dropdown-profile"
                                        className="p-0 border-0 bg-transparent"
                                    >
                                        <Image
                                            src={userData?.image || ProfileImage}
                                            alt="Profile"
                                            roundedCircle
                                            width="40"
                                            height="40"
                                            style={{ 
                                                objectFit: "cover", 
                                                border: "2px solid #007bff", 
                                                cursor: "pointer" 
                                            }}
                                            onError={(e) => {
                                                e.target.src = ProfileImage; // Fallback image
                                            }}
                                        />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => navigate("/profile")}>
                                            👤 Profile
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => navigate("/orders")}>
                                            📦 My Orders
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={handleLogout} className="text-danger">
                                            🚪 Logout
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarApp;