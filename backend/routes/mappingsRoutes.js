const express = require('express');
const router = express.Router();
const { saveMappings , getAllMappings , deleteMapping } = require('../controllers/mapping');

router.post("/send" , saveMappings);

router.get("/get", getAllMappings);

router.delete("/delete/:id", deleteMapping);

module.exports = router;