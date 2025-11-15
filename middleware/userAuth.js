import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next)=> {

    const {token} = req.headers;

    if (!token) {
        console.log(token);
        return res.json({success: false, message: 'User is not logged in, login first'});
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = tokenDecode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})         
    }
}

export default userAuth;