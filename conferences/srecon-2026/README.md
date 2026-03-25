# SREcon 2026 Notes
{: .no_toc}

Author: Evan Brooks

Date: March 24-26, 2026

Contains notes from USENIX SREcon 2026.


# Table of Contents
{: .no_toc}

* TOC
{:toc}

## Notes from Tuesday, March 24th

### Keynote
- As software becomes cheaper and easier to build, we will come up with more and more ways to use it. (based on Jevins Paradox)
- How do you respond to failures when people don't understand the depth of the system as well as they used to?
- The curse of knowledge: two-dimension model, x-axis is competence, y-axis is consciousness
  - Bottom: Don't know we don't know (unconsciously confident) = I'm going to make things worse.
  - Middle Bottom: Aware that we don't something = I know I need help.
  - Middle Top: Aware that we DO know something = I know how to fix things that are broken.
  - Top: Unconscious competence: "I know things but I can't explain how") = I have an intuition about might be broken.
- LLMs "hallucination" is when the answer isn't in the source material. Since we ask novel questions in our field, 
  we (engineers) experience more hallucinations than others so the base rate of 2% might feel low to us.
- Prediction: Systems are going to get bigger and more complex, changing at a rate we've never seen before.
- Prediction: We will be moving up the scale of abstraction, thinking less about exactly what went wrong with a 
  database or server, and more about interactions between systems. We need to spend more time reasoning about the
  user experience in various scenarios. "What if X, then the user sees Y"
- Generic mitigations: a series of buttons or levers you can push no matter what is going on (example: 
  turning it off and back on, rolling back to prior version of the software, migrating off broken hardware)
  - These will become more important because we won't immediately know the details of how the systems work when paged
- Good news: experimentation just got a lot cheaper, and we need to do more experimentation as SREs. We need to 
  structure our work as a series of experiments that structure the plan. 
- Test generic mitigations as fitness function (e.g. if your goal is to make sure that rollback is always an option, 
  make sure to automatically test rollbacks all the time)

### Mean time to WTF
- Deployment frequency is increasing due to AI-assisted dev teams, that ship faster
- 10% of deployments, when deployment count is increasing, because a larger number. This increases the friction alongside it.
- DORA metrics to measure pipeline health:
  - Deployment frequency = how often can we deploy code, how often are we responding to incidents
  - Lead time for changes = how long it takes from change merged to deployed and stable (speed is a risk input)
  - Change failure rate = what % of our changes cause incidents
  - Mean time to restore = average time to resolve an incident
- SPACE metrics to measure the whole development lifecycle:
  - Satisfaction - how satisfied are we with the tools, on-call burden, psych safety during incidents
  - Performance - mean time to detect, mean time to restore
  - Activity - toil ratio (?), runbook coverage, automation percentage
  - Communication - incident coordination overhead, how many places do you go to find information, handoff quality
  - Efficiency - tool context-switching, flow interruption, time-to-understand
- Mean time to What the Fork (MTTWTF) - time from incident to "I understand what is going on"
- How to justify the costs to management
  - When talking to developers, talk about "experience", not "productivity"
  - When talking to stakeholders, they will fund "reliability," but not so much "happiness." Anchor proposals to 
    something the business unit _already owns_ (e.g. finance team's downtime cost estimate is a good starting point)
- 

### The Zero Trust Odyssey: Our Journey to Modernize Internal Access

- Goals: reduce three developer access points (VPN, bastion, proxy) to a single one
- Identity aware security: common Okta IdP backed AuthX control plane
- Improved CLI/service access story: simplify machine to machine and CLI authentication without browser login flows.
- Using Cloudflare tunnels to route traffic to the correct EKS cluster (and thus internal EKS load balancer) based on DNS records stored in Route53
- "If you're a human coming from the internal network, your DNS resolves differently" via resolver policies. 
- Humans route to a "cloudflared" tunnel running in the EKS cluster. Scaling with KEDA/HPA on cloudflared_tunnel_concurrent_requests_per_tunnel
- Challenges: Treating Kubernetes clusters as cattle, spinning up and dropping them down automatically
- Authorization is handled by the application layer (womp womp), not the VPN
- Contact information: nathan.handler@reddit.com, [Jobs](https://reddit.jobs)

### Operating Tens of Thousands of GPUs on Hyperscalers: Failure, Firmware, and the Illusion of Capacity
- NVIDIA engineers
- At the scale of Nvidia, a bunch of common assumption are not always true:
    - AWS/GCP/Azure APIs aren't always up
    - Upgrading a node (server) doesn't always work
    - A given storage or network connection throughput is not always given, even if that is what you paid for
- "Weak signals" - the metrics you get from a cloud provider are not a 100% accurate representation of the state of the system,
  and you don't always have the information needed.
  - Keep your own records, don't blindly trust the cloud provider's metrics.
- "kernel log link flap" lol this talk is so jargon heavy
- Nominal capacity (what is promised by the cloud provider) does not necessarily equal what you ACTUALLY get under load
- "I personally have more than one 15,000 host groups" oh my lord
- It is more expensive to disrupt workloads than it is to maintain a certain amount of capacity overhead on nodes

### STPA for Software Systems - Illuminate the Unknown Unknown
- Goals: describe STPA, use it in practice to predict incidents with it
- STPA is a system to methodically predict where incidents might occur in a system at the _design stage_
- Background: most failure modes are introduced during the design of the product, but they are detected in testing and production
- STPA = "Systems Theoretic Process Analysis", four official steps:
    1. Scope the analysis - define the losses that stakeholders try avoid and unsafe system states that could lead to those losses
    2. Model the system - modelling behavior and control
    3. List unsafe control actions - identify unsafe control actions that could lead to unsafe states
    4. Build loss scenarios - explain how the unsafe control actions could actually lead to the losses
    5. (Unofficial Engineering phase) Mitigations - engineer the solutions to address these scenarios
- Pen and paper method to analyze behavior of a system, and see all the ways that your system can have a loss; it's like having a flashlight and being told where to point to illuminate the unknown unknowns

Example "losses":
- Loss of revenue
- Loss of brand trust
- Loss of legal compliance
- Injury or loss of life

> Losses should not reference low level details or causes. They should derive from business processes or values, not technical details. 
> For example, "loss of revenue" is a good loss, but "database outage" is not a good loss.

Example "hazards" (hazard = a system state that will lead to a loss under worst case environmental conditions):
- Production service is returning errors
- Production service is responding slowly

Basic control feedback loop process line diagram:
```
Controller -> Control Action -> Process -> Feedback -> Controller
```

Google finds that developers are good at determining control actions, but don't do a good job of identifying feedback mechanisms 
(low fidelity or none at all), which is where a lot of the unknown unknowns are.

> UCA = Unsafe Control Action is a control action that could lead to a hazard in specific contexts.
For example, "turning on the database" is a control action. If it is done at the wrong time, it could lead to a hazard (e.g. if the database is already overloaded).

Example UCAs:
1. Roll back to previous version when the production service is NOT returning errors
2. Roll back to previous version if the prior version is no longer compatible with production (db schema change)

All possible UCAs fall into the following categories:
- Roll back when X (take a action)
- Not roll back when X (don't take an action)
- Roll back before/after X (timing of action)
- Roll back stopped too soon/applied too long X (timing of action)

Step 4: goal is a comprehensive list of the ways a UCA can happen, leading to hazard states and lossses.
"Safe feedback" vs "Unsafe feedback"

Safe feedback leading question:
- Why would the production service NOT be rolled back in spite of feedback existing that shows server errors?

Specific questions you can ask to help system controllers:
- Who makes the decision to roll back?
- How does the SRE decide whether to roll back?
- What dashboards/signals/etc. do you look at?
- Does anyone ever order the SRE to do a rollback?

Unsafe feedback is feedback that is wrong, delayed, incomplete, or missing. Unsae feedback leading question:
- Why would the feedback NOT indicate that the service is returning errors, even though it is?

Control path scenario questions for UCA: SRE does not roll bcak to previous version when production service is returning errors. Example:
> How can you explain that the SRE initiates a roll bcak, but the roll bcak doesn't reach production?

Controlled process scenario question:
> Why would the rollback reach the production service, but the production service isn't rolled back to a previous version?

Software is built in the happy path. Software engineers are optimists, and SREs are pessimists.
STPA is way more popular in the design stage of the application. 

Key takeaways: 
- STPA finds and fixes deisgn problems at a fraciton of the cost
- STPA enables a systemic exploration of unsafe system behavior

## Notes from Wednesday, March 25th

### Escaping Version Skew: Formalizing compatibility in a world of partial rollouts

- Adding time dimension to your deployments makes them hard to reason about
- Systems we make most often break when they change
- Don't rely on humans to catch breaking changes cause by rollout order
- protobufs solve some of the problems of version skew, but limit the types of changes you can make. Your code shouldn't have to handle "all versions for all time" 
- The stricter a schema is, the easier it is to make a breaking change, and our current tooling creates what he calls "optional slop." Optional slop reduces the usefulness of the typing, making "impossible states" possible. Example:
mutually incompatible fields in a protobuf schema, but they are both optional, so you can have a state where both fields are set, which SHOULD be an impossible state and prevented by the types.
- agentic worklflows get safer with stricter contracts, because they:
  - declare a smaller legal state space and
  - makes assumptions explicit
- Claim: we can make this better by stopping sharing types between client and servers.
  - Writers provide a strict schema that only declares the CURRENT version of what is being sent
  - Readers should accept the union of the prior few valid schemes
- To implement this, since no one wants to write the consumer to branch on the different types, we should generate code from the schema. Process:
1. Update the write schema strictly.
2. CI detects breaking changes.
3. Generate writer type as strictly as possible.
4. Generate reader types as a union of the last few writers.
5. Measure how often old writer branches still deserialize.
6. Delete old branches once metrics hit zero.

- Introducing jsoncompat: statically analyzes JSON schema changes to determine whether they are breaking, with a fallback on a fuzzer to generate a concrete counterexample when static analysis is hard
  - L~new~ is subset of L~old~ = new writer safe for old reader
  - L~old~ is subset of L~old~  = old writer safe for new reader
- JSON schema's usage of things like if-then makes static checking very difficult or impossible
- At OpenAI, tests in certain parts of our codebase fail if the type is not annotated to force type checking
- Where is the worth it are boundaries where state outlives binary: caches, queues, databases

### So You Want a New Incident Commander — Lessons from Building Incident Response Teams

- Used to be the only one leading incident calls and running post mortems at my company
- "I was the single point of failure"
- Most teams already have teams that can be great incident commanders, we may not have recognized them yet
- An incident starts as a technical failure, but it won't stay purely technical. Quickly, it will become an 
  organizational event. You'll have engineers proposing strategies, leaders asking for updates, and customer-facing
  employees asking for what to say to customers. 
- Sociotechnical role: humans interacting with a complex system under pressure
- Instrument command is more like conducting an orchestra than it is about being the boss
- The real job is in three parts
    - For the people: helping them focus & avoid duplicate work, ensuring communication, discussing decisions
    - For the system: creating a shared understanding of the system as technical employees unearth details
    - For the business: knowing what matters to your organization and communicating impacts, actions taken, etc.
- Anti-patterns selecting an incident manager
    - the strongest engineer: don't remove your best investigator from the investigation
    - anyone on call: they may not have the skills
    - most senior person: two problems: people are scared of the most senior manager and most senior people have lots of strong opinions, risking them DICTATING technical and organizational solutions
- Evidence to justify the cost of buiding an incident response team:
    - Combine concrete incident stories with data to justify
    - Data to consider:
        - Cost of uncoordinated events: "14 engineers just sat on a call for 4 hours. that's a lot of time."
        - Before/after incident command
    - Start small and prove the value incident command brings: train a single person and see how it goes
- Options for structure:
    - (her favorite) Deliberate IC team: has explicit responsibility over incidents, they have dedicatedtraining and builds up a lot of experience in those running incidents
    - Incident Commander per domain team: good for groups with strong ownership boundaries, but challenges including inconsistent training and delays moving across technical domains ("how many incidents really only demand the involvement of one segment?")
    - (doesn't love this) IC volunter team: spreads skills, but it can be stressful for the volunteers
- Regardless of the structure, your ICs need to know this is a priority and part of their jobs. It can't just be "one more thing" on their plate.
- Core competencies of IC:
    - Communication
    - Socio-technical leadership
    - Cognitive load
- People who are good at this are "good with people," good with working with ambiguity or with partial information, and good at communicating complex topics at multiple levels of abstraction
- Incidents are not technical failures, they are sociotechnical events. The politics matter as much ast the technical status.

### Epistemology of Incidents and Problem Solving
- Epistemology:
    - How do we find truth in an incident?
    - How can we be certain it's the truth?
    - How can we level up our communication and teammates in the process?
- If you don't write something down so that the process can survive a transition in teams, then you aren't going to react well over time
- Culture of collaboration is a critical ingredient of incident response:
    - "In my opinion, it is a tragedy when an incident is worked alone."
    - "It sucks to page someone else at three AM. It sucks more to decision make alone."
- Phase 1: Survive and Triage. First goal is to keep the boat afloat. Example actions to "buy time in reversible ways":
    - Rollback
    - Scale-up
    - Circuit breakers
    - Access denial
- Phase 2: Examination.
    - Think in systems and chunks
    - Look at the gaps in information and glean meaning from inconsistencies in reported information. 
    - Keep great personal notes. Note taking format:
        - Evidence of the problem: signals that are abnormal
        - Correlated/causal: as I explore, what's related or might be linked
        - Normal: what is normal about the system right now; what looks fine
        - Odd but uncorrelated: computers are weird, "I don't think this is part of the issue," likely to be handled in post mortem if at all
- Phase 3: Diagnosis/Hypothesis
    - Come up with a consistent testable thesis about what is wrong, and execute the experiment.
    - Search patterns: 
        - Linear search (follow the traffic from Edge, to Auth, to Load balancer, to server, to database)
        - Binary search/bisect: check a point in the middle of the flow, tells you whether the issue is upstream of downtime
    - Think in proximity and correlation. 
        - What has happened _recently_ (in time) or _nearby_ (in deployment space)?
        - What _actions_ have been taken?
    - When there is only one hypothesis available at once, you will only be executing on one thing at a time.
    - What makes a good hypothesis?
        - A hypothesis must be testable and relevant and specific to the shape of the current issue.
- Phase 4: Test & Treat the issue
    - A test must work on a specific hypothesis to clearly determine what information you're going to gain from the test.
    - The test should favor the "likely reason" over the unlikely and favor the "fast to verify" over the slow, and avoid as many side effects as possible.
    - Test outcomes should be tracked in your mind and notes, and used to update your hypothesis to create another test.
    - Be proactive: While you are waiting for a test to execute, imagine that your test succeeds, what do you do next? Imagine that the test fails, what do you do next? You can even draft the next coms statement for each of those outcomes while you wait.




## Overall Takeaways
- If scaling the cluster should always be an option, we should set up an automation to automatically scale up and
down the cluster by one node all the time
- Open a runbook this week and see if it reflects reality. Could someone new on this team open this today and understand it?
- Implement a SPACE metric in each category, Activity is easiest to get started with
- Talk to one of your colleagues. Ask them what do you swear at the most. (Schedule 3 listening sessions 
  [aka coffee with an expert where you ask questions](developerexperiencebook.com], napkin math the cost of one 
  specific friction point)
- Talk to someone from finance. Get an estimate of downtime cost per minute/hour/whatever, and, for bonus points, ask 
  how it is calculated.
- Your measurement doesn't have to mandate change. It just has to make the status quo uncomfortable. 
- Look into Kubernetes operators and common use cases for them
- Limit manual interventions to at most 2 hosts; anything more should be automated. 

Fun quotes:
- Any line of code can be load bearing
- "Every hour of downtime costs us $12,000. Friction is adding 8 minutes to every incident. Removing that friction will save us $1,600 per incident."
- Even though we have Terraform modules and it's relatively easy to use them, most developers are not that comfortable with Terraform so we needed something else. - Reddit senior engineer

Book recommendations: 
- How Complex Systems Fail, by Dr. Richard Cook
- The Art of Business Value, by Mark Schwartz - ideas of problems to solve outpaces the speed of implementation
- 


## Workpad

### [Throttling testing from 03/20/2026](https://esd41354.apps.dynatrace.com/ui/apps/dynatrace.kubernetes/smartscape/workload/K8S_STATEFULSET?perspective=Utilization&sort=healthIndicators%3Adescending&detailsId=K8S_STATEFULSET-2C823534C4234916&sidebarOpen=false&detailsTab=Utilization&tf=2026-03-20T15%3A00Z%3B2026-03-20T21%3A00Z#filtering=Workload+%3D+bluesky-np-kubernetes-monitoring-activegate+)

- requests = 1500 mcores, Limits = 6000 mcores
    - result: no throttling
- requests = 600 mcores, limits = 6000 mcores
    - result: no throttling
- requests = 600 mcores, limits = 750 mcores
    - result: 1000 to 2000 mcores throttling

### Follow up scenarios to test on 3/25/2026
- Set requests = limits, what value should I use? ()
- 