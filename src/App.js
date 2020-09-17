import React from 'react';
import User_login from './User_login/User_login';
import './App.css';
import axios from 'axios';
import Global_services from './Global_services/Global_services';
import Menu from './Menu/Menu';
function App() {

  const [is_valid_user,set_is_valid_user] = React.useState(false);

  const check_login=(login_data)=>{
    axios.post(Global_services.check_login,login_data).then(
        response => {
            if(response.data=='VALID_USER'){
              set_is_valid_user(true)
            }else{
              set_is_valid_user(false)
            }
        },error => {
          console.log(error)
        }
    );
}
  return (
    <div className='container'>
      {
        !is_valid_user?
        <User_login check_login={check_login}/>
        :
          <Menu />
      
      }
      
    </div>
  );

}


export default App;
