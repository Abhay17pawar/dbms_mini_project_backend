const express = require("express");
const router = express.Router();
const clubController = require("../controllers/clubController");

router.get("/", clubController.getClubs);
router.post("/", clubController.createClub);

// Route to assign a head role to a member in a club
router.post("/:clubId/assign-head", clubController.assignClubHead);

// Route to get all heads of a club
router.get("/:clubId/heads", clubController.getClubHeads);

module.exports = router;
