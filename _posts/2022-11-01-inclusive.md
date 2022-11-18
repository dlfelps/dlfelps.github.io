---
title: Experiment 09
tags: inclusive programming-languages kotlin scala rust swift functional object-oriented
---

This post explores the possibility of using *inclusive* programming languages, i.e. ones that successfully accomodate functional and object-oriented programming styles in a single codebase. 

## Introduction

Python, C++, Java, and C# are 4 out of the top 10 most popular languages on any survey/poll/list and they have one thing in common - they are all primarily object-oriented languages. This paradigm is characterized by[^1]:

- Data/operations are encapsulated in objects
- Information hiding is used to protect internal properties of an object
- Objects interact by means of message passing
- Classes are organized in inheritance hierarchies

But even these classic languages are now including new features to support a more functional programming style; some people see this as a sign of an upcoming paradigm shift[^2]. My thoughts are more in line with Richard Feldman who argued in his talk ["Why isn't functional programming the norm?"](https://youtu.be/QyJZzq0v7Z4?t=2319) that we are currently undergoing an intermediate phase where we are starting to apply functional programming techniques within object-oriented languages. This post uses 5 criteria to find suitable languages that align to this goal.

## Inclusive programming criteria

The ideal inclusive language is one that allows each individual within a team to follow their preferred programming style (i.e. object-oriented or functional) within a single codebase. Alas no such language exists. We next examine the critical elements necessary to provide successful collaboration between these unique programming styles. These elements are used to **support** and **identify** each paradigm.

> This concept is distinct from that of [multiparadigm languages](https://en.wikipedia.org/wiki/List_of_programming_languages_by_type#Multiparadigm_languages). The primary difference being that while multiparadigm languages might support more than one paradigm, they may not necessarily be well-suited to support more than one paradigm within a single codebase.

### Criteria to support an object-oriented paradigm

I identify 3 properties that I believe are essential for any object-oriented programmer to feel at home in a language:

> O1. classes with methods and properties
>
> O2. encapsulation (i.e. the ability to hide data/methods)
>
> O3. subtype polymorphism (subtyping)

Encapsulation and subtyping[^3] are necessary to apply common design patterns; they also allow programmers to adhere to guiding principles that are well-known within their community. For example, subtyping enables both the "O" and "L" in [S**OL**ID design principles](https://stackify.com/solid-design-principles/). 

This relatively minimal subset of language features doesn't narrow our options much yet; let's discuss the elements critical to functional programming.

### Criteria to support a functional paradigm

The two most defining features of the functional programming style are pure functions[^4] [^5]and immutable data. But these strategies do not require any special language features. One criteria that is often needed to support functional programming is that functions are treated as first-class citizens[^6]. 

> F1. functions are first-class

Most modern languages treat functions as first-class citizens.

### Criteria to identify each paradigm

To properly meet our definition of *inclusive* we must also be able to identify which programming paradigm a particular piece of code follows.

How do you identify object-oriented code? This paradigm is full of easy to spot code smells:
 - classes
 - `for` loops
 - mutable variables

How do you identify functional code? At a glance it may be difficult to pin down functional code, but here are a few things to look for:
 - no classes
 - no `for` loops
 - no mutable variables
 - lots of functions

Classes and `for` loops are easy enough to spot, but what about mutable variables? In order to facilitate this distinction, we add the following critieria:

> C1. mutable variables must be designated as such

This final criteria drastically narrows down the field. The remaining[^7] contenders that make our list of inclusive languages are: Kotlin, Scala, Rust, Swift. Let's briefly examine how each language meets the criteria.

## Inclusive languages

This section is included to show how each of the languages meet the inclusive criteria. You may choose to skip it.

### Kotlin

> [Kotlin](https://kotlinlang.org/) is a "modern programming language that makes developers happier."

 - O1 - has regular classes (plus enums, data classes, and sealed classes)
 - O2 - class properties/methods can be made `private`
 - O3 - uses interfaces for creating subtypes
 - F1 - functions are first-class (also supports anonymous functions)
 - C1 - immutable variables are initialized with `val`; mutable variables are initialized with `var`

### Scala

> "[Scala](https://www.scala-lang.org/) combines object-oriented and functional programming in one concise, high-level language."

 - O1 - has regular classes (plus enums and case classes)
 - O2 - class properties/methods can be made `private`
 - O3 - uses interfaces for creating subtypes (with mixin composition to compose components)
 - F1 - functions are first-class (also supports anonymous functions)
 - C1 - immutable variables are initialized with `val`; mutable variables are initialized with `var`

### Rust

> [Rust](https://www.rust-lang.org/) is a "language empowering everyone to build reliable and efficient software."

 - O1 - has structs with implementation methods
 - O2 - everything is `private` by default; `pub` makes it public
 - O3 - uses traits for creating subtypes 
 - F1 - functions are first-class (also supports anonymous functions)
 - C1 - variables are immutable by default; mutable variables are designated by `mut`

### Swift

> [Swift](https://www.swift.org/) is a "general-purpose programming language built using a modern approach to safety, performance, and software design patterns."

 - O1 - has regular classes (also enums and structs)
 - O2 - class properties/methods can be made `private`
 - O3 - uses protocols for creating subtypes
 - F1 - functions are first-class (also supports anonymous functions)
 - C1 - immutable variables are initialized with `let`; mutable variables are initialized with `var`

## Why should your team pick an inclusive language?

Successful software development requires solving two kinds of problems - technical and human.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Junior programmer&#39;s bookshelf: 90% APIs and programming languages; Senior programmer&#39;s bookshelf: 80% applied psychology.</p>&mdash; ☕ J. B. Rainsberger (@jbrains) <a href="https://twitter.com/jbrains/status/616228270841962496?ref_src=twsrc%5Etfw">July 1, 2015</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I believe inclusive languages offer benefits on both of these fronts. On the technical side, neither style is universally superior. The object-oriented approach is usually better if your system "operates" on "things" and new features typically involve adding new things (rather than new operations). On the other hand, if new features typically require new operations then a functional style may be a better fit[^8]. 

They can also be used in conjunction; [clean architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) may be a good model. Following this approach, you can model your domain and write all of your core business logic using functional code. Then use an object-oriented style at the adapter and interface layers. Given that the majority of code written today is object-oriented, there are certainly some benefits of applying functional techniques where it makes sense without having to demand that the entire codebase be rewritten in a functional language.

I believe that providing your teammates with the ability to code as they want to, using the paradigm of their choice, will increase team happiness and morale. I hope it also encourages conversations and teaching moments from both sides. Will you be more productive? Will you create a better design? Will you get a better product? I don't know...

## Next steps

Which language should I pick? Here are a few questions to help you make a decision.

 - Are you doing systems programming? -> Rust
 - Are you working on iOS? -> Swift
 - Are you working on Android? -> Kotlin
 - Do you need to interoperate with other Java code? -> Scala/Kotlin

If you don't identify strongly with any of the questions above, you may want to consider a language that is easier to learn (especially if you are teaching an entire team). Based on the collective background of the team, here are my recommendations:

If you are coming from a Java background...

> kotlin < scala < swift < rust 


If you are coming from an Objective-C background...

> swift < kotlin < rust < scala 

Still unsure? Ok, Ok, don't twist my arm. Pick Kotlin :)

## Conclusion

> You can write crap code in any paradigm. - Dave Farley 

There is clear division between those who use more mainstrain (i.e. object-oriented) languages and those who use functional languages. There are countless blogs (primarily from the functional crowd) trying to convince the majority to "see the light." It is a "them vs. us" mentality, but I believe there is a middle ground where these two crowds can meet, learn, develop, and succeed together. This middle ground is an *inclusive* programming language.

Thanks for reading!

#### Footnotes

[^1]: [Object-oriented paradigm](https://homes.cs.aau.dk/~normark/prog3-03/html/notes/paradigms_themes-paradigm-overview-section.html#paradigms_oo-paradigm-overview_title_1)
[^2]: “Why Functional Programming Should Be the Future of Software Development,” IEEE Spectrum, Oct. 23, 2022.  [Online]. Available: https://spectrum.ieee.org/functional-programming. [Accessed: Nov. 14, 2022]
[^3]: Subtyping is also known as interface inheritance, whereas subclassing is known as implementation inheritance or code inheritance (see [Liskov substitution principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle)).
[^4]: A pure function is a function that, given the same input, will always return the same output and does not have any observable side effect (from [Professor Frisby's Mostly Adequate Guide to Functional Programming](https://mostly-adequate.gitbook.io/mostly-adequate-guide/ch03))
[^5]: A side effect is a change of system state or observable interaction with the outside world that occurs during the calculation of a result. Examples include: reading a file, inserting a record into a database, making an http call, printing to the screen, or getting user input.
[^6]: This means the language supports passing functions as arguments to other functions, returning them as the values from other functions, and assigning them to variables or storing them in data structures
[^7]: Several languages just missed the cut. C#, C++, Java, and Go meet all the conditions except that mutable variables are not designated. F# and OCaml actually met all the criteria, but I do not believe that the average object-oriented programmer would be comfortable using them. 
[^8]: Philip Wadler named this the [expression problem](http://homepages.inf.ed.ac.uk/wadler/papers/expression/expression.txt). Another good reference [here](https://www.cs.cornell.edu/courses/cs3110/2015fa/l/25-expression/lec.pdf). 
[^9]: Capretz, Luiz Fernando. "Personality types in software engineering." International Journal of Human-Computer Studies 58.2 (2003): 207-214.
