const Contest = require("../../Models/Contest.js");

module.exports = {
	index : async (req, res) => {
		const contests = await Contest.find();
		res.render('admin/contest/index');
	},

	show : async (req, res) => {
		const contest = await Contest.findById(1);
		res.render('admin/contest/show',{contest});		
	}
}