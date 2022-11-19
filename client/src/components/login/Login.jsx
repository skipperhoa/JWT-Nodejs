import React,{useState} from 'react'
import {useHistory } from 'react-router-dom'
import "./style.scss"
import {CALL_API} from '../../api'
import { ENDPOINT_LOGIN, METHOD_POST,HEADER,BODY } from '../../constants'
const Login=()=>{
    let history = useHistory()
    const [data,setData] = useState({
        "email":"",
        "password":""
    });
    const handelChange=(e)=>{
        setData({...data,[e.target.name]:e.target.value})
     }
    const btnSubmit = (event) =>{
        event.preventDefault();
        console.log(data);
        var requestOptions = {
            _endpoint:ENDPOINT_LOGIN,
            _method:METHOD_POST,
            _header:HEADER,
            _body:BODY(data)  
        }
        CALL_API(requestOptions)
        .then(item=>{
             if(item.success===1){
                history.push("/welcome?token="+item.token);
            } 

        })
        .catch(err=>console.log(err));
    }
    return (
        <div className="FormLogin">
            <form className="_form" onSubmit={btnSubmit}>
                <h2>Sign in Website</h2>
                <div className="form-group">
                    <label htmlFor="Email">Email</label>
                    <input type="email" name="email" onChange={handelChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="Password">Password</label>
                    <input type="password" name="password" onChange={handelChange} required />
                </div>
                <div className="form-group">
                    <button className="btn-submit">Sign in</button>
                </div>
            </form>
        </div>
    )
}
export default  Login;