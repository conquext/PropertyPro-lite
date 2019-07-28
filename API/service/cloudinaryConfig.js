import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default class Upload {
  static async uploadImage(req, res, next) {
    if (req.files) {
      if (req.files.photo) {
        const file = req.files.photo;
        await cloudinary.uploader.upload(file.tempFilePath, (result) => {
          if (result) {
            req.body.image_url = result.secure_url;
          }
          // else next('Error uploading to cloudinary');
        });
      }
    }
    next();
  }
}
