const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const {protect} = require('../middleware/auth');

// carro por el usuaro
router.get('/:userId', protect, async (req,res,next)=>{
  try{
    if(req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') return res.status(403).json({success:false, message:'No autorizado'});
    const cart = await Cart.findOne({user: req.params.userId}).populate('items.product');
    res.json({success:true, data:cart});
  }catch(err){ next(err); }
});

// carro
router.get('/:userId/total', protect, async (req,res,next)=>{
  try{
    if(req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') return res.status(403).json({success:false, message:'No autorizado'});
    const cart = await Cart.findOne({user: req.params.userId}).populate('items.product');
    if(!cart) return res.json({success:true, data:{total:0}});
    let total = 0;
    const items = cart.items.map(i=>{
      const subtotal = i.product.price * i.quantity;
      total += subtotal;
      return {product:i.product, quantity:i.quantity, subtotal};
    });
    res.json({success:true, data:{items, total}});
  }catch(err){ next(err); }
});

// Agregar item con $push
router.post('/:userId', protect, async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'No autorizado' });

    const { productId, quantity } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { user: req.params.userId },
      { $push: { items: { product: productId, quantity: quantity || 1 } } },
      { new: true }
    );
    res.json({ success: true, data: cart });
  } catch (err) { next(err); }
});

// Eliminar item con $pull
router.delete('/:userId/:productId', protect, async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'No autorizado' });

    const cart = await Cart.findOneAndUpdate(
      { user: req.params.userId },
      { $pull: { items: { product: req.params.productId } } },
      { new: true }
    );
    res.json({ success: true, data: cart });
  } catch (err) { next(err); }
});


module.exports = router;
