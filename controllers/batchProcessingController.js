const StatusCodes = require("../utils/status-codes");
const XLSX = require('xlsx');
const fs = require('fs');
const Beneficiary = require("../models/beneficiary");
const { Verify_BVN, BVN_Second_Verify } = require("../utils/bvnVerification");
const { result } = require("lodash");

exports.upload_excel = async (req, res) => {

    let path = req.file.path;
    var workbook = XLSX.readFile(path);
    var sheet_name_list = workbook.SheetNames;
    let jsonData = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheet_name_list[1]]
    );
    // The file path where you want to save the JSON data
    const outputPath = 'beneficiary.json';

    // Write the JSON data to the file
    fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2), 'utf-8');

    // Handle the data or respond as needed
    res.json({ message: 'File uploaded and processed successfully', jsonData });
};

exports.data_processing = async (req, res) => {
    const page = parseInt(req.query.page) || 2; // Current page, default to 1
    const itemsPerPage = parseInt(req.query.perPage) || 5; // Items per page, default to 10
    // const page = parseInt(req.query.page) || 3; // Current page, default to 1
    // const itemsPerPage = parseInt(req.query.perPage) || 10; // Items per page, default to 10

    // Query the database for items, skip the appropriate number of documents, and limit the results
    // const items = await Beneficiary.find({BVN:"Failed"})
    //     .skip((page - 1) * itemsPerPage)
    //     .limit(itemsPerPage);
    // const items = [
    //     {
    //         ACC_NUM: "0121027651",
    //         BANK_CODE: "000013",
    //         FIRSTNAME: "Ojih",
    //         LASTNAME: "Joseph"
    //     },
    //     {
    //         ACC_NUM: "0140859633",
    //         BANK_CODE: "000013",
    //         FIRSTNAME: "Aremu",
    //         LASTNAME: "Busola"
    //     },
    //     {
    //         ACC_NUM: "0027400367",
    //         BANK_CODE: "000013",
    //         FIRSTNAME: "Pwahabo",
    //         LASTNAME: "Siman"
    //     },
    //     {
    //         ACC_NUM: "0026733379",
    //         BANK_CODE: "000011",
    //         FIRSTNAME: "Lazarus",
    //         LASTNAME: "Kadwama"
    //     },
    //     {
    //         ACC_NUM: "1414256038",
    //         BANK_CODE: "000014",
    //         FIRSTNAME: "Haruna",
    //         LASTNAME: "Musa"
    //     },
    // ]
const items = [
        {
            ACC_NUM: "0247688286",
            BANK_CODE: "000013",
            FIRSTNAME: "Onuche",
            LASTNAME: "Ufedo"
        },
]
    for (const item of items) {
        if (!item.ACC_NUM || !item.BANK_CODE || !item.FIRSTNAME || !item.LASTNAME) {
            item.BVN = "Invalid Input";
            await item.save();
        } else {

            let verificationAttempts = 0;
            let result;

            while (verificationAttempts < 3) {
                // Verify bank account number
                result = await BVN_Second_Verify(item.FIRSTNAME, item.LASTNAME, item.ACC_NUM, item.BANK_CODE);
                console.log(result)
                if (result?.status === 409) {
                    item.BVN = "Error";
                    // await item.save();
                    break; // Exit the loop
                } else if (result?.status === 200) {
                    console.log(`Success`);

                    // If successful, set item.BVN and save
                    item.BVN = result.bvn;
                    // await item.save();
                    break; // Exit the loop
                } else if (verificationAttempts < 2) {
                    // If error and not reached the maximum number of attempts, retry
                    console.log(`Retry ${verificationAttempts + 1}`);
                    verificationAttempts++;
                } else {
                    // If still an error after retries, mark the item as failed
                    console.log("Yeah")
                    item.BVN = "Failed";
                    // await item.save();
                    break; // Exit the loop
                }
            }
        }
    }

    res.json(items);
};

exports.data_conversion = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Current page, default to 1
    const itemsPerPage = parseInt(req.query.perPage) || 100; // Items per page, default to 20

    try {
        // Query the database for items, skip the appropriate number of documents, and limit the results
        const items = await Beneficiary.find()
            .select('FIRSTNAME LASTNAME ACC_NUM BANK_CODE BVN')
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);

        // Create an array of objects with the desired headers
        const data = items.map(item => ({
            FIRSTNAME: item.FIRSTNAME,
            LASTNAME: item.LASTNAME,
            ACC_NUM: item.ACC_NUM,
            BANK_CODE: item.BANK_CODE,
            BVN: item.BVN,
        }));

        // Create a new worksheet
        const ws = XLSX.utils.json_to_sheet(data, {
            header: ['FIRSTNAME', 'LASTNAME', 'ACC_NUM', 'BANK_CODE', 'BVN'],
        });

        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // Write the workbook to a file
        XLSX.writeFile(wb, 'output6.xlsx', { bookType: 'xlsx' });

        res.json('Excel file created: output6.xlsx');
    } catch (error) {
        console.log("Error exorting")
    }
};
