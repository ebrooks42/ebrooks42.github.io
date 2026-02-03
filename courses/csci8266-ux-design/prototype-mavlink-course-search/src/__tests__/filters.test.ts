import { describe, it, expect } from 'vitest';
import { filterCourses, getKeywordOptions, getMeetingDays, REMAINING_COURSES } from '../lib/filters';

describe('filterCourses and keyword helpers', () => {
  it('basic subject filtering works', () => {
    const courses = [
      { id: '1', code: 'CSCI 1000', name: 'Intro', schedule: 'M/W 9:00 - 10:15', isOpen: true, subjects: ['BS Computer Science'] },
      { id: '2', code: 'CSCI 2000', name: 'Other', schedule: 'T/TH 9:00 - 10:15', isOpen: true, subjects: ['MS Computer Science'] },
    ];
    const res = filterCourses(courses as any, { subject: 'BS Computer Science' });
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe('1');
  });

  it('combined filters respect days and openOnly', () => {
    const courses = [
      { id: '1', code: 'A', name: 'One', schedule: 'M/W 9:00 - 10:15', isOpen: true, subjects: ['BS Computer Science'] },
      { id: '2', code: 'B', name: 'Two', schedule: 'M/W 9:00 - 10:15', isOpen: false, subjects: ['BS Computer Science'] },
      { id: '3', code: 'C', name: 'Three', schedule: 'T/TH 9:00 - 10:15', isOpen: true, subjects: ['BS Computer Science'] },
    ];
    const res = filterCourses(courses as any, { subject: 'BS Computer Science', selectedDays: ['M/W'], openOnly: true });
    expect(res.map(r => r.id)).toEqual(['1']);
  });

  it('keyword options derive from filtered courses', () => {
    const sample = [
      { id: '1', code: 'CSCI 1010', name: 'Algorithms', schedule: 'M/W 9:00 - 10:15', isOpen: true, subjects: ['BS Computer Science'] },
      { id: '2', code: 'CSCI 2020', name: 'Databases', schedule: 'T/TH 11:00 - 12:15', isOpen: true, subjects: ['MS Computer Science'] },
    ];

    const opts = getKeywordOptions(sample as any);
    expect(opts.some(o => o.label.includes('CSCI 1010'))).toBe(true);
    expect(opts.some(o => o.label.includes('CSCI 2020'))).toBe(true);
  });

  it('meeting day helper returns expected days', () => {
    expect(getMeetingDays('M/W 9:00 - 10:15')).toBe('M/W');
    expect(getMeetingDays('T/TH 11:00 - 12:15')).toBe('T/TH');
  });

  it('generated course set has at least 100 items', () => {
    expect(REMAINING_COURSES.length).toBeGreaterThanOrEqual(100);
  });
});
