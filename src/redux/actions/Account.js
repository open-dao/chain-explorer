export const GET_ACCOUNT_LIST = "account/GET_ACCOUNT_LIST";
export const CREATE_NEW_ACCOUNT_BY_PASSWORD = "account/CREATE_NEW_ACCOUNT_BY_PASSWORD";

export function getAccountList(){
    return {
        type:GET_ACCOUNT_LIST,
        promise:client=>client.get('http://192.168.200.137:7001/public/swagger/index.html#/')
    }
}

export function createNewAccountByPassword(password){
    //let url = '/account/createNewAccountByPassword';
    let url = 'http://192.168.200.137:7001/public/swagger/index.html#/account/createNewAccountByPassword';
    return {
        type:CREATE_NEW_ACCOUNT_BY_PASSWORD,
        promise:client=>client.get(url,{'password':password})
    }
}