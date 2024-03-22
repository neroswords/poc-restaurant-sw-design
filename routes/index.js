const express = require('express');
const { getIndexPage, getLogin, getOrderStatusPage, getTableManagementPage } = require('../controllers/index');
const {protect} = require('../middleware/auth');
const { ensureLoggedIn, ensureLoggedInWithRoles } = require('../middleware/auth');
const passport = require('passport');
const router = express.Router();

router.get('/', ensureLoggedInWithRoles('customer'), getIndexPage);
router.get('/login', getLogin);
router.get('/table', getTableManagementPage);
router.get('/orders', getOrderStatusPage);
module.exports = router;