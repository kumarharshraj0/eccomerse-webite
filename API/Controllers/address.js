import { Address } from "../Models/Address.js";

export const addAddress = async (req, res) => {
  try {
    console.log("req.user:", req.user);
    console.log("req.body:", req.body);

    const { fullName, address, city, state, country, pincode, phoneNumber } = req.body;
    const userId = req.user; // middleware must set this

    const useraddress = await Address.create({
      userId,
      fullName,
      address,
      city,
      state,
      country,
      pincode,
      phoneNumber,
    });

    res.json({ message: "Address added", useraddress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding address", error: error.message });
  }
};


export const  getAddress= async(req,res)=>{

  let  address=await Address.find({userId:req.user}).sort({createdAT:-1})
  res.json({message:'address',userAddress:address[0]})
}

