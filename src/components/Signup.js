import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom';
import Alert from './Alert';

const Signup = (props) => {

  
  const host = "http://localhost:5000";
  const navigate = useNavigate();
  const [credentals, setCredentals] = useState({name:'',email: '', password: '',cpassword: ''})

  const onChange = (event) =>{
    setCredentals({...credentals, [event.target.name]: event.target.value })
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    const response = await fetch(`${host}/api/auth/createuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name: credentals.name,email: credentals.email, password: credentals.password, cpassword: credentals.cpassword})
      });
  
      const json = await response.json();
      console.log(json);

     
      if(json.success){
        //redirect
        localStorage.setItem('token',json.authtoken)
        navigate('/login')
        props.showAlert("User Registered","success")
      }else{
        props.showAlert("Email Already Exists","danger")
      }
}

  return (
    <div className="container mt-3">
      <h2>Create an Account to continue to Daily Planner</h2>
      <form onSubmit={handleSubmit}>
      <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" name='name' className="form-control" id="name" aria-describedby="nameHelp" onChange={onChange} value={credentals.name} />
          
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" name='email' className="form-control" id="email1" aria-describedby="emailHelp" onChange={onChange} value={credentals.email} />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" name='password' className="form-control" id="password" onChange={onChange} value={credentals.password}  minLength={5} required/>
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input type="password" name='cpassword' className="form-control" id="cpassword" onChange={onChange} value={credentals.cpassword}  minLength={5} required/>
        </div>
        <button disabled={credentals.password !== credentals.cpassword} type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default Signup