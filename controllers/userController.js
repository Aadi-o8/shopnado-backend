import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { response } from "express";


const createToken = (id)=> {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

// Route for login
const loginUser = async (req, res)=> {
    try {
        const {email, password} = req.body;
        // checking if the user exists
        const exists = await userModel.findOne({email})
        if (!exists) {
            return res.json({success: false, message: 'No user with this email exists'})
        }

        // const isMatch = await userModel.findOne({password})
        // if (exists.password !== isMatch.password) {
        //     res.json({success: false, message: 'Either email or password is wrong'})
        // }
        
        const isMatch = await bcrypt.compare(password, exists.password);
        if (!isMatch) {
            return res.json({success: false, message: 'Either email or password is wrong'})
        }
        
        const token = createToken(exists._id);
        res.json({success: true, token})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Route for Sign up
const signUpUser = async (req, res)=> {
    try {
        const {name, email, password} = req.body;
        // checking if user already exists
        const exists = await userModel.findOne({email})
        if (exists) {
            return res.json({success: false, message: 'User already exists'})
        }

        //validating email and strong password
        if (!validator.isEmail(email)) {
            return res.json({success: false, message: 'Enter a valid email'})
        }
        if (password.length < 8) {
            return res.json({success: false, message: 'Enter a strong password'})
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success: true, token})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Route for admin login
const adminLogin = async (req, res)=> {
    try {

        const { email, password } = req.body;
        if (email === process.env.ADMIN_ID && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({success: true, token});
        } else{
            res.json({success: false, message: 'Invalid credentials'});
        }
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})   
    }
}

export default {loginUser, signUpUser, adminLogin};