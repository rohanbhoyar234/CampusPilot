import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

router.put('/users/:id/password', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Password required' });
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(req.params.id, { password: hashed });

    res.json({ message: 'Password updated' });
  } catch (err) {
    console.error('Password update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/users', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

//  delete the user 
router.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

// update 
router.put('/users/:id/role', async (req, res) => {
  const { role } = req.body;
  await User.findByIdAndUpdate(req.params.id, { role });
  res.json({ message: 'Role updated' });
});


router.put('/:id/password', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: 'Password required' });

  const hashed = await bcrypt.hash(password, 10);
  await User.findByIdAndUpdate(req.params.id, { password: hashed });

  res.json({ message: 'Password updated' });
});



router.post('/users', async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role,
      studentId,
      facultyId,
      teaches,
      branch,
      year,
      className
    } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    
    const userData = {
      fullName,
      email,
      password: hashedPassword,
      role,
      branch,
      year,
      className,
    };

    if (role === 'student') {
      if (!studentId) {
        return res.status(400).json({ message: 'Student ID required' });
      }
      userData.studentId = studentId;
    } else if (role === 'faculty') {
      if (!facultyId) {
        return res.status(400).json({ message: 'Faculty ID required' });
      }
      userData.facultyId = facultyId;
      userData.teaches = teaches || [];
    }

    const newUser = new User(userData);
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });

  } catch (err) {
    console.error('User creation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




export default router;