import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';
import { REMAINING_COURSES, filterCourses } from '../lib/filters';

describe('App UI and interactions', () => {
  it('shows 7 static MS required courses in the degree list (code+name only)', () => {
    render(<App />);

    const msCourses = REMAINING_COURSES.filter(c => c.subjects.includes('MS Computer Science')).slice(0, 7);
    expect(msCourses.length).toBe(7);

    // Check that each MS required course code and name is present in the static list
    for (const c of msCourses) {
      expect(screen.getByText(c.code)).toBeTruthy();
      expect(screen.getByText(c.name)).toBeTruthy();
    }

    // Confirm that meeting times are not shown in this list (they should not appear within the degree list area)
    const someSchedule = msCourses[0].schedule;
    // meeting time might appear elsewhere, but ensure it's not within the degree list area by checking the heading nearby
    const heading = screen.getByText(/Remaining Required Courses in Your Degree/i);
    const parent = heading.parentElement as HTMLElement;
    expect(parent.textContent).not.toContain(someSchedule);
  });

  it('degree list remains static when changing filters', async () => {
    render(<App />);

    const msCourses = REMAINING_COURSES.filter(c => c.subjects.includes('MS Computer Science')).slice(0, 7);
    const firstCode = msCourses[0].code;

    // Focus and change the subject searchable dropdown
    const subjectInput = screen.getByPlaceholderText('Computer Sci') as HTMLInputElement;
    fireEvent.focus(subjectInput);
    fireEvent.change(subjectInput, { target: { value: 'BS Computer Science' } });

    // The dropdown should show 'BS Computer Science' option; click it
    const opt = await screen.findByText('BS Computer Science');
    fireEvent.click(opt);

    // Degree list should still include the same first code
    expect(screen.getByText(firstCode)).toBeTruthy();
  });

  it('clicking Submit navigates to Search Results and shows table with rows', async () => {
    render(<App />);

    // Set subject to BS Computer Science so results are scoped
    const subjectInput = screen.getByPlaceholderText('Computer Sci') as HTMLInputElement;
    fireEvent.focus(subjectInput);
    fireEvent.change(subjectInput, { target: { value: 'BS Computer Science' } });
    const opt = await screen.findByText('BS Computer Science');
    fireEvent.click(opt);

    // Click Submit
    const submit = screen.getByText('Submit');
    fireEvent.click(submit);

    // Expect Search Results heading
    expect(await screen.findByText(/Search Results/i)).toBeTruthy();

    // Confirm table headers exist
    expect(screen.getByText('Course #')).toBeTruthy();
    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByText('Meeting Time')).toBeTruthy();
    expect(screen.getByText('Status')).toBeTruthy();

    // Compute expected results using same filtering rules from the app
    const expected = filterCourses(REMAINING_COURSES, { subject: 'BS Computer Science', selectedDays: ['M/W', 'T/TH'], openOnly: false, keyword: '' });

    // Ensure at least one expected course is present in the results table
    if (expected.length > 0) {
      expect(screen.getByText(expected[0].code)).toBeTruthy();
      expect(screen.getByText(expected[0].name)).toBeTruthy();
    }
  });
});
