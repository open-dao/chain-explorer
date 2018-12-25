import Request,{Tool} from '../redux/request';
const request = new Request();

export default {
  getPeerBalance:function(name,address){
    let url = Tool.restful("/account/getContractBalance");
    let param={
      "data": {
        "msg": {
          "head": {
            "address": address,
            "name": name,
          }
        }
      }
    }
    return request.post(url,param);
  }
}