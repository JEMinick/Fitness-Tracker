const path = require("path");
const router = require("express").Router();

// Route for the primary public/index.html to launch the public/exercise.html:
router.get("/exercise", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/exercise.html"));
});

// Route for the primary public/exercise.html to launch the public/stats.html:
router.get("/stats", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/stats.html"));
});

module.exports = router;
