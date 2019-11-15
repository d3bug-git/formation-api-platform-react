import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import CustomersAPI from '../services/CustomersAPI';
import { toast } from 'react-toastify';

const CustomerPage = ({match,history}) => {
    const{id="new"} = match.params;

    const[customer,setCustomer] = useState({
        lastName:"",
        firstName:"",
        email:"",
        company:""
    });

    const [errors,setErrors] = useState({
        lastName:"",
        firstName:"",
        email:"",
        company:""
    });

    const [editing,setEditing] = useState(false);

    //Recuperation du customer en fonction d'un id
    const fetchCustomer = async id =>{
        try {
            const {firstName,lastName,email,company} = await CustomersAPI.find(id);
            setCustomer({firstName,lastName,email,company});
        } catch (error) {
            console.log(error.response);  
            //TODO: Notification Flash erreur
            toast.error("Le client n'a pas pu être chargé");
            history.replace("/customers")
        }
    }

    //Chargement du customer si besoin au chargement du composant ou au changement de l'identifiant
    useEffect(()=>{if(id !== "new"){
        setEditing(true);
        fetchCustomer(id);
    }},[id])
    
    //gestion des inputs dans le formulaire formulaire
    const handleChange = ({currentTarget}) =>{
        const {name,value} = currentTarget;
        setCustomer({...customer,[name]:value})
    }

    //gestion de la soumission dans le formulaires
    const handleSubmit = async event =>{
        event.preventDefault();
        try {
            if(editing){
                await CustomersAPI.update(id,customer);
                setErrors({});
                toast.success("Le client a bien été modifié");
            }else{
                await CustomersAPI.create(customer);
                setErrors({});
                toast.success("Le client a bien été enregsitré");
                history.replace("/customers")
            }
        } catch ({response}) {
            const {violations} = response.data;
            if(violations){
                const apiErrors ={}
                violations.forEach(({propertyPath,message})=>{
                    apiErrors[propertyPath] = message;
                });

                setErrors(apiErrors);
                toast.success("Des erreurs sont survenues");
            }
        }
    }

    return ( <>
        {!editing && (<h1>Création d'un client</h1>) || (<h1>Modification d'un client</h1>) }
        <form onSubmit={handleSubmit}>
            <Field 
                name="lastName"
                label="Nom de famille"
                value={customer.lastName}
                onChange={handleChange}
                error={errors.lastName}
            />
            <Field 
                name="firstName"
                label="Prenom" 
                value={customer.firstName}
                onChange={handleChange}
                error={errors.firstName}
            />
            <Field 
                name="email"
                label="Email"
                placeholder="Adresse email du client"
                type="email" 
                value={customer.email}
                onChange={handleChange}
                error={errors.email}
            />
            <Field 
                name="company"
                label="Entreprise" 
                placeholder="Entreprise du client"
                value={customer.company}
                onChange={handleChange}
                error={errors.company}
            />
            <div className="form-group">
                <button type="submit" className="btn btn-success">Enregister</button>
                <Link to="/customers" className="btn">Retour à la liste</Link>
            </div>
        </form>
    </> );
}
 
export default CustomerPage;