import User from "../models/User.js";

export const getUser = async (req, res) => {
    try{
        const {userId} = req.body;

        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "User found",
            userData:{
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        });
    }catch(err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};