import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import axios from "axios";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Auth0 configuration
const auth0Config = {
  domain: process.env.AUTH0_DOMAIN,
  client_id: process.env.AUTH0_CLIENT_ID,
  client_secret: process.env.AUTH0_CLIENT_SECRET,
};


// User registration 
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    // Get Management API Token
    const tokenResponse = await axios.post(
      `${auth0Config.domain}/oauth/token`,
      {
        grant_type: "client_credentials",
        client_id: auth0Config.client_id,
        client_secret: auth0Config.client_secret,
        audience: `${auth0Config.domain}/api/v2/`,
        scope: "create:users read:users",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!tokenResponse.data.access_token) {
      throw new Error("Failed to get management API token");
    }
    // Create user in Auth0
    const auth0User = await axios.post(
      `${auth0Config.domain}/api/v2/users`,
      {
        email: email,
        password: password,
        name: name,
        connection: "Username-Password-Authentication",
        email_verified: false,
        verify_email: false,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!auth0User.data.user_id) {
      throw new Error("Failed to create Auth0 user");
    }

    // Create user in our database
    const user = await User.create({
      name,
      email,
      auth0Id: auth0User.data.user_id,
      role: "patient",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    res.status(400).json({
      message: "Error registering user",
      error: error.response?.data?.message || error.message,
      details: error.response?.data || "No additional details available",
    });
  }
});

// Login endpoint
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
// console.log("done 1")
//     // Get token from Auth0
//     const tokenResponse = await axios.post(
//       `https://${auth0Config.domain}/oauth/token`,
//       {
//         grant_type: "password",
//         username: email,
//         password: password,
//         client_id: auth0Config.client_id,
//         client_secret: auth0Config.client_secret,
//         audience: `${auth0Config.domain}/api/v2/`,
//         scope: "openid profile email",
//         connection: "Username-Password-Authentication",
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log("done 2")
//     if (!tokenResponse.data.access_token) {
//       throw new Error("Failed to authenticate");
//     }

//     // Get user info from Auth0
//     const userInfo = await axios.get(`https://${auth0Config.domain}/userinfo`, {
//       headers: {
//         Authorization: `Bearer ${tokenResponse.data.access_token}`,
//       },
//     });
//     console.log("done 3")
//     // Find or create user in our database
//     const [user, created] = await User.findOrCreate({
//       where: { auth0Id: userInfo.data.sub },
//       defaults: {
//         name: userInfo.data.name,
//         email: userInfo.data.email,
//         role: "patient", // Default role for new users
//       },
//     });
//     console.log("done 4")
//     res.json({
//       message: "Login successful",
//       token: tokenResponse.data.access_token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//     console.log("done 5")
//   } catch (error) {
//     console.error("Login error:", error.response?.data || error.message);
//     res.status(401).json({
//       message: "Authentication failed",
//       error: error.response?.data?.error_description || error.message,
//     });
//   }
// });

export default router;
