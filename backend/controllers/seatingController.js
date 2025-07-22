export const generatePlan = async (req, res) => {
  try {
    
    const assignedStudents = [
      {
        rollNo: "10090",
        roomNo: "C303",
        branch: "CSE",
        year: "3rd",
        className: "CSE-3A",
        row: 0,
        column: 0,
      },
      {
        rollNo: "10091",
        roomNo: "C303",
        branch: "CSE",
        year: "3rd",
        className: "CSE-3A",
        row: 0,
        column: 1,
      },
      {
        rollNo: "20001",
        roomNo: "L202",
        branch: "ECE",
        year: "2nd",
        className: "ECE-2B",
        row: 0,
        column: 0,
      },
    ];

    const assignedInvigilators = [
      { teacherName: "Anil Kumar", roomNo: "C303" },
      { teacherName: "Priya Chawla", roomNo: "L202" },
    ];

    const classrooms = [
      { roomNo: "C303", rows: 4, columns: 4 },
      { roomNo: "L202", rows: 3, columns: 3 },
    ];

    const examDate = new Date();

const seatingPlan = {
  students: assignedStudents,
  invigilators: assignedInvigilators,
  classrooms,
  examDate,
  generatedAt: new Date(),
  metadata: {
    branches: [...new Set(assignedStudents.map(s => s.branch))],
    years: [...new Set(assignedStudents.map(s => s.year))],
    classNames: [...new Set(assignedStudents.map(s => s.className))],
  }
};


    res.status(200).json({ plan: seatingPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate seating plan" });
  }
};
