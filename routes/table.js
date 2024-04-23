const express = require('express');

const { getTable, createTable, activeTable, closeTable, postAddOrderToTableNumber, getAllOrderFromTableNumber, createBill, payBill, addPlate} = require('../controllers/table');
const {protect} = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getTable).post(createTable);
router.post('/:tableNumber/activate', activeTable)
router.post('/:tableNumber/close', closeTable)
router.post('/:tableNumber/addOrder', postAddOrderToTableNumber)
router.post('/:tableNumber/createBill', createBill)
router.post('/payBill', payBill)
router.get('/:tableNumber', getAllOrderFromTableNumber)



router.post('/addPlate', addPlate)
module.exports = router;