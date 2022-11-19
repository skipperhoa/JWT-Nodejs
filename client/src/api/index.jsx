export const CALL_API=(data)=>{
    const {_endpoint,_method,_body,_header} = data;
    var requestOptions = {
        method:_method, 
    }
    if(_method==="POST"){
       requestOptions = {...requestOptions,
            body:_body,
            headers: _header
        };
    } 
    return new Promise((resolve, reject) => {
            const fetchPromise = fetch(_endpoint,requestOptions);
            fetchPromise.then(response => {
                resolve(response.json())
            }).then(err => {
                reject(err)
            });
    });   

  
}
