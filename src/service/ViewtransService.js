import Request,{Tool} from '../redux/request';
const request = new Request();

export default {
  getViewtransDetail:function(hash){
    let url = Tool.restful("/transaction/getTransaction");
    let param = {
      "data": {
        "msg": {
          "head": {
            "transactionHash": hash
          }
        }
      }
    }
    return request.post(url,param);
  }
}