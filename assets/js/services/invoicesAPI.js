import axios from "axios"

function findAll(){
    return axios.get("http://symreact/api/invoices")
    .then(response=>response.data["hydra:member"]);
}
function deleteCustomer(id){
    return axios.delete("http://symreact/api/invoices/"+id)
        .then(response=>console.log("deleted success"))
}

export default{
    findAll,
    delete:deleteCustomer
}