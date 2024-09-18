const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const register = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;

        
        if (!username || !email || !password || !firstName || !lastName) {
            return res.status(400).json("All fields are required.");
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            return res.status(400).json("Invalid email format.");
        }

        
        const q = "SELECT * FROM users WHERE username = ? OR email = ?";
        const [data] = await db.promise().query(q, [username, email]);

        if (data.length) {
            return res.status(409).json("User already exists.");
        }

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        
        const qInsert = "INSERT INTO users (`username`, `email`, `password`, `first_name`, `last_name`) VALUES (?)";
        const values = [username, email, hashedPassword, firstName, lastName];

        await db.promise().query(qInsert, [values]);

        res.status(201).json("User has been created.");
    } catch (error) {
        console.error("Error during registration:", error);  
        res.status(500).json("Something went wrong, please try again later.");
    }
};



const login = async (req, res) => {
    try {
        const { username, password } = req.body;

       
        if (!username || !password) {
            return res.status(400).json("Username and password are required.");
        }

        
        const q = "SELECT * FROM users WHERE username = ?";
        const [data] = await db.promise().query(q, [username]);

        if (data.length === 0) {
            return res.status(404).json("User not found.");
        }

        const user = data[0];

        
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json("Incorrect username or password.");
        }

        
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        const { password: userPassword, ...otherDetails } = user;

        
        const cookieOptions = {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24,  
        };

        res.cookie("access_token", token, cookieOptions)
            .status(200)
            .json(otherDetails);
    } catch (error) {
        console.error("Error during login:", error);  
        res.status(500).json("Something went wrong, please try again later.");
    }
};



const updateUser = async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json("Not authenticated.");
    }

    try {
        
        const userInfo = jwt.verify(token, process.env.JWT_SECRET);

        
        const { username,
                email, 
                first_name, 
                last_name, 
                phone_number, 
                address, 
                city, 
                state, 
                country, 
                profile_picture_url 
            } = req.body;

        
        if (!username || !email || !first_name || !last_name) {
            return res.status(400).json("Required fields are missing.");
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            return res.status(400).json("Invalid email format.");
        }

        
        const q = `
            UPDATE users 
            SET username = ?, email = ?, first_name = ?, last_name = ?, phone_number = ?, address = ?, city = ?, state = ?, country = ?, profile_picture_url = ? 
            WHERE id = ?
        `;
        const values = [
            username, 
            email, 
            first_name, 
            last_name, 
            phone_number, 
            address, 
            city, 
            state, 
            country, 
            profile_picture_url, 
            userInfo.id
        ];

        await db.promise().query(q, values);

        res.status(200).json("User has been updated.");
    } catch (error) {
        console.error("Error updating user:", error);  
        res.status(500).json("Something went wrong, please try again later.");
    }
};




const logout = (req, res) => {
    try {
        
        res.clearCookie("access_token", {
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
            secure: process.env.NODE_ENV === "production",  
            httpOnly: true 
        });
        res.clearCookie("refresh_token", {
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
            secure: process.env.NODE_ENV === "production",  
            httpOnly: true
        })
        return res.status(200).json("Logged out successfully.");
    } catch (error) {
        console.error("Error during logout:", error); 
        res.status(500).json("Something went wrong, please try again later.");
    }
};



// Token expiry times
const ACCESS_TOKEN_EXPIRY = '15m';  
const REFRESH_TOKEN_EXPIRY = '7d';  

// Generate Access Token
const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    });
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
    });
};

// Refresh Token Handler
const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) return res.status(401).json('Not authenticated!');

    
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) return res.status(403).json('Refresh token is invalid!');

        const newAccessToken = generateAccessToken(user);


        const newRefreshToken = generateRefreshToken(user);

        // Send new refresh token in the cookie
        res.cookie('refresh_token', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 7, 
        });

       
        return res.status(200).json({ accessToken: newAccessToken });
    });
};

// Session Check Handler
const checkSession = (req, res) => {
    const accessToken = req.cookies.access_token;
    if (!accessToken) return res.status(401).json('Not authenticated!');

    
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json('Access token is invalid or expired!');


        return res.status(200).json({
            id: user.id,
            username: user.username,
        });
    });
};





module.exports = {
    register,
    login,
    updateUser,
    logout,
    refreshToken,
    checkSession
}
    
    