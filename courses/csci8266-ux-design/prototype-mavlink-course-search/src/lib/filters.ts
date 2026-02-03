// Data generation and pure helpers for filtering/searching
export interface Course {
  id: string;
  code: string;
  name: string;
  schedule: string;
  isOpen: boolean;
  subjects: string[];
}

export interface DropdownOption {
  value: string;
  label: string;
}

export const SUBJECT_OPTIONS: DropdownOption[] = [
  { value: 'bs-cs', label: 'BS Computer Science' },
  { value: 'ms-cs', label: 'MS Computer Science' },
  { value: 'bs-se', label: 'BS Software Engineering' },
  { value: 'minor-cs', label: 'Minor Computer Science' },
];

function generateMockCourses(count: number): Course[] {
  const subjects = SUBJECT_OPTIONS.map((s) => s.label);
  const dayOptions = ['M/W', 'T/TH', 'F'];
  const prefixes = ['CSCI', 'MATH', 'SE', 'STAT', 'EE'];
  const topics = ['Algorithms', 'Databases', 'Systems', 'UX Design', 'Machine Learning', 'AI', 'Software Engineering', 'Capstone', 'Linear Algebra', 'Data Structures', 'Security', 'Networks', 'Compilers', 'Operating Systems', 'Graphics'];
  const courses: Course[] = [];

  for (let i = 1; i <= count; i++) {
    const prefix = prefixes[i % prefixes.length];
    const codeNum = 1000 + (i % 5000);
    const code = `${prefix} ${codeNum}`;
    const name = `${topics[i % topics.length]} ${i}`;
    const day = dayOptions[i % dayOptions.length];
    const schedule = `${day} ${8 + (i % 10)}:00 - ${9 + (i % 10)}:15`;
    const isOpen = (i % 5) !== 0; // ~20% closed
    const subj1 = subjects[i % subjects.length];
    const subj2 = (i % 7 === 0) ? subjects[(i + 1) % subjects.length] : null;
    const courseSubjects = subj2 ? [subj1, subj2] : [subj1];

    courses.push({
      id: `${i}`,
      code,
      name,
      schedule,
      isOpen,
      subjects: courseSubjects,
    });
  }

  // Ensure a known cross-listed course exists (CSCI 6000 as requested)
  courses[599] = { id: '600', code: 'CSCI 6000', name: 'Software Engineering', schedule: 'T/H 8:00 - 9:30', isOpen: true, subjects: [subjects[0], subjects[1]] } as Course;

  return courses;
}

export const REMAINING_COURSES: Course[] = generateMockCourses(120);

export const getMeetingDays = (schedule: string) => schedule.split(' ')[0];

export function filterCourses(courses: Course[], filters: { subject?: string; selectedDays?: string[]; openOnly?: boolean; keyword?: string }) {
  const { subject, selectedDays, openOnly, keyword } = filters;
  return courses.filter((course) => {
    if (subject && !course.subjects.includes(subject)) return false;
    if (selectedDays && selectedDays.length > 0) {
      const courseDays = getMeetingDays(course.schedule);
      if (!selectedDays.includes(courseDays)) return false;
    }
    if (openOnly && !course.isOpen) return false;
    if (keyword && keyword.trim() !== '') {
      const kw = keyword.toLowerCase();
      const combined = `${course.code} ${course.name}`.toLowerCase();
      if (!combined.includes(kw)) return false;
    }
    return true;
  });
}

export function getKeywordOptions(courses: Course[]) {
  const map = new Map<string, DropdownOption>();
  courses.forEach((c) => {
    const label = `${c.code} ${c.name}`;
    if (!map.has(label)) map.set(label, { value: c.id, label });
  });
  return Array.from(map.values());
}
