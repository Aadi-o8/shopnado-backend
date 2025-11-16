import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import razorpay from 'razorpay'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorPayInstance = new razorpay({
    key_id:  process.env.VITE_RAZORPAY_KEY_ID,
    key_secret: process.env.VITE_RAZORPAY_SECRET_KEY,
})

const currency = 'inr';
const deliveryCharges = 70;

// Placing order using cod
const placeOrder = async (req, res)=> {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            amount,
            status: 'Order Placed',
            paymentMethod: 'cash on delivery',
            payment: false,
            date: Date.now(),
            address,
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, {cartData:{}});
        res.json({success: true, message: "Order Placed"});

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}


// Placing order using Stripe
const placeOrderStripe = async (req, res)=> {
    try {
        
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            amount,
            status: 'Order Placed',
            paymentMethod: 'Stripe',
            payment: false,
            date: Date.now(),
            address,
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item)=> ({
            price_data: {
                currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity,
        }))

        line_items.push(({
            price_data: {
                currency,
                product_data: {
                    name: 'Delivery charges',
                },
                unit_amount: deliveryCharges * 100
            },
            quantity: 1,
        }))

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment'
        })

        res.json({success: true, session_url: session.url})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message}) 
    }
}

// Verify Stripe
const verifyStripe = async ()=> {
    const { orderId, success, userId } = req.body;
    try {
        if (success === "true") {
            await orderModel.findById(orderId, {payment:true});
            await userModel.findByIdAndUpdate(orderId, {cartData:{}});
            res.json({success: true, message: 'Payment is done'});
        } else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success: false, message: 'Order did not pass through'});
        }
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})   
    }
}


// Placing order using Razorpay
const placeOrderRazorpay = async (req, res)=> {
    try {
        
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            amount,
            status: 'Order Placed',
            paymentMethod: 'Razorpay',
            payment: false,
            date: Date.now(),
            address,
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const options = {
            amount: amount*100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString(),
        }

            razorPayInstance.orders.create(options, (error, order)=> {
            if (error) {
                console.log(error);
                return res.json({success: false, message: error});
            }
            res.json({success: true, order})
        })

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})   
    }
}


// getting all the orders for admin panel
const allOrders = async (req, res)=> {
    try {
        const allOrders = await orderModel.find({});
        res.json({success: true, allOrders, message: 'aage ji sare orders'})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message}) 
    }
}


// getting user's orders
const userOrders = async (req, res)=> {
    try {
        const { userId } = req.body;

        const orders = await orderModel.find({userId});
        res.json({success: true, orders})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})  
    }
}


// updating order status( for admin only )
const updateStatus = async (req, res)=> {
    try {
        const { orderId, status } = req.body;

        await orderModel.findByIdAndUpdate(orderId, {status: status});
        res.json({success: true, message: 'Status updated'});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})  
    }
}

export default { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyStripe }