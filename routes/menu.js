const express = require('express');

const { getMenu, createMenu, createTag} = require('../controllers/menu');
const {protect} = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getMenu).post(createMenu);
router.route('/tags').post(createTag);
module.exports = router;