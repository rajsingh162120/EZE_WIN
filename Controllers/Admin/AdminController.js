const User = require("../../Models/userModel.js");
const bcrypt = require("bcryptjs");

module.exports = {

	dashboard : (req, res) => {
		res.render('admin/dashboard');
	},

	logout : (req, res, next) => {
		req.session.destroy(err => {
	        return next(err)
	    });
    
    	return res.redirect('/admin-auth')
	},

	profile : async (req, res) => {
		const user = await User.findById(req.session.user._id);
		console.log(user);
		res.render('admin/profile',{customer:user});
	},

	user : async (req, res) => {
		const users = await User.find()
		console.log(users)
		res.render('admin/user/index',{users:users});
	},

	user_details : (req, res) => {
		res.render('admin/user/show');
	},

	setting : (req, res) => {
		res.render('admin/setting/index');
	},
}