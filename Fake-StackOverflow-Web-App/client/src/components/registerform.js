import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData((prevData) => {
          const newData = { ...prevData, [id]: value };
    
          if (id === 'password') {
            const usernameInPassword = prevData.username && value.includes(prevData.username);
            const emailInPassword = prevData.email && value.includes(prevData.email);
    
            if (usernameInPassword || emailInPassword) {
              alert('Password cannot contain the username or email.');
              newData.password = '';
            }
          }

           return newData;
        });
      };

    const completeRegister = async (event) => {
        event.preventDefault();

        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (formData.email && !emailRegex.test(formData.email)) {
            alert('Invalid email format.');
            return;
        } 
        else if (!formData.username || !formData.email || !formData.password) {
            alert('Please fill in all required fields.');
            return;
        }
        else if (formData.password !== formData.passwordConfirm) {
            alert('Passwords do not match.');
            return;
        }

        try {
            await axios.post('http://localhost:8000/register', formData, { withCredentials: true });
            window.location.href = '/login';
        } catch (error) {
            console.error('Error creating new account', error);
            // Handle error appropriately, e.g., show an error message to the user
        }
    };

    return (
        <div style= {{paddingLeft: '20%'}}>
            <form id="registerform" className="form-group">
                <div>
                    <div className="form-group-reg">
                        <label className ="welc-label"> Username*</label>
                        <br />
                        <input className ="welc-input" type='text' id='username' value={formData.username} onChange={handleInputChange} required></input>       
                    </div>
                    <div className="form-group-reg">
                        <p style={{ display: 'block', textAlign: 'left', color: '#3d3d3d', padding: 0, margin:0 }}><i>  Provide email in form ********@****.**</i></p>
                        <div style={{display: 'block', width: '100%'}}>
                            <label className ="welc-label"> Email*</label> 
                            <br />
                            <input className ="welc-input" type='email' id='email' value={formData.email} onChange={handleInputChange} required></input> 
                        </div>
                    </div>
                    <div className="form-group-reg">  
                        <p style={{ display: 'block', textAlign: 'left', color: '#3d3d3d', padding: 0, margin:0}}><i>Password may not contain your username or email</i></p>
                        <label className ="welc-label"> Password*</label>
                        <br />
                        <input className ="welc-input" type='password' id='password' value={formData.password} onChange={handleInputChange} required></input> 
                    </div>
                    <div className="form-group-reg">
                        <label className ="welc-label"> Confirm password*</label>
                        <br />
                        <input className ="welc-input" type='password' id='passwordConfirm' value={formData.passwordConfirm} onChange={handleInputChange} required></input> 
                    </div> 
                </div>
                <div style= {{paddingLeft: '38%'}}>
                    <div className="form-group-reg" style={{textAlign: 'center', position: 'relative', paddingLeft: 0, width: '100%', paddingTop: '0px'}}>
                        <Link to='/login'>
                            <button className="welc-the-button" onClick={completeRegister} type="submit">Register</button>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default RegisterForm;