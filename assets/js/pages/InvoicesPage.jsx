import moment from "moment";
import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import InvoicesAPI from '../services/InvoicesAPI';
import {Link} from "react-router-dom"
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

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
    const [isLoading,setIsLoading] = useState(true);

    const itemsPerPage = 10;

    //Recupération des invoices aupès de l'API
    const fetchInvoices = async () => {
        try {
            const data =  await InvoicesAPI.findAll();        
            setInvoices(data);
            setIsLoading(false);
        } catch (error) {
           toast.error("Erreur lors du chargement des factures !");
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
            await InvoicesAPI.delete(id);
            toast.success("La facture a bien été supprimée")
        } catch (error) {
            toast.error("Une erreur est survenue");
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
    <div className="d-flex justify-content-between align-items-center">
        <h1>Liste des factures</h1>
        <Link className="btn btn-primary" to="/invoices/new">Créer une facture</Link>
    </div>

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
            {!isLoading && (<tbody>
                {paginatedInvoices.map(invoice=><tr key={invoice.id}>
                <td>{invoice.chrono}</td>
                    <td>
                        <Link to={"/invoices/"+invoice.id}>{invoice.customer.firstName} {invoice.customer.lastName}</Link>
                    </td>
                    <td className="text-center">{formatDate(invoice.sentAt)}</td>
                    <td className="text-center">
                        <span className={"badge badge-"+STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                    </td>
                    <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                    <td>
                        <Link to={"/invoices/"+invoice.id} className="btn btn-sm btn-primary">Editer</Link>
                        <button className="btn btn-sm btn-danger" onClick={()=>{handleDelete(invoice.id)}}>Supprimer</button>
                    </td>
                </tr>)}
                
            </tbody>)}
        </table>
        {isLoading && <TableLoader />}
        <Pagination currentPage={currentPage} 
        itemsPerPage={itemsPerPage} 
        length={filteredInvoices.length}
        onPageChanged={handlePageChange}/>
    </>;
}
 
export default InvoicesPage;