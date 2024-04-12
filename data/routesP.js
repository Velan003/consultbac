/*const express = require('express');
const router = express.Router();
const Pd = require('./modules/modelP');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, PutObjectCommand ,DeleteObjectCommand} = require("@aws-sdk/client-s3");
const { fromIni } = require("@aws-sdk/credential-provider-ini");
require('dotenv').config();
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey=process.env.ACCESS_KEY;
const secretAccessKe=process.env.SECRET_ACCESS_KEY;
const s3 = new S3Client({
  region: bucketRegion,
  credentials:{
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKe
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    key: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});
const deleteObjectFromS3 = async (key) => {
    try {
      const params = {
        Bucket: bucketName,
        Key: key,
      };
      
      await s3.send(new DeleteObjectCommand(params));
    } catch (error) {
      console.error("Error deleting object from S3:", error);
      throw error; // You can choose to handle the error in a more appropriate way
    }
  };
  
router.get('/product/ga',async (req,res)=>{
    console.log("req");
    try{
        const dat=await Pd.find().then(data=> res.json(data));
        res.status(200);
     }
     catch(error){
         res.status(500).json({error:error.message});
     }
})

// input of all products
router.post('/product/ap',upload.array('image', 2),async(req,res)=>{
    console.log(req.body);
    console.log(req.files);
    var a=''
    for(const file of req.files){
        a=file.originalname;
    }
    try{
        const na=req.body.name;
        const ph=req.body.phone;
        const pr=req.body.price;
        const mo=req.body.model;
        const de=req.body.desc;
        const ty=req.body.type;
        const du=req.body.duration;
        const im = a;
        const ui=req.body.uid;
    const newUser = new Pd
    ({
      name:na,
      phone:ph,
      price:pr,
      model:mo,
      desc:de,
      type:ty,
      duration:du,
      image:im,
      uid:ui
    });
    await newUser.save();
    res.status(200).json({ message: "Data uploaded successfully" });
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//for pasales(sold by user)
router.get("/product/usp/:id",async(req,res)=>{
    console.log("recived");
    const i=req.params.id;
    console.log(i);
    try{
        console.log(i)
        const dat=await Pd.find({uid:i}).then(data=> res.json(data));
        res.status(200);
     }
     catch(error){
         res.status(500).json({error:error.message});
     }
})
//for order.jsx(product bought by the user)
router.get("/product/prf/:id",async(req,res)=>{
    const i=req.params.id;
    console.log(i);
    try{
        console.log("hi")
        const dat=await Pd.find({_id:i}).then(data=> res.json(data));
        res.status(200);
     }
     catch(error){
         res.status(500).json({error:error.message});
     }
})
// delete 
router.delete('/product/de/:id',async(req,res)=>{
    try{
        const i=req.params.id; 
        const product = await Pd.findById(i);
       await deleteObjectFromS3(product.image);
       const dat=await Pd.findByIdAndDelete(i);
       res.status(200).json({message:"del success"});
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
// updating details
router.put('/product/pu/:id',async(req,res)=>{
    try{
        const i=req.params.id;
        const name=req.body.name; 
        const op={new:true};
       const dat=await Pd.findByIdAndUpdate(i,name,op);
       res.status(200).json({message:"up success"});
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
router.get('/product/gbid/:id/:n',async (req,res)=>
{
    try{
        const i=req.params.id;
        const n=req.params.n;
       const dat=await Pd.findById(i);
       res.status(200).json(dat);
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})

module.exports=router; 

*/

const express = require('express');
const router = express.Router();
const Pd = require('./modules/modelP');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { fromIni } = require("@aws-sdk/credential-provider-ini");
require('dotenv').config();

// Ensure required environment variables are defined
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

// Check if required environment variables are defined
if (!bucketName || !bucketRegion || !accessKey || !secretAccessKey) {
    throw new Error('Required environment variables are not defined');
}

const s3 = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: bucketName,
        key: function (req, file, cb) {
            cb(null, file.originalname);
        },
    }),
});

const deleteObjectFromS3 = async (key) => {
    try {
        const params = {
            Bucket: bucketName,
            Key: key,
        };

        await s3.send(new DeleteObjectCommand(params));
    } catch (error) {
        console.error("Error deleting object from S3:", error);
        throw error; // You can choose to handle the error in a more appropriate way
    }
};

// Get all products
router.get('/product/ga', async (req, res) => {
    try {
        const data = await Pd.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new product
router.post('/product/ap', upload.array('image', 2), async (req, res) => {
    try {
        // Extract filename from uploaded files
        let imageFilename = '';
        for (const file of req.files) {
            imageFilename = file.originalname;
        }

        // Extract other fields from request body
        const { name, phone, price, model, desc, type, duration, uid } = req.body;

        // Create a new product instance
        const newProduct = new Pd({
            name,
            phone,
            price,
            model,
            desc,
            type,
            duration,
            image: imageFilename,
            uid
        });

        // Save the new product
        await newProduct.save();

        res.status(200).json({ message: "Data uploaded successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get products sold by a specific user
router.get("/product/usp/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const data = await Pd.find({ uid: userId });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get product details by ID
router.get("/product/prf/:id", async (req, res) => {
    const productId = req.params.id;
    try {
        const data = await Pd.findById(productId);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a product
router.delete('/product/de/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Pd.findById(productId);
        await deleteObjectFromS3(product.image); // Delete image from S3
        await Pd.findByIdAndDelete(productId); // Delete product from database
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update product details
router.put('/product/pu/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const updates = req.body;
        const options = { new: true };
        const updatedProduct = await Pd.findByIdAndUpdate(productId, updates, options);
        res.status(200).json({ message: "Product updated successfully", updatedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get product details by ID and name
router.get('/product/gbid/:id/:name', async (req, res) => {
    try {
        const productId = req.params.id;
        const productName = req.params.name;
        const data = await Pd.findById(productId);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

