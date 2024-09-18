const express = require("express");
const { createInventoryItem, 
    getInventoryItemById, 
    getInventoryItems, 
    updateInventoryItem, 
    deleteInventoryItem 
} = require("../controllers/inventory");
const router = express.Router();



router.post("/", createInventoryItem);
router.get("/:business_id", getInventoryItems);
router.get("/:id", getInventoryItemById);
router.put("/:id", updateInventoryItem);
router.delete("/:id", deleteInventoryItem);


module.exports = router