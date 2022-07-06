---
title: Experiment 04
tags: reproducible net docker ci/cd
---

This post gives a practical example of how to incorporate continuously reproducible strategies into your .NET workflow.

## Introduction

In the [first post]({% link _posts/2022-06-20-Reproducible-Dotnet-Series.md %}) in this [series]({% link tags/reproducible/index.html %}) I described the characteristics of reproducible code. In the [second post]({% link _posts/2022-06-25-Reproducible-Foundations.md %}) I described the foundational tools that I use in my approach to creating continuously reproducible code. This final post incorporates the approach into an existing repository

{% highlight yaml linenos %}
name: Docker Image CI

on:
  push:
    branches: [ main ]

jobs:

  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - name: Build the Docker image
      run: docker build . --file Dockerfile --tag fshttp:$(date +%s)
{% endhighlight %}


{% highlight docker linenos %}
FROM mcr.microsoft.com/dotnet/sdk:6.0
WORKDIR /app

# Copy everything
COPY . ./
# Restore as distinct layers
RUN dotnet restore 
# Build 
RUN dotnet build --no-restore
# test
RUN dotnet test --verbosity normal

{% endhighlight %}

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