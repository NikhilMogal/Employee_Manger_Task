

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const departmentController = require('../controllers/departmentController');

router.use(auth); 


router.post('/', departmentController.createDepartment);
router.get('/', departmentController.getDepartments);

router.put('/:id', departmentController.updateDepartment);

router.delete('/:id', departmentController.deleteDepartment);

router.get('/query/it-a', departmentController.getITDepartmentEmployeesStartingWithA);
router.get('/query/sales-desc', departmentController.getSalesDepartmentEmployeesDesc);

module.exports = router;
