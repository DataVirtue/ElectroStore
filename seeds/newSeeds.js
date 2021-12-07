require('dotenv').config();

const mongoose = require('mongoose');
const Product = require('../models/product');
const Order = require('../models/order')
const Review = require('../models/review')
const User = require('../models/user')

const databasePassword = process.env.DATABASE_PASSWORD;

async function main() {
    await mongoose.connect(`mongodb+srv://firstUser:${databasePassword}@electrostorec1.sekvo.mongodb.net/ElectroStoreC1?retryWrites=true&w=majority`);
}

main().then(() => {
    console.log("Mongoose connection successful")
}).catch((error) => {
    console.log("Mongoose Connection failed", error)
});

const data = require('../python_scripts/final_seed.json');
console.log(data.brand[0]);

console.log(Object.keys(data.brand).length);



// creates a new products from the seeds data file and inserts them into the database 
const insertSeeds = async () => {
    await Product.deleteMany();
    await Review.deleteMany();
    await Order.deleteMany();
    await User.remove({ isAdmin: { $ne: true } })

    const checkerArray = [];
    for (let i = 0; i < 1001; i++) {
        const newProduct = new Product({
            name: data.name[i],
            price: data['prices.amountMax'][i],
            description: data.description[i],
            image: data.imageURLs[i]
        });
        if (!checkerArray.includes(newProduct.name)) {
            await newProduct.save()
            console.log(newProduct)
            checkerArray.push(newProduct.name)
        }

    }
    console.log(checkerArray)
};



insertSeeds();