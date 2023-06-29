import dev from "./.env.dev";
import pro from "./.env.pro";

const NODE_ENV = import.meta.env.MODE;
let ENV_VAR: {BASE_API: string} = { BASE_API: ''};
if(NODE_ENV === "development"){
    ENV_VAR.BASE_API = dev.BASE_API;
}else if(NODE_ENV === "production"){
    ENV_VAR.BASE_API = pro.BASE_API;
}
export default ENV_VAR;

