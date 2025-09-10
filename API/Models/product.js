import mongoose from "mongoose";


const productSchema=new mongoose.Schema({

title: {
        type: String,
        required: true,
    },
 description: {
        type: String,
        required: true,
        
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },

    img_src: { type: String, required: false },



    createdAt:{
      type:Date ,default:Date.now
    }

})


export const Products=mongoose.model("Products",productSchema)


