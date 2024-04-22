import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = ({ }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:8080/api/sessions/validate')
      .then(response => {
        console.log(response.data)
        if (response.data.valid) {
          navigate('/productlist')
        } else {
          console.log("No hay sesión activa")
        }
      })
      .catch(error => {
        console.log(error)
      })
  }, []); // Fetch products when filters change

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Realizar la solicitud POST al servidor para iniciar sesión
            const response = await axios.post('http://localhost:8080/api/sessions/login', {
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                // El inicio de sesión fue exitoso
                const userData = await response;
                console.log('User data:', userData);
                //Redirect to home page
                window.location.href = '/productlist';
            } else {
                // El inicio de sesión falló, muestra un mensaje de error
                setError('Invalid email or password');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('An error occurred while logging in');
        }
    };


    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={handleEmailChange} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={handlePasswordChange} />
                </div>
                <button type="submit">Login</button>
            </form>
            {error && <p>{error}</p>}
            <p>Don't have an account? <Link to="/register">Register here</Link></p>

        </div>
    );

};

export default LoginPage;
