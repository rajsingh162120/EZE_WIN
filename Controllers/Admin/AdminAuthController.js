const User = require("../../Models/userModel.js");
const bcrypt = require("bcryptjs");
const { generateToken, verifyToken } = require("../../utlis/generateToken.js");

module.exports = {
	index : (req, res) => {
		res.render('admin/login');
	},

	login : async (req, res) => {
		const user = await User.findOne({Email:req.body.email,isAdmin:true});
		if(user && await bcrypt.compare(req.body.password, user.Password)){
			generateToken(user._id);
			req.session.isLoggedIn = true;
        	req.session.user = user;
        	req.session.save(err => {
	            if (err) {
	                return next(err)
	            }
	            return res.redirect('/admin/dashboard')
	        });
		}else{
			req.session.sessionFlash = {
				type: 'error',
			    message: 'Invalid Email or Password.'
			}
	  		res.redirect('/admin-auth');
		}
	}
}