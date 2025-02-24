
const Department = require('../models/Department');
const User = require('../models/User');


exports.createDepartment = async (req, res) => {
  if (req.user.role !== 'manager') return res.status(403).json({ msg: 'Access denied' });

  const { departmentName, categoryName, location, salary, employeeIds } = req.body;
  try {
    const department = new Department({ 
      departmentName, 
      categoryName, 
      location, 
      salary, 
      employees: employeeIds || [] 
    });
    await department.save();

    
    const populatedDepartment = await Department.findById(department._id)
      .populate('employees', 'firstName lastName');
    
    
    if (employeeIds && employeeIds.length > 0) {
      await User.updateMany({ _id: { $in: employeeIds } }, { department: department._id });
    }

    res.json(populatedDepartment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.getDepartments = async (req, res) => {
  if (req.user.role !== 'manager') return res.status(403).json({ msg: 'Access denied' });

  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  try {
    const departments = await Department.find()
      .skip(skip)
      .limit(limit)
      .populate('employees', 'firstName lastName');
    const total = await Department.countDocuments();
    res.json({ departments, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.updateDepartment = async (req, res) => {
  if (req.user.role !== 'manager') return res.status(403).json({ msg: 'Access denied' });

  const { departmentName, categoryName, location, salary, employeeIds } = req.body;
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ msg: 'Department not found' });

    department.departmentName = departmentName || department.departmentName;
    department.categoryName = categoryName || department.categoryName;
    department.location = location || department.location;
    department.salary = salary || department.salary;
    
    if (employeeIds) {
      department.employees = employeeIds;
      await User.updateMany({ _id: { $in: employeeIds } }, { department: department._id });
    }

    await department.save();

    
    const populatedDepartment = await Department.findById(department._id)
      .populate('employees', 'firstName lastName');
    res.json(populatedDepartment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.deleteDepartment = async (req, res) => {
  if (req.user.role !== 'manager') return res.status(403).json({ msg: 'Access denied' });

  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Department deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.getITDepartmentEmployeesStartingWithA = async (req, res) => {
  if (req.user.role !== 'manager') return res.status(403).json({ msg: 'Access denied' });

  try {
    const departments = await Department.find({
      categoryName: 'IT',
      location: { $regex: /^A/i }
    }).populate('employees', 'firstName lastName');
    const employees = departments.flatMap(d => d.employees);
    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.getSalesDepartmentEmployeesDesc = async (req, res) => {
  if (req.user.role !== 'manager') return res.status(403).json({ msg: 'Access denied' });

  try {
    const departments = await Department.find({ categoryName: 'Sales' })
      .populate('employees', 'firstName lastName');
    const employees = departments.flatMap(d => d.employees)
      .sort((a, b) => `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`));
    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
