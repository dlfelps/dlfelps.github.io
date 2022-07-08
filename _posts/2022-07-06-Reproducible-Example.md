---
title: Experiment 04
tags: reproducible net docker ci/cd
---

In the final post of the series I give a practical example of how to incorporate continuously reproducible strategies into your workflow.

## Introduction

In the [first post]({% link _posts/2022-06-20-Reproducible-Dotnet-Series.md %}) in this [series]({% link tags/reproducible/index.html %}) I described the characteristics of reproducible code. In the [second post]({% link _posts/2022-06-25-Reproducible-Foundations.md %}) I described the foundational tools that I use in my approach to creating continuously reproducible code. This final post incorporates the approach into an existing repository.

## Example

I selected [FsHttp](https://github.com/fsprojects/FsHttp) as a demonstration codebase. FsHttp follows many recommendations of the continuously reproducible mindset (i.e. LTS releases, pinned dependencies), but it lacks continuous integration. I will show two different ways to adopt it.

## Approach #1 (.NET variant)

The preferred way for .NET projects is to use .NET directly to verify the build. I forked the FsHttp repo and removed some parts that were unnecessary to this blog post. You can find that fork [here](https://github.com/dlfelps/FsHttp-dotnet).

Since the repository is already on Github I will use Github Actions to implement continuous integration. If you use another continuous integration platform you will have to translate this example into that platform's workflow syntax.

Adding continuous integration is as easy as creating the `.github\workflows` folder at the base of the repository and then adding the workflow YAML file, which I named [dotnet.yml](https://github.com/dlfelps/FsHttp-dotnet/blob/main/.github/workflows/dotnet.yml) to that folder. Here are the contents of that file:

{% highlight yaml linenos %}
name: Dotnet CI

on:
  workflow_dispatch:
  push:
    branches: [ main ]
  
jobs:     
  build:
    runs-on: ubuntu-20.04

    steps:
    - name: Checkout main
      uses: actions/checkout@v3

    - name: Setup .NET
      uses: actions/setup-dotnet@v2
      with:
        dotnet-version: 6.0.301

    - name: Restore dependencies
      run: dotnet restore

    - name: Build
      run: dotnet build --no-restore

    - name: Test
      run: dotnet test --verbosity normal
{% endhighlight %}

Now let's breakdown each step.

{% highlight yaml %}
name: Dotnet CI
on:
  workflow_dispatch:
  push:
    branches: [ main ]  
{% endhighlight %}

The `name` keyword allows you to name the workflow - workflows will be grouped by name under the projects Action tab. The `on` keyword allows you to specify the conditions for which this workflow executes - here I only execute the workflow when I push to the `main` branch.

{% highlight yaml %}
jobs:     
  build:
    runs-on: ubuntu-20.04

{% endhighlight %}

The next block defines the sequence of `jobs` to execute when the workflow conditions are met. In this workflow I have only one job named `build` (define additional jobs at the same indentation level as `build`). The `runs-on` keyword selects the type of machine to run the job on; other options include `windows-2022` and `macos-11`. The full list of available options is [here](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idruns-on). *NOTE*: prefer `ubuntu-20.04` to `ubuntu-latest` even though they are currently equivalent; `ubuntu-latest` will eventually point to `ubuntu-22.04` so it is better to pin the dependency now.

{% highlight yaml  %}
    steps:
    - name: Checkout main
      uses: actions/checkout@v3
{% endhighlight %}

Each job consists of several `steps`; each step includes an optional name and then an action. The first step `uses` a Github Action to check out the `main` branch. There are several [official Github actions](https://github.com/orgs/actions/repositories) and also over 14,000 user contributed actions available through the [Github Marketplace](https://github.com/marketplace?type=actions). I tend to stick to the official actions since there are potentially some [security concerns](https://www.youtube.com/watch?v=bDG40Y1nPEk) when using them. Also notice the `@v3` appended to the end of the `actions/checkout` action - this pins the version of the action.

{% highlight yaml  %}
    - name: Setup .NET
      uses: actions/setup-dotnet@v2
      with:
        dotnet-version: 6.0.301
{% endhighlight %}

The next step users another official action to install .NET 6. This action is actually redundant since the `ubuntu-20.04` runner actually comes [pre-installed](https://github.com/actions/virtual-environments/blob/main/images/linux/Ubuntu2004-Readme.md) with lots of useful software including .NET 6. However, I chose to add this step since this was an explicit dependency that the build relies upon. I can't be sure that Github will always include it with the runner, so I want to explicitly install it. 

{% highlight yaml  %}
    - name: Restore dependencies
      run: dotnet restore

    - name: Build
      run: dotnet build --no-restore

    - name: Test
      run: dotnet test --verbosity normal
{% endhighlight %}

The final three steps restore the project's dependencies, build, and test the project.

### Visualizing the workflow

If you push this workflow file to the repo's `main` branch it will execute for the first time. You can watch its progress by clicking on the `Actions` button from the repository's main page. Then click on the most recent run, which will have the same name as the message of the most recent commit.

![Github Actions screenshot #1](/assets/images/workflow1.png "Github Actions screenshot #1")

Then you can visualize the jobs contained within the workflow (there was only a single job named `build` in `dotnet.yml`). Clicking the `build` box will provide details of each step.

![Github Actions screenshot #2](/assets/images/workflow2.png "Github Actions screenshot #2")

Here we see the names given to each of the steps along with some automatic setup and teardown steps.

![Github Actions screenshot #3](/assets/images/workflow3.png "Github Actions screenshot #3")

### Results

In the [previous post]({% link _posts/2022-06-25-Reproducible-Foundations.md %}) we defined the following criteria for reproducible software:

> 1. Build from any platform **with the help of one pre-installed dependency**
> 2. Satisfy #1 in a standard and lightweight way across codebases

Did we satisfy them? Adding a Github workflow is certainly lightweight and repeatable since it will work for most .NET projects with little modification. But we didn't explicity verify the first criteria since we only tested from Ubuntu. If you want to explicitly test additional platforms then I would recommend defining additional jobs that build in different environments:

{% highlight yaml %}
jobs:     
  build-linux:
    runs-on: ubuntu-20.04
    # steps...
  
  build-windows:
    runs-on: windows-2022
    # steps...

  build-macos:
    runs-on: macos-11
    # steps...

{% endhighlight %}

But since I assume that .NET 6 is installed on the host platform I don't really need to test the other operating systems - if it compiles on one platform it will compile on the others because .NET compiles to Common Intermediate Language. The runtimes for each platform differ, but that is an isolated component that I don't feel the need to verify. I think this is a big win for Microsoft and one of the reasons that I ❤️ .NET!

## Approach #2 (Not .NET variant)

How difficult is it to translate Approach #1 into another language? I was able to convert a popular Golang repo in about 5 minutes. You will notice the similarities in the workflow; the full repo is [here](https://github.com/dlfelps/cobra-go).

{% highlight yaml linenos %}
name: Go CI

on:
  workflow_dispatch:
  push:
    branches: [ main ]
  
jobs:     
  build-linux:
    runs-on: ubuntu-20.04

    steps:
    - name: Checkout commit
      uses: actions/checkout@v3

    - name: Setup Go
      uses: actions/setup-go@v3
      with:
        go-version: 1.18

    - name: Build
      run: go build

    - name: Test
      run: go test .

  build-macos:
    runs-on: macos-11
    # steps...

  build-windows:
    runs-on: windows-2022
    # steps...

{% endhighlight %}

### Results

This variant also meets the necessary criteria with one gotcha - since Golang compiles directly to machine code you need to add additional build jobs to test other platforms. Definitely still doable since Github also includes Golang in its machine images.

## Approach #3 (Docker variant)

*Basic knowledge of Docker required to follow this tutorial.*

I know a lot of developers that really love Docker and they use it for everything. I use Docker to deploy services, but not for my development environment. It tends to add an extra step that I don't really want while I am coding. But I also don't tend to work on multiple projects simultaneously (each using a different version of something). Still, its simple enough to integrate Docker into the continuous integration workflow. If I was required to build a Docker image for a project then this is probably how I would do it (rather than building it locally). Here is the full [repo](https://github.com/dlfelps/FsHttp-dotnet) and here are the contents of its workflow YAML:

{% highlight yaml linenos %}
name: Docker Image CI

on:
  push:
    branches: [ main ]

jobs:

  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout commit
      uses: actions/checkout@v3

    - name: Build the Docker image
      run: docker build . --file Dockerfile --tag fshttp:$(date +%s)
{% endhighlight %}

The workflow only includes two steps - one to checkout the `main` branch and another to build the `Dockerfile`. The remaining steps are now inside the `Dockerfile`:

{% highlight docker linenos %}
FROM mcr.microsoft.com/dotnet/sdk:6.0
WORKDIR /app

COPY . ./
RUN dotnet restore 
RUN dotnet build --no-restore
RUN dotnet test --verbosity normal
{% endhighlight %}

The Dockerfile uses the standard .NET 6 baseimage provided by Microsoft, copies the new commit into the /app folder, and then restore/build/test.

### Results

This variant is still lightweight, but we must look closely to see if it is truly cross-platform. We have changed our dependency assumption from .NET to Docker - any platform that can run Docker can build this code. If this is a .NET project then any code that successfully compiles to the Common Intermediate Language and passes the test suite will work on any platform (.NET for the win)! But what if its a Golang project? In that case we would need a separate job and Dockerfile for each platform. But there is no such thing as a macOS Docker image! In conclusion, Approach #3 meets the reproducibility criteria for all .NET projects, but not *all* projects.

## Conclusion

If I did not address your specific use case, please feel free to consult the [Github Actions docs](https://docs.github.com/en/actions/using-workflows/about-workflows) for more information. Finally, thanks for reading this series on continuously reproducible code and I hope I have helped you develop a more continuously reproducible mindset! As always, your feedback is appreciated!


