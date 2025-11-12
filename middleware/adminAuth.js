import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next)=> {
    try {
        const {token} = req.headers
        if (!token) {
            return req.json({success: true, message: 'Invalid admin credentials'});
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        if (tokenDecode !== (process.env.ADMIN_ID + process.env.ADMIN_PASSWORD)) {
            return req.json({success: true, message: 'Invalid admin credentials'});            
        }
        next()

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})        
    }
}

export default adminAuth