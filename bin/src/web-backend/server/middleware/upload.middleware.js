import multer from "multer";
import multerS3 from "multer-s3";

import multerS3Transform from "multer-s3-transform";
import sharp from "sharp";

import AWS from "aws-sdk";
import Constants from "../config/constants/app.constants";
import { S3_SETTINGS } from "../config/constants/workspace.constants";
import { Bucket } from "../config/constants/app.constants";

import regeneratorRuntime from "regenerator-runtime";
import { extname } from 'path';

const aws_s3 = new AWS.S3(Constants.AWS.s3);

const UploadS3 = multer({
  storage: multerS3({
    s3: aws_s3,
    acl: 'public-read',
    bucket: "General_V88",
    ACL: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, {fieldName: file.fieldname})
    },
    key: (req, file, cb) => {
      cb(null, `boomyeah/company_209/chapter_${req.params.chapter_id}/handouts/chapter${req.params.chapter_id}_${req.params.chapter_module_id}_${file.originalname}`);
    }
  })
}).any();

/* START - User profile directory upload */
const user_upload_config = {
	"profile_pic": {
		allowed_extensions: [".bmp", ".jpg", ".jpeg", ".png", ".gif", ".webp"],
		image_size: { width: 74, height: 74 }
	}
}

const __multerUserStorage = multerS3Transform({
	s3: aws_s3,
	acl: 'public-read',
	bucket: S3_SETTINGS.bucket,
	metadata: (req, file, cb) => {
    	cb(null, {fieldName: file.fieldname});
  	},
  	key: (req, file, cb) => {
    	cb(null, `${S3_SETTINGS.path}/user${req.user.id}/${req.params.upload_dir}/${Date.now().toString()}-${file.originalname}`);
  	},
  	shouldTransform: function(req, file, cb){
		/* Check if upload is image and to be resized (if image_size property is NOT null); triggers transforms below  */
		cb(null, (/^image/i.test(file.mimetype) && user_upload_config[req.params.upload_dir].resize_image !== null));
  	},
  	transforms: [{
    	id: 'original',
    	key: function (req, file, cb){
      		cb(null, `${S3_SETTINGS.path}/user${req.user.id}/${req.params.upload_dir}/${Date.now().toString()}-${file.originalname}`);
    	},
    	transform: function (req, file, cb){
			let size_config = user_upload_config[req.params.upload_dir].image_size;
		
      		cb(null, sharp().resize(size_config.width, size_config.height));
    	}
  	}]
});

const UploadImageWithResizeToS3 = multer({
	storage: __multerUserStorage, /* HACK: Separated storage specs because limits and fileFilter properties fail */
  	limits: { 
    	fileSize: 5 * 1024 * 1024, /* 5 MB */ 
    	files: 1000 /* Max multiple upload */
  	},
  	fileFilter: function(req, file, cb){
		let continue_upload = true;

		/* Check if upload request in user_upload_config */
		if(req.params.upload_dir in user_upload_config){
			/* Filter upload files: 
				- File NOT executable (!.exe extension)
				- File extension must be in the specified allowed_extensions */
			if(extname(file.originalname) === '.exe' || !user_upload_config[req.params.upload_dir].allowed_extensions.includes(extname(file.originalname)) ){
				continue_upload = false;
			}
		}

		cb(null, continue_upload);

		if(!continue_upload) return cb(new Error('File upload not allowed')); 
  	}
}).any();
/* END - User profile directory upload */

export {
	UploadS3,
	UploadImageWithResizeToS3
}