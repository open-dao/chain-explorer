export const GET_TRANS_LIST = "trans/GET_TRANS_LIST";
export const GET_TRANS_BY_HASH = "trans/GET_TRANS_BY_HASH";
//export const GET_TRANS_VIEW = "trans/GET_TRANS_VIEW";
import {Tool} from '../request';

export function getTransList(offset,limit,currencyKind,transactionHash){
    let url = Tool.restful("transaction/getTransactions");
    var param = {
        "data": {
          "msg": {
            "head": {
              "name": currencyKind,
              "transactionHash": transactionHash,
              "limit": limit,
              "offset": offset
            }
          }
        }
      }
    return {
        type:GET_TRANS_LIST,
        promise:client=>client.post(url,param)
    }
}

// export function getViewTrans(hash){
//     let url = Tool.restful("/transaction/getTransaction");
//     var param ={
//         "data": {
//             "msg": {
//                 "head": {
//                 "transactionHash": hash
//                 }
//             }
//         }
//     }
//     return {
//         type:GET_TRANS_VIEW,
//         promise:client=>client.post(url,param)
//     }
// }

export function getTransByHash(hash){
    let url = Tool.restful("blockchain/blocks/transactions",hash);
    return {
        type:GET_TRANS_BY_HASH,
        promise:client=>client.get(url)
    }
}
