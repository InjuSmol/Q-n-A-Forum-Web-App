import React, { Component } from 'react';
import QuestionPage from './questionmainpage';
import axios from 'axios';
import RegisterForm from './registerform';
import LoginForm from './loginform';
import { Link } from 'react-router-dom';

class WelcomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      name: "Guest",
    };
  }

  // completeLogin = async () =>{
  //   const {new_username, new_password} = this.state.userData;
  //   if(!new_username || !new_password) {
  //     alert('Please fill in all required fields.');
  //     return;
  //   }

  //   try {
  //     await axios.post('http://localhost:8000/login', this.state.userData);
  //     this.setState({mainView: true});
  //   } catch (error) {
  //     console.error('Error logging in', error);
  //   }
  // };

  render() {
    //if (!this.state.mainView){ // need to update this mainView somewhere
        //if (req.session.user) {
        //name = req.session.user;
        //}

        //<div className="welc-elem" id="welc-title">
        return(
          <div className="container">
            <div className="form-group">
              <h1 style={{marginTop: '30px', fontSize: '30px', color: "#383838"}}><i>Welcome, {this.state.name} !</i></h1>
            </div>
            <div className="form-group" id="nav-buttons">
              <Link to='/login'>
                <button className="welc-buttons" id="loginBtn" style={{borderLeft: 0, borderTopRightRadius: '5px', borderBottomRightRadius: '5px'}}>Login</button>
              </Link>
              <Link to='/register'>
                <button className="welc-buttons" id="registerBtn">Register</button>
              </Link>
              <Link to='/questions'>
                <button className="welc-buttons"style={{borderRight: 0, borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px'}}  >Continue as a Guest</button>
              </Link>
            </div>
          </div>    
        )
        //<div className="welc-elem" > </div>


        //<div className="welc-elem" id="forms">  </div>


    }/*else  {// if () <<<< selected continue as a Quest
        return(<QuestionPage />);
    }*/

//}
}

export default WelcomePage;