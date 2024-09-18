const db = require("../config/db");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


const createBusiness = async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json("Not authenticated.");
    }

    try {
        const userInfo = jwt.verify(token, process.env.JWT_SECRET);

        const { name, industry, location, website_url, contact_email, contact_phone, registration_date } = req.body;

        
        if (!name || !industry || !location || !contact_email || !contact_phone || !registration_date) {
            return res.status(400).json("Required fields are missing.");
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(contact_email)) {
            return res.status(400).json("Invalid email format.");
        }

        
        const q = "INSERT INTO businesses (`name`, `owner_id`, `industry`, `location`, `website_url`, `contact_email`, `contact_phone`, `registration_date`) VALUES (?)";

        const values = [name, userInfo.id, industry, location, website_url, contact_email, contact_phone, registration_date];

        await db.promise().query(q, [values]);

        res.status(201).json("Business has been created.");
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json("Token has expired.");
        }
        console.error("Error creating business:", error);
        res.status(500).json("Something went wrong, please try again later.");
    }
};



const getBusinesses = async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json("Not authenticated.");
    }

    try {
        const userInfo = jwt.verify(token, process.env.JWT_SECRET);

        const q = "SELECT * FROM businesses WHERE owner_id = ?";

        const [data] = await db.promise().query(q, [userInfo.id]);

        if (data.length === 0) {
            return res.status(404).json("No businesses found.");
        }

        res.status(200).json(data);
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json("Token has expired.");
        }
        console.error("Error retrieving businesses:", error);
        res.status(500).json("Something went wrong, please try again later.");
    }
};


const deleteBusiness = async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json("Not authenticated.");
    }

    try {
        const userInfo = jwt.verify(token, process.env.JWT_SECRET);

        const { id } = req.body;

        if (!id) {
            return res.status(400).json("Business ID is required.");
        }

        const q = "DELETE FROM businesses WHERE id = ? AND owner_id = ?";

        const [result] = await db.promise().query(q, [id, userInfo.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json("Business not found or you're not authorized to delete this business.");
        }

        res.status(200).json("Business has been deleted.");
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json("Token has expired.");
        }
        console.error("Error deleting business:", error);
        res.status(500).json("Something went wrong, please try again later.");
    }
};


const updateBusiness = async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json("Not authenticated.");
    }

    try {
        const userInfo = jwt.verify(token, process.env.JWT_SECRET);

        const { id, name, industry, location, website_url, contact_email, contact_phone, registration_date } = req.body;

        if (!id || !name || !industry || !location || !contact_email || !contact_phone || !registration_date) {
            return res.status(400).json("Required fields are missing.");
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(contact_email)) {
            return res.status(400).json("Invalid email format.");
        }

        const q = `
            UPDATE businesses 
            SET name = ?, industry = ?, location = ?, website_url = ?, contact_email = ?, contact_phone = ? 
            WHERE id = ? AND owner_id = ?
        `;

        const values = [name, industry, location, website_url, contact_email, contact_phone, id, userInfo.id];

        const [result] = await db.promise().query(q, values);

        if (result.affectedRows === 0) {
            return res.status(404).json("Business not found or you're not authorized to update this business.");
        }

        res.status(200).json("Business has been updated.");
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json("Token has expired.");
        }
        console.error("Error updating business:", error);
        res.status(500).json("Something went wrong, please try again later.");
    }
};

const getBusinessById = async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json("Not authenticated.");
    }

    try {
        const userInfo = jwt.verify(token, process.env.JWT_SECRET);
        const { id } = req.params;

        const q = "SELECT * FROM businesses WHERE id = ? AND owner_id = ?";
        const [data] = await db.promise().query(q, [id, userInfo.id]);

        if (data.length === 0) {
            return res.status(404).json("Business not found or you don't have access to it.");
        }

        res.status(200).json(data[0]);
    } catch (error) {
        console.error("Error retrieving business:", error);
        res.status(500).json("Something went wrong, please try again later.");
    }
};


const searchBusinesses = async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json("Not authenticated.");
    }

    try {
        const userInfo = jwt.verify(token, process.env.JWT_SECRET);
        const { industry, location, registration_date } = req.query;

        let q = "SELECT * FROM businesses WHERE owner_id = ?";
        let values = [userInfo.id];

        if (industry) {
            q += " AND industry = ?";
            values.push(industry);
        }
        if (location) {
            q += " AND location = ?";
            values.push(location);
        }
        if (registration_date) {
            q += " AND registration_date = ?";
            values.push(registration_date);
        }

        const [data] = await db.promise().query(q, values);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error searching businesses:", error);
        res.status(500).json("Something went wrong, please try again later.");
    }
};





module.exports = { createBusiness, 
    getBusinesses, 
    deleteBusiness, 
    updateBusiness, 
    getBusinessById, 
    searchBusinesses 
};