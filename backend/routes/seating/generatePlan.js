// routes/generatePlan.js

import axios from 'axios';
import express from 'express';
import Student from '../../models/seating/Student.js';
import Teacher from '../../models/seating/Teacher.js';
import Classroom from '../../models/seating/Classroom.js';
import SeatingPlan from '../../models/seating/SeatingPlan.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    
    const rawStudents = await Student.find({}).lean();  
    const teachers = await Teacher.find({ available: true });
    const classrooms = await Classroom.find({});

    if (!rawStudents.length || !teachers.length || !classrooms.length) {
      return res.status(400).json({
        message: 'Missing data: students, teachers, or rooms',
      });
    }

    
    const uniqueStudentsMap = new Map();
    rawStudents.forEach((s) => uniqueStudentsMap.set(s.rollNo, s));
    const students = Array.from(uniqueStudentsMap.values());

    
    const sortedStudents = students.sort(
      (a, b) => Number(a.rollNo) - Number(b.rollNo)
    );
    const sortedClassrooms = classrooms.sort((a, b) => a.roomNo.localeCompare(b.roomNo));
    const shuffledTeachers = teachers.sort(() => 0.5 - Math.random());

    const studentAssignments = [];
    const teacherAssignments = [];

    let studentIndex = 0;
    const assignedTeacherNames = new Set();

    for (const room of sortedClassrooms) {
      const { capacity, roomNo, rows, columns } = room;

      const roomStudents = [];
      let seatRow = 0;
      let seatCol = 0;

      for (let i = 0; i < capacity && studentIndex < sortedStudents.length; i++) {
        const student = sortedStudents[studentIndex];

        console.log("🎓 student:", student);

        roomStudents.push({
          rollNo: student.rollNo,
          roomNo,
          row: seatRow,
          column: seatCol,
          branch: student.branch ?? student.Branch ?? "N/A",
          year: student.year ?? student.Year ?? "N/A",
          className: student.className ?? student.Class ?? student.class ?? "N/A",

        });

        seatCol++;
        if (seatCol >= columns) {
          seatCol = 0;
          seatRow++;
        }

        studentIndex++;
      }

      if (roomStudents.length > 0) {
        studentAssignments.push(...roomStudents);

        const availableTeacher = shuffledTeachers.find(
          (t) => !assignedTeacherNames.has(t.name)
        );

        if (availableTeacher) {
          teacherAssignments.push({ teacherName: availableTeacher.name, roomNo });
          assignedTeacherNames.add(availableTeacher.name);
        } else {
          teacherAssignments.push({ teacherName: 'N/A', roomNo });
        }
      }
    }

    function getNextWeekdayDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1); // start with tomorrow

  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1); // skip Sat (6), Sun (0)
  }

  return date;
}

const examDate = getNextWeekdayDate();

    const seatingPlan = new SeatingPlan({
      students: studentAssignments,
      invigilators: teacherAssignments,
      classrooms,
      examDate,
      generatedAt: new Date(),
    });

    await seatingPlan.save();


    await axios.post("http://localhost:5000/api/publish/seating", {
      data: {
        students: studentAssignments,
        invigilators: teacherAssignments,
        classrooms: classrooms.map(({ roomNo, rows, columns }) => ({
          roomNo,
          rows,
          columns,
        })),
        examDate,
        generatedAt: new Date(),
      },
    });

    res.status(200).json({
      message: 'Seating plan generated successfully',
      plan: seatingPlan,
      totalRooms: teacherAssignments.length,
      totalStudentsAssigned: studentAssignments.length,
    });

  } catch (err) {
    console.error('Plan generation error:', err);
    res.status(500).json({
      message: 'Failed to generate seating plan',
      error: err.message,
    });
  }
});

export default router;
