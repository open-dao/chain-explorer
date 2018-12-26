import axios from'axios'
export default {
  getTokenList:function(offset,rows) {
    let url = 'http://192.168.200.108:3001/query/tokens';
    let param ={
      "request":{
        "offset": offset,
        "rows": rows,
      }
    }
    return axios.post(url,param);
  }
}