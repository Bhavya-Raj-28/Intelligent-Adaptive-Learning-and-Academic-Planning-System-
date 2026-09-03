const express = require("express");

const router = express.Router();

const {
  createProfile,
  getProfile,
} = require("../controllers/profileController");

router.post("/create", createProfile);

router.get("/:userId", getProfile);

module.exports = router;