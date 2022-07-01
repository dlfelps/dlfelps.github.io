---

title: Experiment 01
tags: net
---

This experiment explores various publishing options associated with .NET, including: 
- framework-dependent vs self-contained
- Windows vs Linux vs OSX
- and more...

## Introduction

The traditional way to distribute a .NET application is by compiling code (e.g. C#) into bytecode known as [CIL](https://en.wikipedia.org/wiki/Common_Intermediate_Language). This bytecode can then be run by anyone who has installed the .NET runtime environment (also known as [CLR](https://docs.microsoft.com/en-us/dotnet/standard/clr)). The process is illustrated below:

<p align="center">
  <img width="416" height="480" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Overview_of_the_Common_Language_Infrastructure_2015.svg/416px-Overview_of_the_Common_Language_Infrastructure_2015.svg.png">
</p>

This compilation strategy is known as [dynamic compilation](https://en.wikipedia.org/wiki/Dynamic_compilation) and was popularized by the Java Virtual Machine. Some languages like C++ use static compilers that produce native code for a specific platform directly. This code cannot be shared across platforms, but users also do not need to install a runtime environment. 

Although the .NET runtime is simple to install, some users may still prefer a "standalone" executable that does not require this extra step. Since .NET 3.0 developers have been able to publish their code as "self-contained" - which means that it includes the runtime environment along with their compiled bytecode. The only real downside is that it creates executables that are larger than they would be otherwise.

This study explores the effect of publishing code as "self-contained" across various platforms and the extent to which the size can be reduced through advanced publishing options. 

## Setup

I strive to make all of my experiments reproducible. Please follow the installation instructions below to configure your system to run the experiment.

1. Install [.NET 6.0 SDK](https://dotnet.microsoft.com/en-us/download) (not the Runtime option)
2. Obtain the [WaveFunctionCollapse](https://github.com/dlfelps/WaveFunctionCollapse) repo; you can either:
```
git clone https://github.com/dlfelps/WaveFunctionCollapse.git
```
or [download](https://github.com/dlfelps/WaveFunctionCollapse/archive/refs/heads/master.zip) and unzip

3. Run the provided commands for each experiment (see below)

## Experiment

### Framework-dependent vs self-contained

The first part of the experiment compares two deployment modes. In the framework-dependent distribution mode only the application and third-party assemblies are included; it is assumed that users will have the .NET runtime installed on their system. In the self-contained distribution mode the .NET runtime and runtime libraries included as well. 

Another difference between the two modes is that the framework-dependent mode produces a cross-platform binary, which means it can run on any platform. The self-contained option must be created for a specific platform (in this case we use win-x64 but any valid runtime in the [RID Catalog](https://docs.microsoft.com/en-us/dotnet/core/rid-catalog) may be chosen).

To run this portion of the experiment execute the following commands within your WaveFunctionCollapse folder (I am using Powershell for Windows):

```
dotnet publish -c "exp_1a_framework-dependent"
dotnet publish -c "exp_1a_self-contained" -r win-x64 --self-contained true
```
The published folders can be found at 
```
..\WaveFunctionCollapse\bin\exp_1a_framework-dependent\net6.0\publish\
..\WaveFunctionCollapse\bin\exp_1a_self-contained\net6.0\win-x64\publish
```
Execution of the created application is different in each case. From the framework-dependent publish folder the entrypoint is the cross-platform binary using the dotnet command:

```
dotnet WaveFunctionCollapse.dll
```
From the self-contained publish folder the entrypoint is simply the platform-specific executable (Windows here):
```
./WaveFunctionCollapse.exe
```
We measure the size of the corresponding publish folders to compare the final size of the distributable application in each case. 

|                                      	| size (MB) 	|
|--------------------------------------	|:-----------:	|
| framework-dependent (cross-platform) 	| 1.53      	|
| self-contained (win-x64 only)        	| 68.7      	|

The difference does appear to be approximately the size of a binary installation of .NET 6.0 (for Windows is 68.1 MB). But 68 MB barely registers on a 500 GB hard drive. My bigger concern is that self-contained distributions limit the systems that can use it since they are platform specific. In the next experiment we look at platforms besides Windows. [^1]

### Varying the platform of self-contained releases

In this part of the experiment we determine the extent to which the target platform changes the size of the publish folder. To run this portion of the experiment execute the following commands within your WaveFunctionCollapse folder:

```
dotnet publish -c "exp_1b_linux"  -r linux-x64 --self-contained true
dotnet publish -c "exp_1b_osx_x64"  -r osx-x64 --self-contained true
dotnet publish -c "exp_1b_osx12_arm"  -r osx.12-arm64 --self-contained true
```
I measured the size of the corresponding publish folders and also included the results from the self-contained win-x64 from the previous section. 

|           	| size (MB) 	|
|-----------	|:-----------:	|
| win-x64   	| 68.7      	|
| linux-x64 	| 68.5      	|
| osx-x64   	| 68.5      	|
| osx12-arm  	| 75.0      	|

There is no significant difference between the sizes of these various platforms. They are all approximately the size of the original application code plus the size of the binary installation of .NET 6.0 for the corresponding platform.

### Trimming

 To finish out this experiment I wanted to explore one of the advanced publishing options that dotnet provides - trimming. When you enable trimming the compiler tries to reduce deployment size by including only the minimum  subset of the framework assemblies that are needed to run the application. The unused parts of the framework are trimmed from the packaged application. But there is a risk that the compiler miscalculates which parts are necessary during build time causing a failure at run time. 

 To run this portion of the experiment execute the following commands within your WaveFunctionCollapse folder:

```
dotnet publish -c "exp_1c_windows"  -r win-x64 --self-contained true -p:PublishTrimmed=true
dotnet publish -c "exp_1c_linux"  -r linux-x64 --self-contained true -p:PublishTrimmed=true
dotnet publish -c "exp_1c_osx_x64"  -r osx-x64 --self-contained true -p:PublishTrimmed=true
dotnet publish -c "exp_1c_osx12_arm"  -r osx.12-arm64 --self-contained true -p:PublishTrimmed=true
```

|           	|     original size (MB)     |     reduced size (MB)     |
|--------------	|:-----------------------:	|:----------------------:	|
| win-x64   	| 68.7               	| 22.1              	|
| linux-x64 	| 68.5               	| 23.8              	|
| osx-x64   	| 68.5               	| 22.7              	|
| osx12-arm   	| 75.0               	| 21.9              	|


The results show that the reduced size is about one third of the original size. But the risk that the application *may* fail at runtime does not seem worth the memory savings for most applications. However in this case I was able to verify that the Windows and Linux distributions worked correctly (OSX was not tested).

## Limitations of study

The results shown above represent an experiment for a single code base. You may get different results for your own code (especially when trimming). If you do repeat this study on a different code base I would appreciate it if you would share the results for comparison!

## Conclusion 

.NET makes it amazingly simple to publish code that works on almost any device. In order to share your application with the widest audience I recommend publishing both the framework-dependent and (untrimmed) self-contained versions for all major platforms. I do not generally recommend trimming unless you are able to thoroughly test the created executables.

### References

1. [.NET application publishing overview](https://docs.microsoft.com/en-us/dotnet/core/deploying/)
2. [WaveFunctionCollapse](https://github.com/mxgmn/WaveFunctionCollapse)
3. [CLI](https://en.wikipedia.org/wiki/Common_Language_Infrastructure)

### Footnotes

[^1]: By default the framework-dependent mode creates both a cross-platform binary and a platform-specific executable that targets the current platform. In my case the publish folder included a platform-specific file called WaveFunctionCollapse.exe (since I use Windows). This unnecessary  file was removed before the folder size was measured.