const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const mongoURL = process.env.DB_URL;

// 'mongodb://localhost:27017/yelpcamp'
// 
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("conenction open")
  })
  .catch(err => {
    console.log("oh no we have an error")
    console.log(err)
  });


const camps = [];

const sample = array => array[Math.floor(Math.random() * array.length)];

const ran = array => Math.floor(Math.random() * array.length);
var random1000 = ran(cities)

const populate = async () => {
  await Campground.deleteMany({});
  const author = "6051bbc12bc6d058b47c669e"

  for (let i = 0; i < 400; i++) {
    random1000 = ran(cities)
    var image = [
      {
        url: 'https://res.cloudinary.com/dewymkk4h/image/upload/v1616581563/YelpCamp/pvvcxwzyuffmfsegemzl.jpg',
        filename: 'YelpCamp/pvvcxwzyuffmfsegemzl'
      },
      {
        url: 'https://res.cloudinary.com/dewymkk4h/image/upload/v1616581996/YelpCamp/vzdkilyyodypy53z3htx.jpg',
        filename: 'YelpCamp/vzdkilyyodypy53z3htx'
      }
    ];
    const geometry = {
      coordinates: [cities[random1000].longitude, cities[random1000].latitude],
      type: 'Point'
    }
    const newtitle = sample(places) + sample(descriptors);
    const price = Math.floor(Math.random() * 30) + 10;
    const lorem = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. At asperiores ipsam a, officiis iure maiores aliquid totam architecto. Ipsum asperiores perspiciatis vero ab natus alias ex consectetur corporis quas optio."
    const newcamp = new Campground({ location: cities[random1000].city, title: newtitle, price, description: lorem, image, author, geometry });
    newcamp.save().then(c => console.log(c))
  }
}
populate();


// const newproducts = [
//   { name: "strawberries", price: 12, catagory: "fruits" },
//   { name: "milk", price: 17, catagory: "diary" },
//   { name: "tomatoes", price: 17, catagory: "veg" },
//   { name: "chocolate", price: 17, catagory: "diary" },
// ]
