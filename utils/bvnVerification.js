const axios = require('axios');

exports.Verify_BVN = async (firstname, lastname, accountNumber, bankcode) => {
    try {
        const response = await verifyBVN(firstname, lastname, accountNumber, bankcode);

        if (response.data.status === 400 || response.data.status === 422) {
            // Retry verification with the second method
            return await BVN_Second_Verify(firstname, lastname, accountNumber, bankcode);
        } else {
            return response?.data;
        }
    } catch (error) {
        return error?.response.data
    }
};

const verifyBVN = async (firstname, lastname, accountNumber, bankcode) => {
    const data = {
        firstname,
        lastname,
        accountNumber,
        bankcode,
    };

    try {
        const response = await axios.post('http://ec2-52-17-233-72.eu-west-1.compute.amazonaws.com:8080/yolaIntegration/getNubanAccount', data);
        return response;
    } catch (error) {
        return error?.response.data
    }
};

exports.BVN_Second_Verify = async (firstname, lastname, accountNumber, bankcode) => {
    const data = {
        firstname,
        lastname,
        accountNumber,
        bankcode,
        phone: "07036423775"
    };

    try {
        const response = await axios.post('http://52.17.233.72:8080/yolaIntegration/verifyAccount', data);
        // console.log(response)
        return response.data;
    } catch (error) {
        // console.log(error?.response, "Error")
        return error.response
    }
};

exports.BVN_Bank_List = async () => {

    try {
        const response = await axios.get('http://ec2-52-17-233-72.eu-west-1.compute.amazonaws.com:8080/yolaIntegration/getNubanBanks');
        return response?.data

    } catch (error) {
        console.error(error?.response?.data);
        return error?.response?.data
    }
}

