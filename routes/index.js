const express = require('express');
const router = express.Router();


//GET index page. 
router.get('/', function (req, res) {
    res.json('Hello! welcome to HARAF EDMS.');
});


module.exports = router;