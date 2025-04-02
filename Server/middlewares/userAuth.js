import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try{
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if(tokenDecode.id){
            req.body.userId = tokenDecode.id;
        }else{
            return res.status(401).json({ success: false, message: "Unauthorized login again" });
        }

        next();
    }catch(err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export default userAuth;