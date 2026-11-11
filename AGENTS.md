# AGENTS.md

Guidance for AI agents working in this repo (a GitHub Pages site with course and conference notes).

## Lecture note clean-up

Applies to `courses/<course>/lecture_<N>_notes.md`. Clean up the notes without changing their meaning; the author wrote them live in class.

### Do
- Fix typos, grammar, and unclear wording. Keep the author's terse bullet style and structure.
- Verify the math and worked examples (probabilities sum to 1, arithmetic is right, terms match the diagram). Fix errors or flag them to the user if the intent is unclear.
- Use proper LaTeX: `\max`, `\min`, `\leftarrow`, `\gamma`, `\sum`, etc. Wrap all math in `$...$` or `$$...$$`, including inline variables like `$k$`.
- Use `<img>` tags for images, not markdown `![]()` syntax, in this exact form:
  `<img src="../../assets/images/<name>.png" alt="Readable alt text" style="display: block; margin: 0 auto; max-width: 300px; height: auto;"/>`
- Keep images in `assets/images/` with descriptive snake_case names. Make sure every referenced image exists and is committed.
- Remove stray blank lines and trailing whitespace; end the file with a single newline.
- Keep the header format: `# Lecture #N Notes` then `- Date: Weekday, Month Dth, YYYY`.

### Don't
- Don't add content that wasn't in the notes, or rewrite sections wholesale.
- Don't remove the author's questions, quizzes, or asides.

### Course README
Each course has a `README.md` listing lectures. When adding a lecture, add a line in order:
`- [Lecture N notes (Month Dth, YYYY)](./lecture_N_notes.md)`
and include the README in the same commit.

### Commits
- One commit per lecture, in the style of the history, e.g.
  `Add lecture 18 link and notes from CSCI 8456 Intro to AI.`
  (clean-up-only commits: `Fix typos in lecture 14 notes.`).
- Include the new lecture file, its README change, and any new images.
- Only commit/push when the user asks.
