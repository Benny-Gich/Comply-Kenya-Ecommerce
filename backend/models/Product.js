const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Please provide product description']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['Boards', 'Doors', 'Flooring', 'Furniture', 'Poles']
  },
  subcategory: String,
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  costPerItem: Number,
  quantity: {
    type: Number,
    required: true,
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    required: true
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }],
  specifications: {
    dimensions: String,
    weight: String,
    material: String,
    color: String
  },
  bulkPricing: [{
    minQuantity: Number,
    maxQuantity: Number,
    price: Number
  }],
  tags: [String],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  seoTitle: String,
  seoDescription: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update slug before saving
productSchema.pre('save', function(next) {
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);