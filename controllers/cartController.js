import userModel from "../models/userModel.js";


// add products to user cart
const addToCart = async (req, res)=> {
    try {
        const { userId, itemId, size } = req.body;

        const user = await userModel.findById(userId);
        let cartData = user.cartData;

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else{
                cartData[itemId][size] = 1;
            }
        } else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        await userModel.findByIdAndUpdate(userId, {cartData});
        res.json({success: true, message: 'item added to cart successfully'});

    } catch (error) {
        console.log(error);
        res.json({success: false, message: 'Item did not made it to cart'});
    }
}


// update user cart
const updateCart = async (req, res)=> {
    try {
        const { userId, itemId, size, quantity } = req.body;

        const user = await userModel.findById(userId);
        let cartData = user.cartData;

        cartData[itemId][size] = quantity;

        await userModel.findByIdAndUpdate(userId, {cartData});
        res.json({success: true, message: 'Cart updated'});

    } catch (error) {
        console.log(error);
        res.json({success: false, message: 'Item did not made it to cart'});
    }
}


// get user cart data
const getUserCart = async (req, res)=> {
    try {
        
        const { userId } = req.body;

        const user = await userModel.findById(userId);
        let cartData = user.cartData;

        res.json({success: true, cartData, message: 'le re lund ke'});

    } catch (error) {
        console.log(error);
        res.json({success: false, message: 'Item did not made it to cart'}); 
    }
}

export default {addToCart, updateCart, getUserCart};