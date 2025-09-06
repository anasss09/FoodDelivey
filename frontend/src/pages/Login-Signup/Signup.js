import axios from "../../utils/axios";
import React, { useRef, useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import profileImg from '../../assets/profile.png'
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const Signup = () => {

  const userData = useSelector(state => state.userReducer)

  const nagivate = useNavigate()
  const usernameRef = useRef();
  const passwordRef = useRef();
  const emailRef = useRef();
  const nameRef = useRef();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);


  const handlePickImage = () => fileInputRef.current.click();
  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
    const file = fileInputRef.current.files[0];
    return file;
  };

  async function onSubmitHandler(ev) {
    ev.preventDefault();
    const fileImage = selectedFile;
    const username = usernameRef.current.value
    const email = emailRef.current.value
    const password = passwordRef.current.value
    const name = nameRef.current.value

    // Prepare form data
    const formData = new FormData();
    formData.append("image", fileImage);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("name", name);

    try {
      const { data } = await axios.post('signup', formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(data);
      nagivate('/login')
    } catch (error) {
      console.log(error.response.data)
    }
  }


  return (

    <>
      {!userData.isLoggedIn && (
        <div className="d-flex justify-content-center bg-light mt-4">
          <Card style={{ width: "400px", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
            <Card.Body>
              <div className="text-center mb-4">
                <img
                  src={selectedFile ? URL.createObjectURL(selectedFile) : profileImg}
                  alt="Profile"
                  onClick={handlePickImage}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    cursor: "pointer",
                    objectFit: "cover",
                    border: "2px solid #007bff",
                    padding: "3px",
                  }}
                />

                <Form.Control
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  style={{ display: "none" }}
                />
              </div>
              <Form onSubmit={onSubmitHandler} className="form-control">

                <Form.Group className="mb-3" >
                  <Form.Label>Username</Form.Label>
                  <Form.Control ref={usernameRef} type="text" placeholder="Enter username" />
                </Form.Group>

                <Form.Group className="mb-3" >
                  <Form.Label>Password</Form.Label>
                  <Form.Control ref={passwordRef} type="password" placeholder="Enter password" />
                </Form.Group>

                <Form.Group className="mb-3" >
                  <Form.Label>Email address</Form.Label>
                  <Form.Control ref={emailRef} type="email" placeholder="name@example.com" />
                </Form.Group>

                <Form.Group className="mb-3" >
                  <Form.Label>Name</Form.Label>
                  <Form.Control ref={nameRef} type="text" placeholder="Enter name" />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">Signup</Button>
              </Form>

            </Card.Body>
          </Card>
        </div>
      )}
    </>
  );
};

export default Signup;