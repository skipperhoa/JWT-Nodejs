export const URL_API = "http://localhost:4001";
export const ENDPOINT_LOGIN = `${URL_API}/login`;
export const ENDPOINT_REGISTER = `${URL_API}/register`;
export const ENDPOINT_WELCOME = `${URL_API}/welcome`;
export const METHOD_POST ="POST"
export const METHOD_GET = "GET"
export const BODY = (_body)=>{return JSON.stringify(_body)}
export const HEADER = {
     Accept: 'application/json',
    'Content-Type': 'application/json'
}
export const HEADER_GET_TOKEN = (token)=>{
    return{   
        'Content-Type': 'application/json',
         'x-access-token': token    
    }
}