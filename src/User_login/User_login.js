import React from 'react';
import './User_login.css';
import axios from 'axios';
import Global_services from '../Global_services/Global_services';

function User_login(props){

React.useEffect(()=>{
    
},[]);


/* Login data */
var [login_data, set_login_data]=React.useState({
    username:'', 
    password:'',
})

/* Handle login data */
const login_handler =(e) =>{
    let name = e.target.name;
    let value = e.target.value;
    login_data[name]=value;
    set_login_data(login_data);
    console.log('FROM HANDLER')
    console.log(login_data)
}
    return (
        <div className='user-login-component'>

            <div className="wrapper fadeInDown">
                <div id="formContent">

                    <div className="fadeIn first">
                        <h4>Petit Prix</h4>
                    </div>

                    <input type="text" id="login" onChange={login_handler} className="fadeIn second" name="username" placeholder="Nom d'utilisateur" />
                    <input type="password" id="password" onChange={login_handler} className="fadeIn third" name="password" placeholder="Mot de passe" />
                    <input type="submit" onClick={() => props.check_login(login_data)} className="fadeIn fourth" value="Connexion" />
                    
                    {
                        props.is_valid_user ?
                        <div id="faild_login">
                            <h4 Style='color:#af4e4e'>Nom d'utilisateur / Mot de passe incorrect</h4>
                        </div>
                        :
                        ''
                    }
                    

                </div>
            </div>
        </div>
    )
}
export default User_login;