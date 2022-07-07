---
title: Experiment 04
tags: reproducible net docker ci/cd
---

In the final post of the series I give a practical example of how to incorporate continuously reproducible strategies into your workflow.

## Introduction

In the [first post]({% link _posts/2022-06-20-Reproducible-Dotnet-Series.md %}) in this [series]({% link tags/reproducible/index.html %}) I described the characteristics of reproducible code. In the [second post]({% link _posts/2022-06-25-Reproducible-Foundations.md %}) I described the foundational tools that I use in my approach to creating continuously reproducible code. This final post incorporates the approach into an existing repository.

## Example

I selected [FsHttp](https://github.com/fsprojects/FsHttp) as a demonstration codebase. FsHttp follows many recommendations of the continuously reproducible mindset (i.e. LTS releases, pinned dependencies), but it lacks continuous integration. I will show two different ways to adopt it.

### Approach #1 (.NET variant)

The preferred way for .NET projects is to use .NET directly to verify the build. I forked the FsHttp repo and removed some parts that were unnecessary to this blog post. You can find that fork [here](https://github.com/dlfelps/FsHttp-dotnet).

Since the repository is already on Github I will use Github Actions to implement continuous integration. If you use another continuous integration platform you will have to translate this example into that platform's workflow sytax.

Adding continuous integration is as easy as creating the `.github\workflows` folder at the base of the repository and then adding the workflow YAML file, which I named [dotnet.yml](https://github.com/dlfelps/FsHttp-dotnet/blob/main/.github/workflows/dotnet.yml) to that folder. Here are the contents of that file:

{% highlight yaml linenos %}
name: Dotnet CI

on:
  workflow_dispatch:
  push:
    branches: [ main ]
  
jobs:     
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout commit
      uses: actions/checkout@v3

    - name: Setup .NET
      uses: actions/setup-dotnet@v2
      with:
        dotnet-version: 6.x

    - name: Restore dependencies
      run: dotnet restore

    - name: Build
      run: dotnet build --no-restore

    - name: Test
      run: dotnet test --verbosity normal
{% endhighlight %}




### Approach #2 (Docker variant)

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