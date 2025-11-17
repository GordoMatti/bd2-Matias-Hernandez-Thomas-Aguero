const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');
const {protect} = require('../middleware/auth');

// crea una opinion para el q compro un productop
router.post('/', protect, async (req,res,next)=>{
  try{
    const {productId, rating, comment} = req.body;
    const orders = await Order.find({user: req.user._id, 'items.product': productId});
    if(!orders || orders.length===0) 
      return res.status(400).json({success:false, message:'Debe comprar el producto antes de reseñar'});
    const review = await Review.create({user: req.user._id, product: productId, rating, comment});
    await Product.findByIdAndUpdate(productId, {$push:{reviews: review._id}});
    res.status(201).json({success:true, data:review});
  }catch(err){ next(err); }
});

// lista todas las opiniones
router.get('/', async (req,res,next)=>{
  try{
    const reviews = await Review.find().populate('user','name email').populate('product','name');
    res.json({success:true, data:reviews});
  }catch(err){ next(err); }
});

//opiniones de producto
router.get('/product/:productId', async (req,res,next)=>{
  try{
    const reviews = await Review.find({product: req.params.productId}).populate('user','name');
    res.json({success:true, data:reviews});
  }catch(err){ next(err); }
});

// Top opiniones
router.get('/top', async (req,res,next)=>{
  try{
    const avg = await Review.aggregate([
      { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $project: { _id:0, product: '$product.name', avgRating:1, count:1 } },
      { $sort: { avgRating: -1 } }
    ]);
    res.json({success:true, data:avg});
  }catch(err){ next(err); }
});

module.exports = router;
