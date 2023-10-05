const StatusCodes = require("../utils/status-codes");
const XLSX = require('xlsx');
const fs = require('fs');
const Beneficiary = require("../models/beneficiary");
const { Verify_BVN, BVN_Second_Verify } = require("../utils/bvnVerification");
const { result } = require("lodash");
const Employee = require("../models/employee");

// exports.upload_excel = async (req, res) => {

//     let path = req.file.path;
//     var workbook = XLSX.readFile(path);
//     var sheet_name_list = workbook.SheetNames;
//     let jsonData = XLSX.utils.sheet_to_json(
//         workbook.Sheets[sheet_name_list[0]]
//     );

//     function generateRandomNumber(numbersArray) {
//         const rand = Math.floor(Math.random() * numbersArray.length)
//         return rand
//     }

//     function generateTypologyData(params) {
//         // generate work sector and typology
//         const typologies = [
//             '64a4ac99014ab6d0c08ad3a0',
//             '64a4acb9014ab6d0c08af6b8',
//             '64a4acc5014ab6d0c08b0324',
//             '64a4ad00014ab6d0c08b4393',
//             '64a4ad0f014ab6d0c08b5236',
//             '651acd09d6b42b59c04c1b85',
//         ]
//         const randomNumber = generateRandomNumber(typologies)

//         const selectedTypology = typologies[randomNumber]
//         const subTypologies = {
//             '64a4ad00014ab6d0c08b4393': [
//                 '651a714c97b3fa9948dcac94',
//                 '651a73c497b3fa9948e162d0',
//                 '651a9bbc97b3fa99482ee8dc',
//                 '651a9be597b3fa99482f37f7',
//                 '651a9c6497b3fa9948302675',
//                 '651a9c8097b3fa9948305d5b',
//                 '651a9c9397b3fa99483080f6',
//                 '651a9ca497b3fa994830a12b',
//             ],
//             '64a4ac99014ab6d0c08ad3a0': [
//                 '651a9d4197b3fa994831d2e9',
//                 '651a9d5097b3fa994831eeef',
//                 '651a9d5a97b3fa994832013a',
//                 '651a9d6797b3fa9948321b65',
//             ],
//             '64a4acb9014ab6d0c08af6b8': [
//                 '651a9dab97b3fa9948329b3a',
//                 '651a9dc597b3fa994832ccad',
//                 '651a9dd297b3fa994832e576',
//                 '651a9ddf97b3fa99483300bb',
//             ],
//             '64a4acc5014ab6d0c08b0324': [
//                 '651a9e2097b3fa9948337da5',
//                 '651a9e2d97b3fa994833978e',
//                 '651a9e3997b3fa994833ae0e',
//             ],
//             '64a4ad0f014ab6d0c08b5236': [
//                 '651a9e7097b3fa9948341657',
//                 '651a9e7b97b3fa9948342c28',
//             ],
//             '651acd09d6b42b59c04c1b85': [
//                 '651a9f2b97b3fa9948357850',
//                 '651a9f4a97b3fa994835b992',
//                 '651a9f5997b3fa994835d5e8',
//             ],
//         }
//         const subTypoData = subTypologies[selectedTypology]
//         const randomNumber2 = generateRandomNumber(subTypoData)
//         const selectedSubTypology = subTypoData[randomNumber2]
//         return {
//             typology: selectedTypology,
//             subTypology: selectedSubTypology
//         }
//     }
//     // // The file path where you want to save the JSON data
//     // const outputPath = 'beneficiary.json';

//     // // Write the JSON data to the file
//     // fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2), 'utf-8');





//     // Transform the data into a JSON array
//     const jsonDataToSave = jsonData.map(item => ({
//         fullName: item["FULLNAME"],
//         age: item["Age"],
//         sex: item["SEX"],
//         phone: item["PHONE"],
//         bankName: item["BANK "],
//         accountNumber: item["ACC_NUM"],
//         community: item["COMMUNITY"],
//         zone: "64a3f60b2a5ef2032b4b0ccf",
//         ward: "64a83acbd5cd5364da9d349a",
//         lga: "64a3f8c73a8c016cd65f6698",
//         workTypology: generateTypologyData().typology,
//         subWorkTypology: generateTypologyData().subTypology,
//         validId: item["VALID_ID"],
//         idNumber: item["ID NUMBER"],
//         qualification: item["QUA"],
//         disability: item["Disability"],
//         pL: item["P/L"],
//         householdSize: item["HHS"],
//         outOfSchool: item["Out of school"],
//         householdHead: item["HEAD OF HH"],

//     }));

//     // Convert the jsonData array to a JSON string
//     const jsonString = JSON.stringify(jsonDataToSave, null, 2);

//     // Write the JSON data to a file
//     fs.writeFile("employeeData.json", jsonString, "utf8", (err) => {
//         if (err) {
//             console.error("Error writing to file:", err);
//         } else {
//             console.log("JSON data has been written to employeeData.json");
//         }

//     })

//     // Handle the data or respond as needed
//     res.json({ message: 'File uploaded and processed successfully' });
// };

exports.upload_excel = async (req, res) => {
    try {
        let path = req.file.path;
        var workbook = XLSX.readFile(path);
        var sheet_name_list = workbook.SheetNames;
        let jsonData = XLSX.utils.sheet_to_json(
            workbook.Sheets[sheet_name_list[12]]
        );

        function generateRandomNumber(numbersArray) {
            const rand = Math.floor(Math.random() * numbersArray.length)
            return rand
        }

        // Define a function to generate random typology data
        function generateTypologyData(params) {
            // generate work sector and typology
            const typologies = [
                '64a4ac99014ab6d0c08ad3a0',
                '64a4acb9014ab6d0c08af6b8',
                '64a4acc5014ab6d0c08b0324',
                '64a4ad00014ab6d0c08b4393',
                '64a4ad0f014ab6d0c08b5236',
                '651acd09d6b42b59c04c1b85',
            ]
            const randomNumber = generateRandomNumber(typologies)

            const selectedTypology = typologies[randomNumber]
            const subTypologies = {
                '64a4ad00014ab6d0c08b4393': [
                    '651a714c97b3fa9948dcac94',
                    '651a73c497b3fa9948e162d0',
                    '651a9bbc97b3fa99482ee8dc',
                    '651a9be597b3fa99482f37f7',
                    '651a9c6497b3fa9948302675',
                    '651a9c8097b3fa9948305d5b',
                    '651a9c9397b3fa99483080f6',
                    '651a9ca497b3fa994830a12b',
                ],
                '64a4ac99014ab6d0c08ad3a0': [
                    '651a9d4197b3fa994831d2e9',
                    '651a9d5097b3fa994831eeef',
                    '651a9d5a97b3fa994832013a',
                    '651a9d6797b3fa9948321b65',
                ],
                '64a4acb9014ab6d0c08af6b8': [
                    '651a9dab97b3fa9948329b3a',
                    '651a9dc597b3fa994832ccad',
                    '651a9dd297b3fa994832e576',
                    '651a9ddf97b3fa99483300bb',
                ],
                '64a4acc5014ab6d0c08b0324': [
                    '651a9e2097b3fa9948337da5',
                    '651a9e2d97b3fa994833978e',
                    '651a9e3997b3fa994833ae0e',
                ],
                '64a4ad0f014ab6d0c08b5236': [
                    '651a9e7097b3fa9948341657',
                    '651a9e7b97b3fa9948342c28',
                ],
                '651acd09d6b42b59c04c1b85': [
                    '651a9f2b97b3fa9948357850',
                    '651a9f4a97b3fa994835b992',
                    '651a9f5997b3fa994835d5e8',
                ],
            }
            const subTypoData = subTypologies[selectedTypology]
            const randomNumber2 = generateRandomNumber(subTypoData)
            const selectedSubTypology = subTypoData[randomNumber2]
            return {
                typology: selectedTypology,
                subTypology: selectedSubTypology
            }
        }

        // Define a function to find or create a new employee
        async function findOrCreateEmployee(item) {
            try {
                // Replace this with your logic to find an existing employee or create a new one
                const existingEmployee = await Employee.findOne({ fullName: item.FULLNAME });

                if (existingEmployee) {
                    return existingEmployee;
                } else {
                    const typologyData = generateTypologyData();

                    const newEmployee = new Employee({
                        fullName: item.FULLNAME,
                        age: item.Age,
                        sex: item.SEX,
                        phone: item.PHONE,
                        bankName: item["BANK "],
                        accountNumber: item.ACC_NUM,
                        community: item.COMMUNITY,
                        zone: "64a3f60b2a5ef2032b4b0ccf", // Replace with actual zone ID
                        ward: "64a83acbd5cd5364da9d34ac", // Replace with actual ward ID
                        lga: "64a3f8c73a8c016cd65f6698", // Replace with actual LGA ID
                        workTypology: typologyData.typology,
                        subWorkTypology: typologyData.subTypology,
                        validId: item.VALID_ID,
                        idNumber: item["ID NUMBER"],
                        qualification: item.QUA,
                        disability: item.Disability,
                        pL: item["P/L"],
                        householdSize: item["HHS"],
                        outOfSchool: item["Out of school"],
                        householdHead: item["HEAD OF HH"],
                        socu:true
                    });

                    return await newEmployee.save();
                }
            } catch (error) {
                console.error("Error creating employee:", error);
                throw error;
            }
        }

        // Process each item in the JSON data
        for (const item of jsonData) {
            await findOrCreateEmployee(item);
        }

        // Respond with a success message
        res.json({ message: 'Employees created successfully',jsonData });
    } catch (error) {
        console.error("Error processing data:", error);
        res.status(500).json({ error: 'An error occurred while processing data' });
    }
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
