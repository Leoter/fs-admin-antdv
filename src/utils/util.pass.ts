
import JSEncrypt from 'jsencrypt';
import { commonEnv } from '/@/utils/util.common.env';

export function encryptPass(password: string) {
    const pubkey = commonEnv.PWD_RSA_PRIVATE_KEY;
    
    try {
        const crypt = new JSEncrypt();
        crypt.setKey(pubkey);
        const crypted = crypt.encrypt(password);
        return crypted;
    } catch (ex) {
        return "encrypt";
    }
}