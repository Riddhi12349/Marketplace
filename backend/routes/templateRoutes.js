const express = require('express');
const router = express.Router();
const {createTemplate , listAllTemplate, getTemplate, deleteTemplate} = require('../controllers/template'); ;

router.post("/create" , createTemplate);

router.get("/list/all" , listAllTemplate);

router.get("/:id" , getTemplate);

router.delete("/delete/:id" , deleteTemplate);

module.exports = router;