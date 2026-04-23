import mongoose from "mongoose"

const productsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
  type: Number,
  required: true,
  default: 0,
},
categoryId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Category",
  required: true
},
  image: String,
  rating: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

const Products = mongoose.model("products", productsSchema)
export default Products