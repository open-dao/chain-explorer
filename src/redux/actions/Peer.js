export const GET_PEER_LIST = "peer/GET_PEER_LIST";

import {Tool} from '../request';

export function getPeerList(name,address){
    var url = Tool.restful("/account/getContractBalance");
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
    return {
        type:GET_PEER_LIST,
        promise:client=>client.post(url,param)
    }
}
