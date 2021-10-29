import React,{useState,useEffect} from 'react'
import {useLocation } from 'react-router-dom'
import { CALL_API } from '../../api'
import { BODY, ENDPOINT_WELCOME, HEADER_GET_TOKEN, METHOD_POST } from '../../constants';
export default function Welcome() {
    const query = new URLSearchParams(useLocation().search);
    const token = query.get("token");
    const [checkToken,setCheckToken] = useState(token==null?"":token);
    const [user,setUser] = useState({})
    useEffect(()=>{
        var requestOptions = {
            _endpoint:ENDPOINT_WELCOME,
            _method:METHOD_POST,
            _header:HEADER_GET_TOKEN(checkToken),
            _data:BODY(checkToken)
            
        }
        console.log(requestOptions);
        CALL_API(requestOptions).then(item=>setUser(item)).catch(err=>console.log(err)) 

    },[checkToken]);
    const renderUser=<div className="user">
        <h1>Welcome</h1>
        <label>Email : {user.email}</label>
       
    </div>
    return (
        <div>
            {
                checkToken!==""?renderUser:<h1>Chưa xác thực</h1>
            }
        </div>
    )
}
