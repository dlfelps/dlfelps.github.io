---
title: Experiment 03
tags: reproducible net docker ci/cd
---

This post describes the approach that I use to make my code reproducible. NOTE: I have only tested this on *smallish* projects and there certainly are other ways to create reproducible software.

## Introduction

The [first post]({% link _posts/2022-06-20-Reproducible-Dotnet-Series.md %}) in this [series]({% link tags/reproducible/index.html %}) described the characteristics of reproducible code. This post describes my approach to meeting the following requirements of reproducible software:

> 1. Build from a clean environment on any platform
> 2. Satisfy #1 in a standard, lightweight, repeatable way across codebases

My initial attempts at satisfying these requirements failed. Custom build tools (i.e. [CAKE](https://cakebuild.net/)/[FAKE](https://fake.build/)) were too cumbersome and assumed .NET was already installed (i.e. not a clean environment). Docker dev environments were a quick way to create one-time reproducible builds, but they also assumed Docker was installed. Installing from a purely clean environment seemed at odds with a lightweight build process. So I amended the requirements slightly:

> 1. Build from any platform **with the help of one pre-installed dependency**
> 2. Satisfy #1 in a standard, lightweight, repeatable way across codebases

This small change was sufficient for me to devise an approach for continuously reproducible code. 

## (My) Continuously reproducible approach

My approach is essentially continuous integration[^1] plus the [continuously reproducible mindset](https://dlfelps.github.io/2022/06/20/Reproducible-Dotnet-Series.html#the-continuously-reproducible-mindset). Continuous integration ensures that the build works now and the continuously reproducible mindset maximizes the chance that it will work even if left dormant for a period of time. I assume that the most recent LTS version of .NET is installed (this is currently .NET 6.0 which can be installed on any major platform); this assumption lets me use .NET to restore dependencies, build, and test the project. For projects outside of .NET, I assume that Docker is installed instead. I provide an example of both of these in the final post.

By following this approach you can verify that your project builds from a (mostly) clean environment and have confidence that it will work continue to work for anyone else for *years* to come. If you have improvements or would like to share a different approach I would love to hear about it!


#### Footnotes
[^1]: Continuous integration is the DevOps practice whereby code changes are regularly merged into a central repository and the entire project is automatically built and tested. Some common platforms for continuous integration are [TeamCity](https://www.jetbrains.com/teamcity/), [Jenkins](https://www.jenkins.io/), [CircleCI](https://circleci.com/), [Github Actions](https://github.com/features/actions), and [Gitlab](https://gitlab.com/). 

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