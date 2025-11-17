const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');
const {protect, admin} = require('../middleware/auth');

// CRUD
router.post('/', protect, admin, async (req,res,next)=>{
  try{
    const cat = await Category.create(req.body);
    res.status(201).json({success:true, data:cat});
  }catch(err){ next(err); }
});

router.get('/', async (req,res,next)=>{
  try{
    const cats = await Category.find();
    res.json({success:true, data:cats});
  }catch(err){ next(err); }
});

router.get('/stats', async (req,res,next)=>{
  try{
    const stats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $project: { _id:0, category: '$category.name', count:1 } }
    ]);
    res.json({success:true, data:stats});
  }catch(err){ next(err); }
});

router.patch('/:id', protect, admin, async (req,res,next)=>{
  try{
    const updated = await Category.findByIdAndUpdate(req.params.id, {$set:req.body}, {new:true});
    res.json({success:true, data:updated});
  }catch(err){ next(err); }
});

router.delete('/:id', protect, admin, async (req,res,next)=>{
  try{
    await Category.findByIdAndDelete(req.params.id);
    res.json({success:true, message:'Categoria eliminada'});
  }catch(err){ next(err); }
});

module.exports = router;
