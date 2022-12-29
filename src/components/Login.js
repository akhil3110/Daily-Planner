import React ,{useState} from 'react'
import {useNavigate} from 'react-router-dom';

const Login = (props) => {

    const host = "http://localhost:5000";
    const navigate = useNavigate();
    const [credentals, setCredentals] = useState({email: '', password: ''})
   

    const onChange =  (event) =>{
        setCredentals({...credentals, [event.target.name]: event.target.value })
     }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        const response = await fetch(`${host}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: credentals.email, password: credentals.password})
          });
      
          const json = await response.json();
          console.log(json);

          if(json.success){
            //redirect
            localStorage.setItem('token',json.authToken);
            console.log(localStorage.getItem('token'))
            navigate("/")
            props.showAlert("Logged in Succesfully","success")
          }else{
            props.showAlert("Credentials Not Matched","danger")
            
          }
    }

    return (
        <>
        <div className="continer mb-3">
            <h2>Please Login To continue to Daily Planner</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email1" className="form-label">Email address</label>
                    <input type="email"  name='email' className="form-control" value={credentals.email} onChange={onChange} id="email1" aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" name='password' value={credentals.password} onChange={onChange} className="form-control" id="password" />
                </div>
                <button type="submit" className="btn btn-primary" >Submit</button>
            </form>
        </div>
        </>
    )
}

export default Login