---
title: Experiment 03
tags: reproducible net docker ci/cd
---

This post introduces the tools that I use to make my code reproducible. NOTE: I have only tested this on *smallish* projects and there certainly are other ways to create reproducible software.

## Introduction

In the [first post]({% link _posts/2022-06-20-Reproducible-Dotnet-Series.md %}) in this [series]({% link tags/reproducible/index.html %}) I described the characteristics of reproducible code. This post describes my approach to meeting the following requirements of reproducible software:

> 1. Build from a clean environment on any platform
> 2. Satisfy #1 in a standard, lightweight, repeatable way across codebases

Most of the techniques will be applicable to other languages

- code hosting
- container technology
- continuous integration / continuous delivery
- non-technical considerations (licensing)

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