import express from "express"
import { addAddress, getAddress } from "../Controllers/address.js";
import { isUserAuthenticated } from "../Middlewares/IsAuth.js";


const router=express.Router()


// add address

router.post('/add',isUserAuthenticated,addAddress)


// get address

router.get('/get',isUserAuthenticated,getAddress)







export  default router;