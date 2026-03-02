# Outline for Chapters 14-15 of A Project Guide to UX Design
{: .no_toc}

Outline author: Evan Brooks

Outline date: Mar 1st, 2026

# Table of Contents
{: .no_toc}

* TOC
{:toc}

# Essential Questions

## 1. What factors should you consider when deciding whether to perform design testing in person or remotely? 

The book highlights [the following factors to consider](https://learning.oreilly.com/library/view/a-project-guide/9780138188283/ch14.xhtml#ch14lev1sec1:~:text=Here%20are%20some%20of%20the%20factors%20to%20weigh%20when%20deciding%20whether%20to%20perform%20research%20in%20person%20or%20whether%20to%20perform%20it%20remotely.)
when deciding whether to perform design testing in person or remotely:

- Context of environment: you may lose nuanced information about the users' environmnet conducting remote testing. (You can mitigate this by asking users to share photos or videos of their environment.)

- Context of need: remote research can be requested of users _right at the moment_ they are woking with a product to complete a job. In person research is usually not possible to schedule at the moment of need.

- Access to users: remote research, due to access issues, can give you more users and a higher participation rate.

- Cost: remote research is typically cheaper than in person research.

## 2. What are the differences between moderated and unmoderated techniques? 

Moderated techniques involve a researcher being present during the research session. Unmoderated techniques do not.

Moderated techniques are excellent at gathering rich, qualitative data but are more expensive and thus narrow in scope. 

By contrast, unmoderated techniques can gather more quantitative data from a larger sample size. 

## 3. What are the steps of usability testing? 

The steps of usability testing, [as outlined by the book](https://learning.oreilly.com/library/view/a-project-guide/9780138188283/ch14.xhtml#ch14lev1sec3:~:text=The%20following%20sections,Creating%20recommendations),
are as follows:

1. Planning the research, 
2. Recruiting and logistics, 
3. Writing discussion guides, 
4. Facilitating the research,
5.  Analyzing and presenting the results, and
6.  Creating recommendations.

## 4. What is the difference between a launch and a release? 

The book identifies "launches" or "full releases" as changes that ["signal more than just a numerical milestone-they signify a growth-focused shift."](https://learning.oreilly.com/library/view/a-project-guide/9780138188283/ch15.xhtml#ch15lev1sec3:~:text=signal%20more%20than%20just%20a%20numerical%20milestone%E2%80%94they%20signify%20a%20growth%2Dfocused%20shift)

By contrast, smaller "dot releases" are more incremental changes that may not be as significant as a launch, but can still have a significant impact on the user experience.

I would add to this characterization that launches tend to be more public-facing, while dot releases are more internal-facing. For example, a launch may be accompanied by a press release and marketing campaign, while a dot release may only be communicated to existing users through an update notification (if at all).

# Reflection Questions

## 1. Describe rough usability test plan you could use to test the digital version of this textbook?

1. Contact instructors at UNO who have used the textbook in their courses and ask if they would be willing to participate in a usability test of the digital version of the textbook.

2. If they agree, ask them to recruit students from their courses to participate in the usability test. At this time, work with the instructor to determine if they are able to reward students with extra credit for participating in the usability test. Extra credit may be the form of compensation that is most likely to encourage students to participate in the usability test.

3. Bring a group of students (ideally 30-40, 10 at a time) into a computer lab and ask them to complete a series of tasks using the digital version of the textbook. Tasks could include:
- Finding a specific chapter or section of the textbook
- Searching for a specific term or concept in the textbook
- Answering a specific question using a direct reference to the text ("in the author's words, how does...")

4. Observe the students as they complete the tasks and take notes on any issues or difficulties they encounter.

5. Near the end of each usability test, record (with audio) students' answers to several open-ended questions about their experience using the textbook.

## 2. Overall, what did you think about the book? 

Overall, I felt that the book was relatively concise and well-written.
The textbook was at its best when it was walking through real-world examples of UX design teams' projects.

It was at its worst when it spent 10 paragraphs in a row outlining the business-speak and jargon associated with UX design in the corporate setting. 
Maybe this part is important for the formal practictioner, but for students the different between a content writer and content strategist is mostly moot.

## 3. What is something you learned from the book that you think will be useful in your career? 

The activities designed to help organize and prioritize new features will  definitely be useful in my career.

As an example, diagramming out potential solutions on a 2D matrix where one axis is "ease of implementation" and the other axis is "value delivered" is such a useful idea for prioritizing technical feature enhancements that I'm surprised I've never done it. 

As I start my new role at my job, I feel like this excercise could help FNBO's Site Reliability Engineering team prioritize the problems to solve.

## 4. What is something you learned from the book that you think will be useful in your non-work life? 

Outside of work, one of the most impactful lessons from the book will be how to actually brainstorm. 
I have a habit of thinking of brainstorming sessions (especially in my personal life) as places only for "fully formed" or serious ideas.

However, I tried the "no holds barred", "no idea is a bad one" style brainstorming with my wife on a recent date night, and I felt that we really did land on some more creative solutions than typical because we were open to all ideas right from the start.

## 5. What is a change you would make to the book?

I would make several changes to the book:
1. I think each chapter should have an introduction that lays out the factual content to be discussed in 1-2 sentences. The intros by the authors are fine and good, but given some chapter titles like to lean into UX jargon, they really need a "subtitle" that describes what you'll be learning.

2. I would make sure that each chapter starts with an example of the "process" we are learning being executed _in practice_ (after the 2 sentence summary of the factual content). I think this would be a better "hook" for reader engagement, and also make sure readers can see how these ideas can be used in practice.

3. I would integrate a few more design principles or laws into the book, with examples. I'm not sure why there aren't more of those in a UX design textbook.

# Miscellania

- The authors make a good point that although User Acceptance Testing _can_ discover usability issues, it should nto be relied as the only method of finding them. Why? Because it happpens so late in the development process that fixes are more expensive than if they'd happened before all the code was written.

- This structure for "recommendations" from Daniel Pidcock feels like it would be useful beyond merely UX design. In some ways, this is exactly what I'm looking for when I ask software engineers to explain their reasoning about a proposed solution.
  1. Experiments “We did this . . . ”
  2. Facts “. . . and we found out this . . . ”
  3. Insights “. . . which makes us think this . . . ”
  4. Recommendations “. . . so we’ll do that.”

