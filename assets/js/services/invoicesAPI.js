import axios from "axios"

function findAll(){
    return axios.get("http://symreact/api/invoices")
    .then(response=>response.data["hydra:member"]);
}
function deleteCustomer(id){
    return axios.delete("http://symreact/api/invoices/"+id)
        .then(response=>console.log("deleted success"))
}
function find(id){
    return axios.get("http://symreact/api/invoices/"+id).then(response=>response.data);
}
function update(id,invoice){
    return  axios.put("http://symreact/api/invoices/"+id,
    { ...invoice,customer:`/api/customers/${invoice.customer}`})
}
function create(invoice){
    return axios.post("http://symreact/api/invoices",{
        ...invoice,customer:`/api/customers/${invoice.customer}`
});
}
export default{
    findAll,
    find,
    update,
    create,
    delete:deleteCustomer
}