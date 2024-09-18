const express = require("express");
const { createBusiness, getBusinesses, getBusinessById, deleteBusiness, updateBusiness, searchBusinesses } = require("../controllers/business");
const router = express.Router();


router.post("/", createBusiness);
router.get("/", getBusinesses);
router.get("/:id", getBusinessById);
router.delete("/:id", deleteBusiness);
router.put("/:id", updateBusiness);
router.get("/search", searchBusinesses);



module.exports = router