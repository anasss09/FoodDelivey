import { useDispatch, useSelector } from "react-redux";
import axios from "../../utils/axios";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";


const Login = () => {
	const userData = useSelector(state => state.userReducer)
	const emailRef = useRef();
	const passwordRef = useRef();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onSubmitHandler = async (ev) => {
		ev.preventDefault();
		const username = emailRef.current.value.trim();
		const password = passwordRef.current.value;

		if (!username) return alert("Please enter username");
		if (!password) return alert("Please enter password");

		try {
			const { data } = await axios.post("login", { username, password });
			dispatch({
				type: "SET_USER",
				payload: data.user,
			});
		
			if(data) {
				console.log('navigating to /app');
				navigate("/app");
			}
		} catch (error) {
			const msg = error?.response?.data?.message || "Login failed. Please try again.";
			alert(msg);
			console.error(msg);
		}
	};
	
	return (
		<>
			{!userData.isLoggedIn && (
				<div className="d-flex justify-content-center bg-light mt-5">
					<Card style={{ width: "400px", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
						<Card.Body>
							<h2 className="text-center mb-4" style={{ fontWeight: "600", color: "#007bff" }}>Login</h2>
							<Form onSubmit={onSubmitHandler} className="form-control">
								<Form.Group className="mb-3" >
									<Form.Label>Username</Form.Label>
									<Form.Control ref={emailRef} type="text" placeholder="Enter username or email" />
								</Form.Group>

								<Form.Group className="mb-3" >
									<Form.Label>Password</Form.Label>
									<Form.Control ref={passwordRef} type="password" placeholder="Enter password" />
								</Form.Group>

								<Button variant="primary" type="submit" className="w-100">Login</Button>
							</Form>
						</Card.Body>
					</Card>
				</div>
			)}
		</>
	);
};

export default Login;