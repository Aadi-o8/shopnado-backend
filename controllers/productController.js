import { v2 as cloudinary} from "cloudinary"
import productModel from "../models/poductModel.js"

// function for adding product
const addProduct = async (req, res) => {
    try {
        const {name, description, sizes, price, category, subCategory, bestSeller} = req.body
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((image)=> image !== undefined);

        console.log(name, description, sizes, price, category, subCategory, bestSeller);
        
        let imagesUrl = await Promise.all(
            images.map(async (item)=> {
                let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'})
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            price: Number(price),
            image: imagesUrl,
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestSeller: bestSeller === 'true' ? true : false,
            date: Date.now()
        }

        const product = new productModel(productData);
        await product.save();
        
        res.json({success: true, message: 'Product added successfully'});

    } catch (error) {
        console.log(error);
        res.json({success: false, message: 'ma chud gyi'})
    }
}

// function to list products
const listProduct = async (req, res) => {
    try {
        // const {name, } = req.body

        const product = await productModel.find({});
        res.json({success: true, product})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: 'ma chud gyi'})    
    }
}

// function to remove product
const removeProduct = async (req, res) => {
    try {

        await productModel.findByIdAndDelete(req.body.id)
        res.json({success: true, message: "Product removed successfully"})
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: 'ma chud gyi'})
    }
}
 
// function for single product info
const productInfo = async (req, res)=> {
    try {
        
        const {productId} = req.body;
        const product = await productModel.findById({productId});

        res.json({success: true, product});

    } catch (error) {
        console.log(error);
        res.json({success: false, message: 'ma chud gyi'})
    }
}

export default {addProduct, productInfo, listProduct, removeProduct}