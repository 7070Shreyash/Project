import express from "express" ;
import {
    getUser ,
    getUserFriends,
    addRemoveFriend
} from "../controllers/users.js" ;

import { verifyToken } from "../middleware/auth.js"; // such req wiill required this

const router = express.Router() ;

// read only routes 

router.get("/:id",verifyToken,getUser) ; // query strings that can be used for this

router.get("/:id/friends",verifyToken,getUserFriends) ;

// Update 

router.patch("/:id/:friendID",verifyToken,addRemoveFriend) ; // patch request can be used for this for only modifications





