---
title: Experiment 02
tags: reproducible net

---

The next few posts take step back to examine the benefits of creating reproducible software. We will explore:
  - the continuosly reproducible mindset (this post)  
  - foundational tools for reproducibility (Exp 03)
  - creating a continuously reproducible .NET project (Exp 04)

## Introduction

Scientific experiments must be repeatable and reproducable to be considered scientific. Reproducability in software is optional - software that works but is not reproducible is still successful software. I hope to convince you that the overhead required to create reproducible software is low compared to the benefits that it provides future developers, even if the only future developer is you.

## Defining reproducible software

It is useful to clarify our definition of reproducibility within the context of software development. Let P<sub>0</sub> represent a stable, compiling build of a codebase that results in a *correct* program. The reproducibility test for P<sub>0</sub> is as follows:

> Does the code/documentation for P<sub>0</sub> contain sufficient information to reproduce the *correct* program from a clean environment? (Yes/No)

Next, let P<sub>1</sub> represent the code (in the new environment) that has undergone a substantial change that *modified the build environment.* We can reapply the reproducibilty test to P<sub>1</sub>. The number of times that code passes the reproducibility test can be defined as its reproducibility level [0..N].

It may be useful to name a few of these levels.

- *Irreproducible* - Reproducibility level 0; P<sub>0</sub> failed the reproducibility test.
- *One-time reproducible* - Reproducibility level 1; P<sub>0</sub> passed the reproducibility test, but P<sub>1</sub> failed.
- *Continuously reproducible* - Reproducibility level 2+; If P<sub>0</sub> and P<sub>1</sub> pass the reproducibility test then it is indicitave that the code is written in a way that supports reproducibility for future generations of the code. 

## The continuously reproducible mindset

How many times have you pulled a project from Github only to have it fail to compile?

> It works on my machine ¯\\\_(ツ)_/¯

We can reduce this problem by expanding our mindset to strive for **continuously reproducible** code. The key to creating continuously reproducible code is create a simple workflow that rebuilds the project from a clean environment (preferably Windows, Linux, and OSX). This allows you to isolate undocumented side-effects that can occur in your local development environment (e.g. relying on a tool available locally that is not installed during the build process). 

Continuosly reproducible code balances the need to solve the current problem with the need to redeploy the codebase to new systems. If this doesn't seem worthwhile, then it might be helpful to imagine that your code (P<sub>0</sub>) will be extended by a different developer in a substantial way (P<sub>1</sub>) before it is returned to you for another round of development (P<sub>2</sub>). The time spent during the initial phase of development to create a build process that is easy to replicate across platforms (and modify as needed) will payoff in the long run.

But what if you are the only developer that will ever use this code? I have  found the continuosly reproducible mindset to be helpful in my personal projects for tracking down build-related problems and ensuring robust code that works on multiple platforms (I develop locally on Windows but sometimes require a linux binary). 

## Measuring the longevity of a build

If a specific build passes the reproducibility test then its longevity can be measured. Longevity is a measure of the period of time between the first time the build passes the reproducibility test and the last time it passes. All builds eventually fail because some dependency of the build process will fail (including the language itself - .NET Framework 3.5 was released in November  2007 but it is no longer available from Microsoft). 

<p align="center">
  <img width="600" height="400" src="/assets/images/fight_club.jpg">
</p>

Longevity is measured for a single build configuration. Namely, P<sub>0</sub> will have a certain longevity, but P<sub>1</sub>'s longevity may be shorter or longer depending on the changes made to its build configuration. Although true longevity can only be calculated after the build fails, developers can make conscious decisions to maximize the expected longevity of their code:
- prefer dependencies that offer long term support (e.g. choose .NET 6 LTS even after .NET 7 is released) [^1]
- prefer dependencies that minimize the number of [transitive dependencies](https://fsprojects.github.io/Paket/faq.html#What-does-transitive-dependencies-mean)
- specify dependencies using [pinned version constraints](https://fsprojects.github.io/Paket/nuget-dependencies.html#Pinned-version-constraint) [^2]
- if using Docker, build from standard base images [^3]

## Conclusion

Reproducibility is relatively easy with modern software development tools. The crux of the problem is giving future developers the ability to:
1. easily recreate the initial development environment across multiple platforms/architectures 
2. continue to make changes to the code that does not break this process

In the next few posts I will describe the current (circa 2022) best practices for reproducibility and demonstrate how to apply them to an existing code base.

#### Footnotes

[^1]: Microsoft patches .NET LTS releases for 3 years while current releases are only patched for 18 months.

[^2]: While it may seem counterintuitive to limit the available versions of your dependencies, it improves control over the automatic dependency resolver. This is in line with the continuously reproducible mindset and future developers are always free to update the version if they encounter a conflict. 

[^3]: Docker terms of service include a 6 month image retention limit on inactive images for free accounts

<!--

1. Intro
  - need for reproducibility
  - in science
  - in software
  - in machine learning

2. Basic tools
  - Docker (links to learning resources)
  - Gitlab/Github 
  - CI/CD
  - permissive licensing

3. Producing reporducible builds
  - choice of baseline (LTS)
  - provide multiple options (multiple-platforms)
    - local install w/ ci/cd
    - docker-compose local (build)
  - push build complexity to lowest level

4. CI/CD
  - Gitlab runner w/ docker
  - (optional) docker registry

5. Publishing
  - code should be publish to allow someone (most likely yourself) to reproduce it
  - but it shouldnt be required; also provide standalone executables

-->



<!--
https://www.nature.com/articles/s41562-016-0021


The problem
A hallmark of scientific creativity is the ability to see novel and unexpected patterns in data. John Snow's identification of links between cholera and water supply17, Paul Broca's work on language lateralization18 and Jocelyn Bell Burnell's discovery of pulsars19 are examples of breakthroughs achieved by interpreting observations in a new way. However, a major challenge for scientists is to be open to new and important insights while simultaneously avoiding being misled by our tendency to see structure in randomness. The combination of apophenia (the tendency to see patterns in random data), confirmation bias (the tendency to focus on evidence that is in line with our expectations or favoured explanation) and hindsight bias (the tendency to see an event as having been predictable only after it has occurred) can easily lead us to false conclusions20. Thomas Levenson documents the example of astronomers who became convinced they had seen the fictitious planet Vulcan because their contemporary theories predicted its existence21. Experimenter effects are an example of this kind of bias22.

Over-interpretation of noise is facilitated by the extent to which data analysis is rapid, flexible and automated23. In a high-dimensional dataset, there may be hundreds or thousands of reasonable alternative approaches to analysing the same data24,25. For example, in a systematic review of functional magnetic resonance imaging (fMRI) studies, Carp showed that there were almost as many unique analytical pipelines as there were studies26. If several thousand potential analytical pipelines can be applied to high-dimensional data, the generation of false-positive findings is highly likely. For example, applying almost 7,000 analytical pipelines to a single fMRI dataset resulted in over 90% of brain voxels showing significant activation in at least one analysis27.

During data analysis it can be difficult for researchers to recognize P-hacking28 or data dredging because confirmation and hindsight biases can encourage the acceptance of outcomes that fit expectations or desires as appropriate, and the rejection of outcomes that do not as the result of suboptimal designs or analyses. Hypotheses may emerge that fit the data and are then reported without indication or recognition of their post hoc origin7. This, unfortunately, is not scientific discovery, but self-deception29. Uncontrolled, it can dramatically increase the false discovery rate. We need measures to counter the natural tendency of enthusiastic scientists who are motivated by discovery to see patterns in noise.


-->