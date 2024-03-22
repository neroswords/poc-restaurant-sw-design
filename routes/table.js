const express = require('express');

const { getTable, createTable, activeTable, closeTable, postAddOrderToTableNumber, getAllOrderFromTableNumber} = require('../controllers/table');
const {protect} = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getTable).post(createTable);
router.post('/:tableNumber/activate', activeTable)
router.post('/:tableNumber/close', closeTable)
router.post('/:tableNumber/addOrder', postAddOrderToTableNumber)
router.get('/:tableNumber', getAllOrderFromTableNumber)
module.exports = router;