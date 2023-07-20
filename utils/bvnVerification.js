const axios = require('axios');

exports.Verify_BVN = async (firstname, lastname, accountNumber, bankcode) => {

    data = {
        firstname,
        lastname,
        accountNumber,
        bankcode
    }
    
    try {
        const response = await axios.post('http://ec2-52-17-233-72.eu-west-1.compute.amazonaws.com:8080/yolaIntegration/getNubanAccount', data);

        return response?.data

    } catch (error) {
        console.error(error.response.data);
        return error?.response.data
    }
};

exports.BVN_Bank_List = async () =>{
    
    try {
        const response = await axios.get('http://ec2-52-17-233-72.eu-west-1.compute.amazonaws.com:8080/yolaIntegration/getNubanBanks');
        return response?.data

    } catch (error) {
        console.error(error.response.data);
        return error?.response.data
    }
}

