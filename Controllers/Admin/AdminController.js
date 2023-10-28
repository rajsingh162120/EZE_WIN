const User = require("../../Models/userModel.js");
const Contest = require("../../Models/Contest.js");
const Question = require("../../Models/Question.js");
const Setting = require("../../Models/Setting.js");
const bcrypt = require("bcryptjs");
const AWS = require('aws-sdk');
const { UniqueString, UniqueNumber, UniqueStringId,UniqueNumberId,
        UniqueOTP,UniqueCharOTP,HEXColor,uuid } = require('unique-string-generator');

module.exports = {

	dashboard : async (req, res) => {
		try{
			const admins = await User.find({isAdmin:true}).countDocuments();
			const users = await User.find({isAdmin:false}).countDocuments();
			const upcoming_contest = await Contest.find({status:'Upcoming'}).countDocuments();
			const completed_contest = await Contest.find({status:'Completed'}).countDocuments();
			const unused_questions = await Question.find({status:'Unused'}).countDocuments();
			const used_questions = await Question.find({status:'Used'}).countDocuments();
			const setting = await Setting.findOne().skip(0);

			res.render('admin/dashboard',{admins,users,upcoming_contest,completed_contest,unused_questions,used_questions,setting});
		}catch(err){
			//
		}
		
	},

	logout : (req, res, next) => {
		req.session.destroy();
    		res.redirect('/admin-auth')
	},

	profile : async (req, res) => {
		const setting = await Setting.findOne().skip(0);
		const customer = await User.findById(req.session.user._id);
		res.render('admin/profile',{customer,setting});
	},
	update_profile : async (req, res) => {
		var photo = req.session.user.photo;
		if(req.files){
			AWS.config.update({
		        accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Access key ID
		        secretAccesskey: process.env.AWS_SECRET_ACCESS_KEY, // Secret access key
		        region: process.env.AWS_REGION //Region
		    });
		    const s3 = new AWS.S3();
		    if(req.files.profile_pic){
		    	var params = {
				Bucket: 'ezewin-files',
			    Key: req.session.user.photo,
			}
			s3.deleteObject(params, function(err, data) {
                 		// deleted
			});
			var str = req.files.profile_pic.mimetype;
			var extension = str.substring(str.indexOf("/") + 1);
			profile_pic = UniqueString() + "." + extension;
			// Binary data base64
		    	var fileContent  = Buffer.from(req.files.profile_pic.data, 'binary');
			// Uploading files to the bucket
			var params = {
		        	Bucket: 'ezewin-files',
		        	Key: profile_pic,
		        	Body: fileContent
		    	};
			await s3.upload(params, function(err, data) {
				if (err) {
			            throw err;
			        }
			});
			photo = profile_pic;
		    }
		}
		const result = await User.findByIdAndUpdate(req.session.user._id,{
			Name:req.body.name,
			Email:req.body.email,
			Phone_Number:req.body.phone,
			Gender:req.body.gender,
			address:req.body.address,
			photo:photo,
		});

		req.session.sessionFlash = {
			type: 'success',
			message: 'Profile updated successfully !'
		}
		res.redirect('/admin/profile');
	},

	user : async (req, res) => {
		const setting = await Setting.findOne().skip(0);
		const users = await User.find()
		res.render('admin/user/index',{users,setting});
	},

	user_details : async (req, res) => {
		const setting = await Setting.findOne().skip(0);
		const user = await User.findById(req.params.id);
		res.render('admin/user/show',{user,setting});
	},

	store : async (req, res) => {
		const user = new User({
			Name:req.body.name,
			Email:req.body.email,
			Phone_Number:req.body.phone,
			Password:'Password@123',
		});
		const result = await user.save();
		req.session.sessionFlash = {
			type: 'success',
			message: 'User Added successfully !'
		}
		res.redirect('/admin/user');
	},

	update : async (req, res) => {
		const result = await User.findByIdAndUpdate(req.body.id,{
			Name:req.body.name,
			Email:req.body.email,
			Phone_Number:req.body.phone,
		});

		req.session.sessionFlash = {
			type: 'success',
			message: 'User updated successfully !'
		}
		res.redirect('/admin/user');
	},

	delete : async (req, res) => {
		const user = await User.findByIdAndDelete(req.body.id);
		res.send('User Deleted');
	},

	setting : (req, res) => {
		res.render('admin/setting/index');
	},
}