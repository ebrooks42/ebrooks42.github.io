# Outline for Chapters 7-8 of A Project Guide to UX Design
{: .no_toc}

Outline author: Evan Brooks

Outline date: Feb 1st, 2026

# Table of Contents
{: .no_toc}

* TOC
{:toc}

# Essential Questions:

## 1. What are the six basic steps of user research?

The [six basic steps of user research](https://learning.oreilly.com/library/view/a-project-guide/9780138188283/ch07.xhtml#ch07lev1sec1:~:text=Basic%20Steps%20of%20User%20Research)
are:
1. Define your primary user groups. 
2. Plan your research
3. Conduct the research
4. Form and share your findings. 
5. Validate your user group definition.
6. Generate user-focused product ideas.

## 2. What are the steps of defining user groups?

As specified in the book, the steps are:

> 1. Create a list of attributes that will help you define the different users of your site (the next section will cover some of the most common).
> 2. Discuss and expand on those attributes with people at your company who have contact with relevant types of users (for example, customers).
> 3. Prioritize the attributes that seem to have the largest impact on why and how a potential user would use your product.
> 4. Segment the user groups that you will focus on in research and design.
> 
> [Link to Quote](https://learning.oreilly.com/library/view/a-project-guide/9780138188283/ch07.xhtml#ch07lev1sec2:~:text=Here%20are%20the,research%20and%20design.)

I would add that in my experience, step (2) often adds the most value for me. 
As an engineer, I often have a relatively narrow view of our users.
Speaking with product teams and other business partners helps me expand that view beyond simple task-based analysis.

## 3. What do these terms mean in the context of user research: primary user goals, roles, demographics, experience, work attributes?

- Primary user goals are the primary objectives of users arriving at your website.
  ["Why are users coming to.. and what are they trying to accomplish?"](https://learning.oreilly.com/library/view/a-project-guide/9780138188283/ch07.xhtml#ch07lev1sec2:~:text=Why%20are%20users%20coming%20to%20it%20and%20what%20are%20they%20trying%20to%20accomplish%3F)
- Roles are user categories tied to their primary objective (ex: applicant for a credit card, credit card holder, job seeker).
  They can be subdivided narrowly if product experiences need to meaningfully differ for each type (e.g. on-sale shoppers vs. brand loyalists).
- Demographics describe facts about the user that can be used to group them. (Examples: age, family, etc.)
- Experience describes the ["level of familiarity with the subject matter"](https://learning.oreilly.com/library/view/a-project-guide/9780138188283/ch07.xhtml#ch07lev1sec2:~:text=level%20of%20familiarity%20with%20the%20subject%20matter)
  and technologies in your website the user has. 
- Work attributes seem to just be demographic attributes to the scope of the users' jobs. Examples include: company size, department, role at company (customer support vs manager).

## 4. What are a goal, an objective, and a hypothesis in the context of user research?

The goal is the purpose of the research, in broad terms. 
Goals typically are the ["state or level of understanding you're trying to ultimately reach."](https://learning.oreilly.com/library/view/a-project-guide/9780138188283/ch07.xhtml#ch07lev1sec3:~:text=level%20of%20understanding%20that%20you%E2%80%99re%20trying%20to%20ultimately%20reach)

Example:
> Understand the likelihood that nonprofessional stock traders would learn how to trade options.

By contrast, objectives are usually smaller, specific, and measurable. Most research will contain several objectives to achieve a single goal.

Example: 
> Uncover the obstacles that may stop a stock trader from learning how to trade options.

Finally, hypotheses are statements that can be ["validate[d] or invalidate[d]"](https://learning.oreilly.com/library/view/a-project-guide/9780138188283/ch07.xhtml#ch07lev1sec3:~:text=A%20hypothesis%20is%20an%20idea%20you%20want%20to%20validate%20or%20invalidate)
via the gathering of evidence. 

Example:
> Customers are abandoning their cart here because the shipping price is too high.

## 5. What is the difference between qualitative and quantitative research?

Quantitative research focuses on gathering and analyzing numerical data, usually from relatively large numbers of users.

By contrast, qualitative research focuses on gaining "context and insight" regarding user behavior. 

The books notes that combining the two is usually better than focusing on a single type for a study.

## 6. Describe three user-research methods.

- User interviews are one-on-one conversations with participants in one of primary user groups.
  They can provide great context, but needs lots of interpretation.
- Field studies: On-site visits to locations with lots of potential users. 
  Useful when you have little information on potential users upfront and when those users are physically present in a single spot.
- Product analytics: Analyzing the data coming from tools like Google Analytics or Hotjar to determin what actions current users take an how successful they are at them.

## 7. What is a persona in the context of design?

A persona is an artifact/document that describes a specific user type by sketching a lifelike representative portrait of these uses.

My contribution: If you've ever said "well how would my grandma solve this problem?" you were using "grandma" as a persona for an older group of site users. 

## 8. Why are personas useful?

Personas are useful because they ground your design and research in representative users of the product, usually drawn from a primary user group. 

My note: I imagine their usefulness exceeds that of basic "user group attributes" because our brains are better at predicting a single "person's" behavior than considering groups as a whole.

## 9. How do you create a persona?

Based on your initial research on user groups, you create a persona by
1. Giving the persona a name and a photo.
2. Describing their demographics, roles, goals, behaviors, and pain points.

A representative quote can also help bring the persona to life.
Personas can be simple word documents or more complex visual artifacts.

The book mentions that an empathy map can help in the creation of a persona, if research-driven data to generate one is not available for time or budget reasons.

## 10. PLEASE GOOGLE: What is an IRB and how does that relate to human research in the context of a university?

According to [Wikipedia](https://en.wikipedia.org/wiki/Institutional_review_board):

> An institutional review board ... is a committee at an institution that applies research ethics by reviewing the methods proposed for research involving human subjects, to ensure that the projects are ethical.

These are required for all university research involving human subjects in the US. This matters for UX design research because many studies involve human subjects.

# Reflection Questions

## 1. Does user research as described in chapter 7 line up with how you have seen research/science done in the past? Why or why not?

Although I'm not directly involved in user research at work, the artifacts of user research (personas, user journey maps, etc) are commonly used at my workplace and I've seen them.

In practice, my experience has been that the UX teams at FNBO and Mutual of Omaha focus on qualitative research methods like user interviews and usability testing.

I think this may be because these methods are cheaper and faster overall than larger scale quantitative research methods.

## 2. What do you think is one potential pitfall when defining user groups and how could you avoid it?

I think a huge pitfall is assuming that your own perspective is representative of your users. 

I believe that engineers are particularly prone to this bias. 
For us, the site's behavior may seem obvious, but users may have very different mental models of how the site should work.

To avoid this pitfall, I would suggest involving non-engineers in the user group definition process, especially those who have direct contact with users (e.g. customer support, sales, marketing).
Or even better, involve actual users via interviews or surveys.


## 3. What is a qualitative question you could ask about someone's user experience with this book?

The last time you used the digital textbook, what were you trying to accomplish?
Did anything stand in the way of you accomplishing that goal?

## 4. What is a quantitative question you could ask about someone's user experience with this book?

- How many times have you used the digital textbook in the last month?
- Between 1 and 5 stars, how would you rate the usefulness of the examples in the textbook?

## 5. How can you personally practice building empathy as a design skill?

One way I can practice building empathy is to interview the actual users of the websites and applications I work on more frequently. 

Often their needs are relayed to me by product owners, but hearing directly from users would help me build empathy for their needs.

# Miscellania

- GitLab's goals, objectives, and hypotheses guide could be useful when setting personal work achievement goals as well: http://about.gitlab.com/handbook/product/ux/ux-research/defining-goals-objectives-and-hypotheses