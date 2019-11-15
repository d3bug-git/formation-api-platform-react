import axios from "axios"

function findAll(){
    return axios.get("http://symreact/api/customers")
    .then(response=>response.data["hydra:member"]);
}
function deleteCustomer(id){
    return axios.delete("http://symreact/api/customers/"+id)
        .then(response=>console.log("deleted success"))
}
function find(id){
    return axios.get("http://symreact/api/customers/"+id)
    .then(response=>response.data);
}
function update(id,customer){
    return axios.put("http://symreact/api/customers/"+id,customer);
}
function create(customer){
    return axios.post("http://symreact/api/customers",customer);
}
export default{
    findAll,
    delete:deleteCustomer,
    find,
    update,
    create
}