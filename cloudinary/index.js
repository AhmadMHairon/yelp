const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Cloud_Key,
  api_secret: process.env.Cloud_Secret
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'YelpCamp',
    allowed_formats: ['jpeg', 'png']
  },
});

module.exports = {
  cloudinary,
  storage
}