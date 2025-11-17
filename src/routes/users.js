const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cart = require('../models/Cart');
const jwt = require('jsonwebtoken');
const {protect, admin} = require('../middleware/auth');

// Register
router.post('/', async (req,res,next)=>{
  try{
    const {name,email,password,address,phone} = req.body;
    const user = await User.create({name,email,password,address,phone});
    await Cart.create({user:user._id, items:[]});
    res.status(201).json({success:true, data:user});
  }catch(err){ next(err); }
});

// Login
router.post('/login', async (req,res,next)=>{
  try{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(401).json({success:false, message:'Credenciales inválidas'});
    const isMatch = await user.matchPassword(password);
    if(!isMatch) return res.status(401).json({success:false, message:'Credenciales inválidas'});
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
    res.json({success:true, data:{user, token}});
  }catch(err){ next(err); }
});

// obtiene todos los usuarios(admin)
router.get('/', protect, admin, async (req,res,next)=>{
  try{
    const users = await User.find().select('-password');
    res.json({success:true, data:users});
  }catch(err){ next(err); }
});

// obtiene pior el id 
router.get('/:id', protect, async (req,res,next)=>{
  try{
    const user = await User.findById(req.params.id).select('-password');
    if(!user) return res.status(404).json({success:false, message:'No encontrado'});
    if(req.user.role !== 'admin' && req.user._id.toString() !== user._id.toString()) 
      return res.status(403).json({success:false, message:'No autorizado'});
    res.json({success:true, data:user});
  }catch(err){ next(err); }
});

// delete el usuario y su carrito
router.delete('/:id', protect, admin, async (req,res,next)=>{
  try{
    await Cart.findOneAndDelete({user:req.params.id});
    await User.findByIdAndDelete(req.params.id);
    res.json({success:true, message:'El usuario fue eliminado'});
  }catch(err){ next(err); }
});

module.exports = router;

