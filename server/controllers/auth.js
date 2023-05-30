import bcrypt from "bcrypt" ;
import jwt from "jsonwebtoken" ;
import User from "../models/User.js" ;

export const register = async(req,res) => {
    try {
        const {
            firstName ,
            lastName ,
            email ,
            password ,
            picturePath ,
            friends ,
            location ,
            occupation
        } = req.body ;

        const salt = await bcrypt.genSalt() ;
        const passwordHash = await bcrypt.hash(password,salt) ;

        const newUser = new User({
            firstName ,
            lastName ,
            email ,
            password : passwordHash ,
            picturePath ,
            friends ,
            location ,
            occupation
        });

        const savedUser = await newUser.save() ;
        res.status(201).json(savedUser) ; //201 -- new created 

    } catch (err) {
        res.status(500).json({error : err.message}) ; // error message
    }
};


// logging in function --> 

export const login = async(req,res) => {
    try {
        const {email , password} = req.body ;

        const user = await User.findOne({email : email}) ;

        if(!user) return res.status(400).json({message : "User does not exists"}) ;

        const isMatch = await bcrypt.compare(password,user.password) ;

        if(!isMatch) return res.status(400).json({message : "Invalid credentials"}) ;

        const token = jwt.sign({id : user._id} ,process.env.JWT_SECRET) ;

        delete user.password ; // so that it does not pass to front end // vv importatnt

        res.status(200).json({token,user}) ;

    } catch (err) {
        res.status(500).json({error : err.message}) ; // error message
    }
} ;