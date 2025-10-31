import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  

  originalPrice: { type: Number }, 
  
  imageUrl: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  countInStock: { type: Number, required: true, default: 0 },
  colors: [String],
  sizes: [String],
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
export default Product;