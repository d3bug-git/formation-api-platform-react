import axios from "axios"

function findAll(){
    return axios.get("http://symreact/api/customers")
    .then(response=>response.data["hydra:member"]);
}
function deleteCustomer(id){
    return axios.delete("http://symreact/api/customers/"+id)
        .then(response=>console.log("deleted success"))
}

export default{
    findAll,
    delete:deleteCustomer
}