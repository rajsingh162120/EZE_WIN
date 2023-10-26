const router = require("express").Router();

const User = require("../Models/userModel.js");

const AdminAuthController = require('../Controllers/Admin/AdminAuthController');

router.get('/',AdminAuthController.index);
router.post('/login',AdminAuthController.login);



module.exports = router;