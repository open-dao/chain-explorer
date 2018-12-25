export const GET_BLOCK_LIST = "block/GET_BLOCK_LIST";
export const GET_BLOCK_BY_HASH = "block/GET_BLOCK_BY_HASH";
export const GET_BLOCK_BY_TRANS_HASH = "block/GET_BLOCK_BY_TRANS_HASH";
export const GET_BLOCK_BY_INDEX = "block/GET_BLOCK_BY_INDEX";

import Request,{Tool} from '../request';
var request = new Request();

export function getBlockList(limit,bookmark,currentId){
    if(!limit){
        limit = 20;
    }       
    let tem_maxBlock = currentId-bookmark*limit;    // 第bookmark页的最高block的id
    let tem_minBlock = tem_maxBlock-limit+1;        // 第bookmark页的最低block的id
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
    return {
        type:GET_BLOCK_LIST,
        promise:client=>client.post(url,param)
    };
}

export function getBlockByHash(hash) {
    let url = Tool.restful("block",hash);
    return {
        type:GET_BLOCK_BY_HASH,
        promise:client=>client.get(url)
    }
}

export function getBlockByTransHash(hash){
    let url = Tool.restful("blockchain/blocks/transcation");
    var param={
        "data": {
          "msg": {
            "head": {
              "transactionHash": hash
            }
          }
        }
      }
    return {
        type:GET_BLOCK_BY_TRANS_HASH,
        promise:client=>client.post(url,param)
    }
}

export function getBlockByIndex(index){
    let url = Tool.restful("block",index);
    return {
        type:GET_BLOCK_BY_INDEX,
        promise:client=>client.get(url)
    }
}