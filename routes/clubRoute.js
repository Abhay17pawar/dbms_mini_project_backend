const express = require("express");
const router = express.Router();
const clubController = require("../controllers/clubController");

router.get("/", clubController.getClubs);
router.post("/", clubController.createClub);

// Route to assign a head role to a member in a club
router.post("/:clubId/assign-head", clubController.assignClubHead);

// Route to get all heads of a club
router.get("/:clubId/heads", clubController.getClubHeads);

// Route to assign a teacher as incharge of a club
router.post("/:clubId/incharge", clubController.assignClubIncharge);

// Route to get the incharge teacher of a club
router.get("/:clubId/incharge", clubController.getClubIncharge);

module.exports = router;
