const mongoose = require('mongoose');
const Product = require('../models/product');

async function main() {
    await mongoose.connect('mongodb://localhost:27017/ecommerce');
  }

  main().then(()=>{
      console.log("Mongoose connection successful")
  }).catch((error)=>{
      console.log("Mongoose Connection failed", error)
  });

Product.deleteMany()
    .then(()=>console.log("Deleted Old files"))
    .catch((e)=>console.log(e))

const allProducts =  [
    {name:"Watermelon", price:1.99, description:"It is a very large fruit with high water content"},
    {name:"Melon", price:2.99, description:"Melons are delicious and healthy fruits "},
    {name:"Apple", price:3.50, description:"They are widely considered healthy but doctors have a love and hate relationship with them"},
    {name:"Orange", price:1.99, description:"It has a color named after it, remember oranges came first"}
]


Product.insertMany(allProducts).then(()=>{
    console.log("Seeding Successful")
}).catch((e)=>{
    console.log("error",e)
})
