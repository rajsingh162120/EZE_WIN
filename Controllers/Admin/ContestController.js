const Contest = require("../../Models/Contest.js");

module.exports = {
	index : async (req, res) => {
		const contests = await Contest.find();
		res.render('admin/contest/index',{contests});
	},

	show : async (req, res) => {
		const contest = await Contest.findById(1);
		res.render('admin/contest/show',{contest});		
	},

	store : async (req, res) => {
		const {name,entry_fee,max_members,starts_at} = req.body;
		const contest = new Contest({
			name:name,
			entry_fee:entry_fee,
			max_members:max_members,
			starts_at:starts_at,
		});
		const result = await contest.save();
		console.log(result)
		req.session.sessionFlash = {
			type: 'success',
			message: 'Contest Added successfully !'
		}
		res.redirect('/admin/contest');
	},

	update : async (req, res) => {
		const {name,entry_fee,max_members,starts_at} = req.body;
		const result = await Contest.findByIdAndUpdate(req.body.id,{
			name:name,
			entry_fee:entry_fee,
			max_members:max_members,
			starts_at:starts_at,
		});

		req.session.sessionFlash = {
			type: 'success',
			message: 'Contest updated successfully !'
		}
		res.redirect('/admin/contest');
	},

	delete : async (req, res) => {
		const contest = await Contest.findByIdAndDelete(req.body.id);
		res.send('Contest Deleted');
	},
}