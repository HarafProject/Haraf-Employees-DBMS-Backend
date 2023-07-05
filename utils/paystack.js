const { PAYSTACK_SECRET_KEY } = require('../config.js/keys')


const paystack = require("paystack")(PAYSTACK_SECRET_KEY);
const paystack_api = require("paystack-api")(PAYSTACK_SECRET_KEY);

exports.verifyAccount = async (account_number, bank_code) => {

    try {
        const params = {
            account_number,
            bank_code
        }
        const data = await paystack_api.verification.resolveAccount(params);
        // console.log({params:data});

        return data;
    } catch (error) {
        return error.error
    }

};

exports.bankList = async () => {
    const data = await paystack.misc.list_banks()
    return data
}