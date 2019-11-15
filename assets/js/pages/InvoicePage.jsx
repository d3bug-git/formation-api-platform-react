import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import CustomersAPI from '../services/CustomersAPI';
import InvoicesAPI from '../services/InvoicesAPI';

const InvoicePage = ({history,match}) => {
    const {id="new"} = match.params;

    const [invoice,setInvoice] = useState({
        amount:"",
        customer:"",
        status:"SENT"
    }); 
    const [customers,setCustomers] = useState([])
    const [editing,setEditing] = useState(false);
    const [errors,setErrors] = useState({
        amount:"",
        customer:"",
        status:""
    })

    //recuperation des clients
    const fetchCustomers = async ()=>{
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            //if(!invoice.customer)setInvoice({...invoice,customer:data[0].id}); 
        } catch (error) {
            toast.error("impossible de charger les clients");
            history.replace("/invoices");
        }
    } 
    //recuperation d'une facture
    const fetchInvoice = async id => {
        try {
            const {amount,status,customer} = await InvoicesAPI.find(id);
            setInvoice({amount,status,customer:customer.id});
        } catch (error) {
            toast.error("impossible de charger la facture demandé");
            history.replace("/invoices");
            //TODO: flash notification erreur
        }
    }
    //recuperation de la liste des composant à chaque chargement du composant
    useEffect(()=>{
            fetchCustomers();
        },[])
    //recupération de la bonne facture quand l'id de l'url change
    useEffect(()=>{
        if(id !=="new"){
            setEditing(true);
            fetchInvoice(id);
        }
    },[id]);

//gestion des inputs dans le formulaire formulaire
const handleChange = ({currentTarget}) =>{
    const {name,value} = currentTarget;
    setInvoice({...invoice,[name]:value})
}
//gestion de la soumission du formulaire
const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(invoice);
    try {
        if(editing){
            const response = await InvoicesAPI.update(id,invoice);
         toast.success("La facture a bien été modifiée");

        }else{
           const response = await InvoicesAPI.create(invoice);
           toast.success("La facture a bien été enregistrée");
        history.replace("/invoices")
        }
    } catch ({response}) {
        const {violations} = response.data;
        if(violations){
            const apiErrors ={}
            violations.forEach(({propertyPath,message})=>{
                apiErrors[propertyPath] = message;
            });

            setErrors(apiErrors);
            toast.error("Des errors dans votre formulaire");
        }
    }

}

    return ( 
        <>
            {editing && (<h1>Modification d'une facture</h1>) || (<h1>Création d'une facture</h1>)}
            <form onSubmit={handleSubmit}>
                <Field 
                    name="amount"
                    type="number"
                    placeholder="Montant de la facture"
                    label="Montant"
                    onChange={handleChange}
                    value={invoice.amount}
                    error={errors.amount}
                />
                <Select 
                    name="customer" 
                    label="Client" 
                    value={invoice.customer} 
                    error={errors.customer} 
                    onChange={handleChange}
                >
                    {customers.map(customer=><option key={customer.id} value={customer.id}>
                        {customer.firstName} {customer.lastName}
                     </option>)}
                    
                    
                </Select>
                <Select
                    name="status"
                    label="status"
                    value={invoice.status}
                    error={errors.status}
                    onChange={handleChange}
                >
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>
                <div className="form-group">
                    <button type="submit" className="btn btn-submit btn-success">Enregistrer</button>
                    <Link to="/invoices" className="btn btn-link">Retour aux factures</Link>
                </div>
            </form>
        </>
     );
}
 
export default InvoicePage;