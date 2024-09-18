const db = require("../config/db");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// 1. Create a new inventory item
const createInventoryItem = async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated.");

    try {
        const userInfo = jwt.verify(token, process.env.JWT_SECRET);
        const { business_id, name, quantity, purchase_price, sale_price, supplier_id, location, restock_threshold } = req.body;

        if (!business_id || !name || !quantity || !purchase_price || !sale_price || !supplier_id || !restock_threshold) {
            return res.status(400).json("All fields are required.");
        }

        const q = `INSERT INTO inventory 
                  (business_id, name, quantity, purchase_price, sale_price, supplier_id, location, restock_threshold) 
                  VALUES (?)`;

        const values = [business_id, name, quantity, purchase_price, sale_price, supplier_id, location, restock_threshold];

        await db.promise().query(q, [values]);
        res.status(200).json("Inventory item has been created.");
    } catch (error) {
        console.error("Error creating inventory item:", error);
        res.status(500).json("Something went wrong, please try again later.");
    }
};

// 2. Get all inventory items for a business
const getInventoryItems = async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated.");

    try {
        const userInfo = jwt.verify(token, process.env.JWT_SECRET);
        const { business_id } = req.params;

        const q = "SELECT * FROM inventory WHERE business_id = ?";
        const [data] = await db.promise().query(q, [business_id]);

        res.status(200).json(data);
    } catch (error) {
        console.error("Error retrieving inventory items:", error);
        res.status(500).json("Something went wrong, please try again later.");
    }
};

// 3. Get a single inventory item by ID
const getInventoryItemById = async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated.");

    try {
        const userInfo = jwt.verify(token, process.env.JWT_SECRET);
        const { id } = req.params;

        const q = "SELECT * FROM inventory WHERE id = ?";
        const [data] = await db.promise().query(q, [id]);

        if (data.length === 0) {
            return res.status(404).json("Inventory item not found.");
        }

        res.status(200).json(data[0]);
    } catch (error) {
        console.error("Error retrieving inventory item:", error);
        res.status(500).json("Something went wrong, please try again later.");
    }
};

// 4. Update an inventory item
const updateInventoryItem = async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated.");

    try {
        const userInfo = jwt.verify(token, process.env.JWT_SECRET);
        const { id } = req.params;
        const { name, quantity, purchase_price, sale_price, supplier_id, location, restock_threshold } = req.body;

        if (!name || !quantity || !purchase_price || !sale_price || !supplier_id || !restock_threshold) {
            return res.status(400).json("All fields are required.");
        }

        const q = `UPDATE inventory 
                  SET name = ?, quantity = ?, purchase_price = ?, sale_price = ?, supplier_id = ?, location = ?, restock_threshold = ? 
                  WHERE id = ?`;

        const values = [name, quantity, purchase_price, sale_price, supplier_id, location, restock_threshold, id];

        await db.promise().query(q, values);
        res.status(200).json("Inventory item has been updated.");
    } catch (error) {
        console.error("Error updating inventory item:", error);
        res.status(500).json("Something went wrong, please try again later.");
    }
};

// 5. Delete an inventory item
const deleteInventoryItem = async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated.");

    try {
        const userInfo = jwt.verify(token, process.env.JWT_SECRET);
        const { id } = req.params;

        const q = "DELETE FROM inventory WHERE id = ?";
        await db.promise().query(q, [id]);

        res.status(200).json("Inventory item has been deleted.");
    } catch (error) {
        console.error("Error deleting inventory item:", error);
        res.status(500).json("Something went wrong, please try again later.");
    }
};



module.exports = {
    createInventoryItem,
    getInventoryItems,
    getInventoryItemById,
    updateInventoryItem,
    deleteInventoryItem
}

