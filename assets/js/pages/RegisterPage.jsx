import React,{useState} from 'react';
import Field from '../components/forms/Field';
import {Link} from 'react-router-dom'
import axios from 'axios';
import UsersApi from '../services/UsersAPI';

const RegisterPage = ({history}) => {

    const [user,setUser] = useState({
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        passwordConfirm:""
    });

    const [errors,setErrors] = useState({
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        passwordConfirm:""
    });

    //Gestion du changement des inputs dans le formulaire
    const handleChange = ({currentTarget}) => {
        const {name,value} = currentTarget;
        setUser({...user,[name]:value});
    }

    //Gestion de la soumission
    const handleSubmit = async event => {
        event.preventDefault();
        const apiErrors={};
        if(user.password !== user.passwordConfirm){
            apiErrors.passwordConfirm ="Votre confirmation de mot de passe n'est pas conforme avec le mot de passe originale"
            setErrors(apiErrors)
            return ;
        }
        try {
            await UsersApi.register(user)
            setErrors({});
            //TODO; flash succcess
            history.replace("/login");
        } catch ({response}) {
            const {violations} = response.data;
            if(violations){
                violations.forEach(({propertyPath,message})=>{
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors)
            }
            //TODO: flash erreur
        }
    }

    return ( 
        <>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="Votre jolie prénom"
                    error={errors.firstName}
                    value={user.firstName}
                    onChange={handleChange}
                />
                <Field
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Votre jolie nom de famille"
                    error={errors.lastName}
                    value={user.lastName}
                    onChange={handleChange}
                />
                <Field
                    name="email"
                    label="Adresse email"
                    placeholder="Votre adresse email"
                    type="email"
                    error={errors.email}
                    value={user.email}
                    onChange={handleChange}
                />
                <Field
                    name="password"
                    label="Mot de passe"
                    placeholder="Votre mot de passe "
                    type="password"
                    error={errors.password}
                    value={user.password}
                    onChange={handleChange}
                />
                <Field
                    name="passwordConfirm"
                    label="Confirmation de mot de passe"
                    placeholder="Confirmez votre super mot de passe"
                    type="password"
                    error={errors.passwordConfirm}
                    value={user.passwordConfirm}
                    onChange={handleChange}
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Confirmation</button>
                    <Link to="/login" className="btn btn-link">J'ai déja un compte</Link>
                </div>
            </form>
        </>
     );
}
 
export default RegisterPage;