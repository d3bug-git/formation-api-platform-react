import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import CustomersAPI from '../services/CustomersAPI';
import {Link} from 'react-router-dom'
import { toast } from 'react-toastify';
import TableLoader from '../components/loaders/TableLoader';

const CustomersPage = props => {

    const [customers,setCustomers] = useState([]);
    const [currentPage,setCurrentPage] = useState(1);
    const [search,setSearch] = useState('');
    const [isLoading,setIsLoading] = useState(true);

    const itemsPerPage = 10;

    //Permet de recuperer les customers
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            setIsLoading(false);
        } catch (error) {
            toast.error("Impossible de charger les clients")
        }
    }

    //Chargement des données de l'API
    useEffect(() =>{fetchCustomers()},[]);

    const handleDelete = async id=>{

        const originalCustomers = [...customers];

        // 1. L'approche optimiste
        setCustomers(customers.filter(customer=>customer.id !== id));
        //2. L'approche pessimiste
        try {
            await CustomersAPI.delete(id);
            toast.success("Le client a bien été supprimé")
        } catch (error) {
            setCustomers(originalCustomers);
            toast.success("la supprésiion a échouée");
        }
    }

    //gestion de la recherche
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    //gestion de la page
    const handlePageChange = page =>setCurrentPage(page)

    //filtrage des customers en fonction de la recherche
    const filteredCustomers = customers.filter(c=>
        c.firstName.toLowerCase().includes(search.toLowerCase()) ||
        c.lastName.toLowerCase().includes(search.toLocaleLowerCase()) ||
        c.email.toLowerCase().includes(search.toLocaleLowerCase())||
        (c.company && c.company.toLowerCase().includes(search.toLocaleLowerCase()))
        );
    
    //Pagination des données
    const paginatedCustomers = Pagination.getData(filteredCustomers,currentPage,itemsPerPage);
    return ( <>
        <div className="mb-3 d-flex justify-content-between align-items-center">
        <h1>Liste des Clients</h1>
        <Link to="/customers/new" className="btn btn-primary">Créer un client</Link> 
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
                    <th>Id.</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th className="text-center">Factures</th>
                    <th className="text-center">Montant Total</th>
                    <th />
                </tr>
            </thead>
            
            {!isLoading && (<tbody>
                {paginatedCustomers.map(customer =><tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>
                        <Link to={"/customers/"+customer.id}>{customer.firstName} {customer.lastName}</Link>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.company}</td>
                    <td className="text-center">
                <span className="badge badge-primary">{customer.invoices.length}</span>
                    </td>
                    <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                    <td>
                        <button 
                            onClick ={()=>handleDelete(customer.id)}
                            disabled={customer.invoices.length > 0 } 
                            className="btn btn-sm btn-danger">
                            Supprimer
                            </button>
                    </td>
                </tr>)}
                
            </tbody>)}

        </table>
        {isLoading && <TableLoader />}
        <Pagination currentPage={currentPage} 
        itemsPerPage={itemsPerPage} 
        length={filteredCustomers.length}
        onPageChanged={handlePageChange} />

        </>
     );
}
 
export default CustomersPage;