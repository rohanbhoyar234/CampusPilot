import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  const {
    studentId,
    facultyId,
    fullName,
    email,
    password,
    role,
    branch,
    year,
    className,
    teaches = [],
  } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    if (role === "student") {
      const isCollege = branch && year;
      const isSchool = className;

      if (!isCollege && !isSchool) {
        return res.status(400).json({
          msg: "Student must have either branch & year (college) or className (school)",
        });
      }

      if (!studentId) {
        return res.status(400).json({ msg: "Student ID is required." });
      }

      const existingId = await User.findOne({ studentId });
      if (existingId) {
        return res.status(400).json({ msg: "Student ID already registered." });
      }
    }

    if (role === "faculty") {
      if (!facultyId) {
        return res.status(400).json({ msg: "Faculty ID is required." });
      }

      const existingFId = await User.findOne({ facultyId });
      if (existingFId) {
        return res.status(400).json({ msg: "Faculty ID already registered." });
      }

      if (!teaches || teaches.length === 0) {
        return res.status(400).json({ msg: "Subjects are required for faculty." });
      }
    }

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      studentId: role === "student" ? studentId : undefined,
      facultyId: role === "faculty" ? facultyId : undefined,
      fullName,
      email,
      password: hash,
      role,
      branch: role === "student" ? branch : undefined,
      year: role === "student" ? year : undefined,
      className: role === "student" ? className : undefined,
      teaches: role === "faculty" ? teaches : [],
    });

    await user.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        studentId: user.studentId || null,
        facultyId: user.facultyId || null,
        teaches: user.teaches || [],
        branch: user.branch,
        year: user.year,
        className: user.className,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
