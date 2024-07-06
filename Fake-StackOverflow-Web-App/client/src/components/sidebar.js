import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false
        }
    }

    componentDidMount() {
        axios.get('http://localhost:8000/session-user', { withCredentials: true })
        .then(response => {
            if (response.data && (response.data.role === 'user' || response.data.role === 'admin')) { 
            this.setState({ isLoggedIn: true });
            }
        })
        .catch(error => {
            console.log(error)
        });
    }

    render() {
        return(
            <div className='sidebar'>
                <ul className='sidebarList'>
                    <Link to='/questions' style={{ textDecoration: 'none', color: 'inherit' }}>
                        <li  id='questions'>
                            <h1 className='sidebarContent'>
                                Questions
                            </h1>
                        
                        </li>
                    </Link>
                    <Link to='/tags' style={{ textDecoration: 'none', color: 'inherit' }}>
                        <li  id='tags'>
                            <h1 className='sidebarContent'>
                                Tags
                            </h1>
                        </li>
                    </Link>
                    {this.state.isLoggedIn && (<Link to='/profile' style={{ textDecoration: 'none', color: 'inherit' }}>
                        <li id='profile'>
                            <h1 className='sidebarContent'>
                                Profile
                            </h1>
                        </li>
                    </Link>)}
                </ul>
            </div>
        );
    }
}

export default Sidebar;