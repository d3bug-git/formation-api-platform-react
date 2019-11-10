import moment from "moment";
import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import invoicesAPI from '../services/invoicesAPI';

const STATUS_CLASSES = {
    PAID:"success",
    SENT:"primary",
    CANCELLED:"danger"

}
const STATUS_LABELS = {
    PAID:"Payée",
    SENT:"Envoyée",
    CANCELLED:"Annulée"

}

const InvoicesPage = ({}) => {

    const [invoices,setInvoices] = useState([]);
    const [currentPage,setCurrentPage] = useState(1);
    const [search,setSearch] = useState('');

    const itemsPerPage = 10;

    //Recupération des invoices aupès de l'API
    const fetchInvoices = async () => {
        try {
            const data =  await invoicesAPI.findAll();        
            setInvoices(data);
        } catch (error) {
           console.log(error.response);
        }
    };

    //charger les invoices au chargement du composant
    useEffect(()=>{fetchInvoices()},[]);
    
    //formattage de la date
    const formatDate = str=>moment(str).format('DD/MM/YYYY');

    //gestion de la recherche
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };
    //gestion de la suppression
    const handleDelete = async id=>{
        const originalInvoices = [...invoices];

        setInvoices(invoices.filter(invoice=>invoice.id !==id))
        try {
            await invoicesAPI.delete(id);
        } catch (error) {
            console.log(error.response);
            setInvoices(originalInvoices);
        }
    }

    //gestion de la page
    const handlePageChange = page =>setCurrentPage(page)


    //Gestion de la recherche
    const filteredInvoices = invoices.filter(i=>
        i.customer.lastName.toLowerCase().includes(search.toLocaleLowerCase())||
        i.customer.firstName.toLowerCase().includes(search.toLocaleLowerCase())||
        i.amount.toString().startsWith(search.toLocaleLowerCase())||
        STATUS_LABELS[i.status].toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
    
    //Pagination des données
    const paginatedInvoices = Pagination.getData(filteredInvoices,currentPage,itemsPerPage);

    return <>
        <h1>Liste des factures</h1>

        <div className="form-group">
            <input type="text" onChange={handleSearch}
             value={search} 
             className="form-control" 
             placeholder="Recherche..."/>
        </div>

        <table className="table table-hover">
            <thead>
                <tr>
                    <th>Numéro de factures</th>
                    <th>Client</th>
                    <th className="text-center">date d'envoi</th>
                    <th className="text-center">Statut</th>
                    <th className="text-center">Montant</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {paginatedInvoices.map(invoice=><tr key={invoice.id}>
                <td>{invoice.chrono}</td>
                    <td>
                        <a href="#" className="">{invoice.customer.firstName} {invoice.customer.lastName}</a>
                    </td>
                    <td className="text-center">{formatDate(invoice.sentAt)}</td>
                    <td className="text-center">
                        <span className={"badge badge-"+STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                    </td>
                    <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                    <td>
                        <button className="btn btn-sm btn-primary">Editer</button>
                        <button className="btn btn-sm btn-danger" onClick={()=>{handleDelete(invoice.id)}}>Supprimer</button>
                    </td>
                </tr>)}
                
            </tbody>
        </table>
        <Pagination currentPage={currentPage} 
        itemsPerPage={itemsPerPage} 
        length={filteredInvoices.length}
        onPageChanged={handlePageChange}/>
    </>;
}
 
export default InvoicesPage;