import axios from 'axios'

function register(user){
    return axios.post("http://symreact/api/users",user);
}

export default{
    register
}