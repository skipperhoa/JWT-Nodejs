import React,{useState} from 'react'
import {useHistory } from 'react-router-dom'
import { CALL_API } from '../../api';
import {HEADER,BODY, METHOD_POST, ENDPOINT_REGISTER } from '../../constants';
import "./style.scss"
export default function Register() {
    let history = useHistory()
    const [data,setData] = useState({
        "first_name":"",
        "last_name":"",
        "email":"",
        "password":""
    });
    const handelChange=(e)=>{
        setData({...data,[e.target.name]:e.target.value})
     }
    const btnSubmit = (event) =>{
        event.preventDefault();
        const requestOptions = {
            _endpoint:ENDPOINT_REGISTER,
            _method:METHOD_POST,
            _header:HEADER,
            _body: BODY(data)
        }
      CALL_API(requestOptions).then(res=>{
          if(res.success==0){
              alert(`${res.description}`);
          }
          else{
              alert(`${res.description}`);
              history.push("/login");
          }
      }).catch(err=>console.log(err)); 
    }

  
    return (
        <div className="FormRegister">
        <form className="_form" onSubmit={btnSubmit}>
            <h2>Register Website</h2>
            <div className="form-group">
                <label htmlFor="First Name">Fist Name</label>
                <input type="text" name="first_name" onChange={handelChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="Last Name">Last Name</label>
                <input type="text" name="last_name" onChange={handelChange}  required />
            </div>
            <div className="form-group">
                <label htmlFor="Email">Email</label>
                <input type="email" name="email" onChange={handelChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="Password">Password</label>
                <input type="password" name="password" onChange={handelChange}  required />
            </div>
            <div className="form-group">
                <button className="btn-submit">Register</button>
            </div>
        </form>
        
    </div>
    )
}
