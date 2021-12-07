

//modules 
const express = require('express');
const app = express()

const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

//models 
const Product = require('./models/product');
const User = require('./models/user');
const Review = require('./models/review')
const Order = require('./models/order')

const session = require('express-session');
const cookieParser = require('cookie-parser')

const passport = require('passport');
const passportLocal = require('passport-local')
const flash = require('connect-flash')
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
// router imports 
const productsRouter = require('./routes/products')
const userRouter = require('./routes/users')
const paymentRouter = require('./routes/payment')

const dbUrl = process.env.MONGO_URL


const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: process.env.MONGO_SECRET,
    touchAfter: 24 * 60 * 60

})

const sessionConfig = {
    store,
    name: 'app.sid',
    secret: process.env.MONGO_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },

}






// connecting to mongodb with mongoose  
async function main() {
    await mongoose.connect(dbUrl);
}

main().then(() => {
    console.log("Mongoose connection successful")
}).catch((error) => {
    console.log("Mongoose Connection failed", error)
});

// express configuration 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

app.engine('ejs', ejsMate)

app.use(cookieParser())
//using session


//middleware express body parser
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, '/public')))

app.use(mongoSanitize({
    replaceWith: '_',
}

))


app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(helmet({ contentSecurityPolicy: false }))

app.use(function (req, res, next) {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.user = req.user;
    next()
})




app.get('/', async (req, res) => {

    res.render('home',)
    console.log(req.query)
})

app.use('/products', productsRouter)
app.use('/users', userRouter)
app.use('/payments', paymentRouter)





app.get('/search', (req, res) => {
    Product.find({ name: { $regex: req.query.name, $options: 'i' } }).then((data) => {
        res.status(200).json(data)
    }

    ).catch((e) => {
        res.status(402).json('No data')
        console.log('no data', e)
    })
})







app.listen(3000, () => {
    console.log("Listening on port 3000")
})

