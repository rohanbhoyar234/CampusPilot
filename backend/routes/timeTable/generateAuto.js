import express from 'express';
import Class from '../../models/timeTable/Class.js';
import Teacher from '../../models/timeTable/Teacher.js';
import Timetable from '../../models/timeTable/Timetable.js';

const router = express.Router();
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const PERIODS = 5;
const HARD_SUBJECTS = ['Math', 'Physics', 'Chemistry'];

router.post('/auto', async (req, res) => {
  try {
    const classes = await Class.find();
    const teachers = await Teacher.find();
    const teacherBusy = {};
    const classBusy = {};
    const output = {};

    for (const c of classes) {
      const classKey = `${c.branch}_${c.year}`;
      output[classKey] = {};
      classBusy[classKey] = {};

      for (const day of DAYS) {
        output[classKey][day] = Array(PERIODS).fill(null);
        classBusy[classKey][day] = Array(PERIODS).fill(false);
      }
    }

    for (const c of classes) {
      const classKey = `${c.branch}_${c.year}`;

      for (const subject of c.subjects) {
        let assigned = 0;
        const sessions = subject.sessionsPerWeek;
        const preferredSlots = generatePreferredSlots(subject.name);

        for (const [day, period] of preferredSlots) {
          if (assigned >= sessions) break;
          if (classBusy[classKey][day][period]) continue;

          
          const prev = period > 0 ? output[classKey][day][period - 1] : null;
          const next = period < PERIODS - 1 ? output[classKey][day][period + 1] : null;
          if ((prev && prev.subject === subject.name) || (next && next.subject === subject.name)) continue;

          const eligibleTeachers = teachers.filter(t => t.teaches.includes(subject.name));
          for (const teacher of eligibleTeachers) {
            teacherBusy[teacher.name] ??= {};
            teacherBusy[teacher.name][day] ??= Array(PERIODS).fill(false);

            if (!teacherBusy[teacher.name][day][period]) {
              output[classKey][day][period] = {
                subject: subject.name,
                teacher: teacher.name
              };

              classBusy[classKey][day][period] = true;
              teacherBusy[teacher.name][day][period] = true;
              assigned++;
              break;
            }
          }
        }
      }
    }

    for (const c of classes) {
      const classKey = `${c.branch}_${c.year}`;
      const [branch, year] = classKey.split('_');

      await Timetable.findOneAndUpdate(
        { branch, year },
        { branch, year, schedule: output[classKey], published: false },
        { upsert: true }
      );
    }

    res.json({ message: 'Timetable generated successfully', timetable: output });
  } catch (err) {
    console.error('Timetable Error:', err);
    res.status(500).json({ message: 'Failed to generate' });
  }
});

function generatePreferredSlots(subject) {
 const periods = HARD_SUBJECTS.includes(subject)
  ? [0, 1, 2, 3, 4]
  : [0, 1, 2, 3, 4];
  const slots = [];

  for (const day of DAYS) {
    for (const period of periods) {
      slots.push([day, period]);
    }
  }

  return shuffle(slots);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default router;
