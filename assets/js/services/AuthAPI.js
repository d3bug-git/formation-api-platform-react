import axios from "axios";
import jwtDecode from "jwt-decode"

/**
 * Requête HTTP d'authentification et stockage du token localStorage etaxios
 * @param {object} credentials 
 */
function authenticate(credentials){
       return axios.post("http://symreact/api/login_check",credentials)
            .then(response=>response.data.token)
            .then(token=>{   
                //je stocke le token dans mon localStorage
                window.localStorage.setItem("authToken",token);
    
                //on prévient axios qu'on a maintenant un header par défaut sur toutes nos futures requêts HTTP
                setAxiosToken(token);
            })
}
/**
 * D"connexion (suppresion du token du localstorage et sur Axios )
 */
function logout(){
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

/**
 * positionne le token JWT sur Axios
 * @param {string} token lee token JWT
 */
function setAxiosToken(token){
    axios.defaults.headers["Authorization"]="Bearer "+token;
}

/**
 * Mise enplace lors du chargement de l'application
 */
function setup(){
    //1. Voir si on a un token
    const token = window.localStorage.getItem("authToken");
    //2. Si le token est encore valide
    if(token){
        const {exp:expiration} = jwtDecode(token);
        if(expiration * 1000 >new Date().getTime()){
            setAxiosToken(token);
        }
    }
}

/**
 * Permet de savoir si on est authentifié ou pas
 * @returns boolean
 */
function isAuthenticated(){
    //1. Voir si on a un token
    const token = window.localStorage.getItem("authToken");
    //2. Si le token est encore valide
    if(token){
        const {exp:expiration} = jwtDecode(token);
        if(expiration * 1000 >new Date().getTime()){
            return true;
        }
        return false;
    }
    return false
}
export default{
    authenticate,
    logout,
    setup,
    isAuthenticated
}