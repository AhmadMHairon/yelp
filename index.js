if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}
const express = require("express");
const app = express();
const path = require("path");
const Joi = require('joi');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Review = require('./models/review');
const User = require('./models/user');
const ejsmate = require("ejs-mate")
const ErrorClass = require("./utily/errorclass");
// const catchAsync = require("./utily/catchAsync");r
// const { validate } = require("./models/campground");
const { CampgroundSchema, ReviewSchema } = require("./schema.js");
const CampRoute = require("./router/CampRoute")
const ReviewRoute = require("./router/ReviewRoute")
const UserRoute = require("./router/UserRoute")
const session = require('express-session');
const { date } = require("joi");
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
// const mongoURL = process.env.DB_URL;
const mongoURL =  process.env.DB_URL || 'mongodb://localhost:27017/yelpcamp';
const MongoStore = require('connect-mongo');


// app.set('trust proxy', 1) // trust first proxy


const secret = process.env.Secret || "ImALovelyKitten"


const store = new MongoStore({ //this needs to be placed before session config
  mongoUrl: mongoURL,
  secret,
  touchAfter: 24 * 3600 //this is in seconds 
})

store.on("error", function(e){
  console.log("SESSION PROCESSING ERROR", e)
})

const sessionconfig = {
  store:store,
  name: "232as",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    // secure: true,
    // expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    HttpOnly: true
  }
}





app.use(session(sessionconfig))

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// mongoose.set('useFindAndModify', false);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); //user.auth comes from the pass local mongoose and takes place of the long function used in the docs of passport
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); //once again these methods come form pass local mongoose to make life better


app.engine('ejs', ejsmate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "camp"))
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(express.static(path.join(__dirname, 'public')))


app.use(methodOverride('_method'))
app.use(mongoSanitize());
app.use(helmet());
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",

];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dewymkk4h/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
        "https://www.novascotia.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);


mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("conenction open")
  })
  .catch(err => {
    console.log("oh no we have an error")
    console.log(err)
  });




app.use(flash());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})



app.use('/camps', CampRoute)
app.use('/reviews', ReviewRoute)
app.use('/', UserRoute)



// app.patch("/index/:id", async (req, res) => {
//   const { id } = req.params;
//   const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).then(c => console.log(c));
//   res.redirect(`/index/${id}`)
// })


app.get('/', (req, res) => {
  res.render('home')
})

app.all('*', (req, res, next) => {
  next(new ErrorClass("page not found", 404))
})

app.use((err, req, res, next) => {
  const { message = "something went wrong", statusCode = 500 } = err
  if (!err.message) {
    err.message = "something went wrong"
  }
  res.render("error", { err })
})


const port = process.env.PORT || "3000"

app.listen(port, () => {
  console.log(`now we lsning on ${port}`)
})

