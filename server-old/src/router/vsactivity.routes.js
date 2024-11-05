const {stadevs} = require('../controller/vsactivity.controller.js');
const express = require('express');
const router = express.Router();

router.post('/', stadevs);

module.exports = router;