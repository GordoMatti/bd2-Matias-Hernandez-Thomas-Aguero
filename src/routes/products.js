const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');
const {protect, admin} = require('../middleware/auth');

// Create producto (admin)
router.post('/', protect, admin, async (req,res,next)=>{
  try{
    const p = await Product.create(req.body);
    res.status(201).json({success:true, data:p});
  }catch(err){ next(err); }
});

// LLista de productos con categoría completada
router.get('/', async (req,res,next)=>{
  try{
    const products = await Product.find().populate('category');
    res.json({success:true, data:products});
  }catch(err){ next(err); }
});


// Filtrar productos por rango de precio y marca
router.get('/filtro', async (req, res, next) => {
  try {
    const { minPrecio, maxPrecio, marca, excludeMarca } = req.query;

    const filter = { $and: [] };

    if (minPrecio || maxPrecio) {
      filter.$and.push({
        precio: {
          ...(minPrecio ? { $gte: Number(minPrecio) } : {}),
          ...(maxPrecio ? { $lte: Number(maxPrecio) } : {})
        }
      });
    }

    if (marca) {
      filter.$and.push({ marca: { $eq: marca } });
    }

    if (excludeMarca) {
      filter.$and.push({ marca: { $ne: excludeMarca } });
    }

    if (filter.$and.length === 0) delete filter.$and;

    const productos = await Product.find(filter || {});
    res.json({ success: true, data: productos });
  } catch (err) { next(err); }
});


// producto mas vendido por reseña
router.get('/top', async (req,res,next)=>{
  try{
    const top = await Product.aggregate([
      { $project: { name:1, reviewsCount: { $size: '$reviews' }, price:1 } },
      { $sort: { reviewsCount: -1 } },
      { $limit: 10 }
    ]);
    res.json({success:true, data:top});
  }catch(err){ next(err); }
});

// Update stock
router.patch('/:id/stock', protect, admin, async (req,res,next)=>{
  try{
    const {stock} = req.body;
    const p = await Product.findByIdAndUpdate(req.params.id, {$set:{stock}}, {new:true});
    res.json({success:true, data:p});
  }catch(err){ next(err); }
});

// Get product detail with reviews
router.get('/:id', async (req,res,next)=>{
  try{
    const p = await Product.findById(req.params.id).populate('category').populate({path:'reviews', populate:{path:'user', select:'name email'}});
    res.json({success:true, data:p});
  }catch(err){ next(err); }
});

module.exports = router;
