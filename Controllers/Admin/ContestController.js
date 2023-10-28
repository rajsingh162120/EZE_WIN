const Contest = require("../../Models/Contest.js");
const Winning = require("../../Models/Winning.js");
const User = require("../../Models/userModel.js");
const Setting = require("../../Models/Setting.js");

module.exports = {
	index : async (req, res) => {
		const setting = await Setting.findOne().skip(0);
		const contests = await Contest.find();
		res.render('admin/contest/index',{contests,setting});
	},

	show : async (req, res) => {
		const setting = await Setting.findOne().skip(0);
		const contest = await Contest.findById(req.params.id).populate('winnings').populate('users');
		res.render('admin/contest/show',{contest,setting});	
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

	store_winning : async (req, res) => {
		const contest_id = req.body.contest;
		const {rank,amount} = req.body;
		var winning = new Winning();
		if(req.body.id){
			winning = await Winning.findById(req.body.id);
		}
		winning.contest = contest_id;
		winning.rank = rank;
		winning.amount = amount;
		await winning.save();

		if(req.body.id == ''){
			const contest = await Contest.findById(contest_id);
			await contest.winnings.push(winning);
	        await contest.save();
	    }

		req.session.sessionFlash = {
			type: 'success',
			message: 'Winning updated successfully !'
		}
		res.redirect('back');
	},

	delete_winning : async (req, res) => {
		const winning = await Contest.findByIdAndDelete(req.body.id);
		res.send('Winning Deleted');
	},

	join_contest : async (req, res) => {
		const contest = await Contest.findById(req.params.id);
		const user = await User.findById(req.session.user._id);
		if(user.wallet >= contest.entry_fee){
			user.wallet = user.wallet - contest.entry_fee;
			await user.save();
			await contest.users.push(user);
			contest.save();
			res.redirect('/admin/dashboard');
		}else{
			res.send('Insufficient Balance');
		}
		
	},
}