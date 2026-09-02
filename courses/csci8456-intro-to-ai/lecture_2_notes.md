# Lecture #2 Notes - Artificial Intelligence
- Author: Evan Brooks
- Date: Wednesday September 2nd, 2026

Original version of these slides were created by Dan Klein and Pieter Abbeel for CS188 Intro to AI at UC Berkeley.

## Announcements
- Recommend watching the talk by [Dr. Moshe Vardi on YouTube](https://www.youtube.com/watch?v=KRSRC64rZ7E)
    - Estimated time: 1 hour
    - Required? Not at this time
- [Homework 1 (Uninformed Search)](https://mynu.instructure.com/courses/20132/assignments/1268110) is due September 16th at 11:59pm, submit on Gradescope
- [Reading on AI: Classics on Commonsense Reasoning (Grad students only)](https://mynu.instructure.com/courses/20132/assignments/1268128) is due Sept 16th at 11:59pm: one reading + one paragraph showcasing one new or impressive idea in the article


## Continued slides from introduction lecture

### Short history of AI
- 1940s-50s: Early days
    - 1943: McCullough & Pitts: boolean circuit model of brain
    - 1950: Turing's "Computing Machinery and Intelligence"
- 1950-70: Excitement
    - 1950s: early AI programs including Samuel's checkers program, Newell & Simon's logic theorist, Gelernter's Geometry Engine
    - 1956: Dartmouth meeting where term "Artificial Intelligence" was adopted
    - 1965: Robinson's "complete algorithm for logical reasoning"
- 1970-90: Knowledge-based approaches
    - 1969-79: Early development of knowledge-based systems
    - 1980-88: Expert systems industry booms
    - 1988-93: Expert systems industry busts: "AI winter"
- 1990: Statistical approaches
    - Resurgence of probability, focus on uncertainty
    - General increase in technical depth
    - Agents and learning systems... "AI Spring?"
- 2000: Where are we now?

> "For many years, neural networks were quite niche and inefficient.
> GPU computations required for video games turned out to be extremely
> powerful for neural networks and sped up development of that domain
> into large language models.
> - Dr. Lierler

### Recent developments
- Classic moment in May of 1997 where "Deep Blue" beat Gary Kasparov in Chess
- Natural language technologies
    - Speech technologies (e.g. Siri)
        - Automatic speech recognition (ASR)
        - Text to speech sythesis (TTS)
        - Dialog systems
    - Tools and technologies
        - Google Maps routing algorithms
        - Weather predication algorithms
    - Language processing technologies
        - Question answering
        - Machine translation
        - Web search
        - Text classification, spam filtering
        - ChatCPT-like conversational and code-writing assistants
- Computer vision
    - Phone face detection
    - Zoom background blurring
    - Retina scanner
    - Car braking assist technologies or self-driving
- Logic
    - Theorem provers
    - NASA fault diagnosis
    - Question answering
    - Methods:
        - Deduction systems
        - Constraint satisfaction
        - Satisfiability solvers (huge advances!)

### Topics for this class
- Constraint satisfaction, e.g. scheduling
- Search, planning, prediction, reinforcment learning, e.g. routing, robot navigation
- Probabilistic inference, e.g. robot localization


## Artificial Intelligence - Search

### This slide deck's contents
- Define agents that plan ahead
- Search problems
- Uninformed search methods
    - Depth-first search
    - Breadth-first search
    - Uniform-cost search

### Rational agents
- An **agent** is an entity that _perceives_ and _acts_
- A **rational agent** selects actions that maximize its (expected) _utility)

### Reflex agents
- Choose action based on current percept (and perhaps memory)
    - May have memory or a model of the world's current state
    - Do NOT consider the future consequences of their action
    - Consider how the world IS, not how it _may be in the future_

- Can a reflex agent be rational?

> "Sometimes, if the state space is extremely narrow and can 
> be optimally solved with something like a look up table."
> Dr. Lierler

### Planning agents
- Planning agents
    - Ask "what if"
    - Decisions based on (hypothesized) consequences of actions
    - Must have a model of how the world evolves in response to actions
    - Must formulate a goal (test)
    - Consider how the world IS right now and how it _WOULD BE_
- Optimal vs. complete planning
    - "Complete planning" - Guaranteed to find a valid solution if one exists
    - "Optimal planning" - Guaranteed to find the best solution if one exists, as judged by some cost metric (e.g. shortest path taken to eat all the dots in Pac-Man)

- Planning vs replanning

### Stopping here on slide: Search Problems

## Miscellania
- Netflix documentary on Go world champion AI software: [AlphaGo](https://www.netflix.com/title/80190844)