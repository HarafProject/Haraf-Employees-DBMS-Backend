const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const batchProcessingController = require("../controllers/batchProcessingController")
//GET index page. 
router.get('/', function (req, res) {
    res.json('Hello! welcome to HARAF EDMS.');
});

//add employee
router.post('/add-employee-sheet',upload.single('file'), batchProcessingController.upload_excel);

router.put('/beneficiary_account', batchProcessingController.data_processing);

router.get('/get_beneficiary_data', batchProcessingController.data_conversion);


module.exports = router;