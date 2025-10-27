const express = require("express");
const router = express.Router();
const gmailController = require("../controllers/gmailControllers");

router.get("/emails", gmailController.fetchEmails);

module.exports = router;