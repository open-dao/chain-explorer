import Request,{Tool} from '../redux/request';
const request = new Request();

export default {
  getCurrentBlockId:function(){
    let url = Tool.restful("block/getBlockNumber");
    return request.post(url);
  }
}