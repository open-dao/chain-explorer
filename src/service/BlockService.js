import Request,{Tool} from '../redux/request';
const request = new Request();

export default {
  getCurrentBlockId: function() {
    let url = Tool.restful("block/getBlockNumber");
    return request.post(url);
  },
  getCurrentTransInfo: function(tem_maxBlock,tem_minBlock) {
    let url = Tool.restful("block/getBlocks");
    var param = {
      "data": {
          "msg": {
              "head": {
                  "minBlock": tem_minBlock,
                  "maxBlock": tem_maxBlock
              }
          }
      }
    }
    return request.post(url, param)
  }
}