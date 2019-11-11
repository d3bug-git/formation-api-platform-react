import React, { useState,useContext } from 'react';
import AuthAPI from '../services/AuthAPI';
import AuthContext from '../contexts/AuthContext';

const LoginPage = ({history}) => {

    const {setIsAuthenticated} = useContext(AuthContext);

    const [credentials,setCredentials] = useState({
        username:"",
        password:""
    })

    const [error,setError] = useState("");

    //Gestion des champs
    const handleChange = ({currentTarget})=>{
        const{value,name} = currentTarget

        setCredentials({
            ...credentials, [name]:value
        })
    }
    //Gestion du submit
    const handleSubmit = async event =>{
        event.preventDefault();
        
        try {
           await AuthAPI.authenticate(credentials)
           setError("");
           setIsAuthenticated(true);
           history.replace("/customers");
        } catch (error) {
            setError("Aucun compte ne possède cette adresse email ou alors les informations ne correspondent pas");
        }
    }
    return ( 
        <>
            <h1>Connexion à l'application</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Adresse email</label>
                    <input 
                        type="email" placeholder="Adresse email de connexion" 
                        id="username" value={credentials.username}
                        onChange={handleChange}
                        name="username" className={"form-control"+ (error && " is-invalid")}
                    />
                </div>
                {error && <div className="text-danger">{error}</div>}
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password"
                        value={credentials.password}
                        onChange={handleChange}
                        name="password" placeholder="Mot de passe"
                        className="form-control" id="password"
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">je me connecte</button>
                </div>
            </form>
        </>
     );
}
 
export default LoginPage;