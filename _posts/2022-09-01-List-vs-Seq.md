---
title: Experiment 05
tags: net list seq collections
---

When should you store data as a list, sequence, or an array? This post explains why you need all three in F#.

## Introduction

Lists, sequences, and arrays appear interchangeable on the surface - they are all linear collections of elements of the same type. But the architects of F# included all three with good reason. This post explores some of the situations that make each type shine, and dives into the tradeoffs you make when you select one collection over another[^1]. Let's start with Microsoft's official definitions: 

 - [Arrays](https://docs.microsoft.com/en-us/dotnet/fsharp/language-reference/arrays) are fixed-size, zero-based, mutable collections of consecutive data elements that are all of the same type.
 - [Lists](https://docs.microsoft.com/en-us/dotnet/fsharp/language-reference/lists) are ordered, immutable series of elements of the same type.
 - [Sequences](https://docs.microsoft.com/en-us/dotnet/fsharp/language-reference/sequences) are logical series of elements all of one type.
 
Those definitions are certainly similar, but there are some differences. Next we will compare their syntax.

Basic collections can be created as follows:

{% highlight fsharp %}
let list1 = [ 1; 2; 3 ]
let array1 = [| 1; 2; 3 |]
let seq1 = seq { 1; 2; 3 }
{% endhighlight %}


All three collections also support programmatic creation:

{% highlight fsharp %}
let listOfSquares = [ for i in 1 .. 10 -> i * i ]
let arrayOfSquares = [| for i in 1 .. 10 -> i * i |]
let seqOfSquares = seq { for i in 1 .. 10 -> i * i }
{% endhighlight %}


The syntax is well-designed - different, but familiar. Now let's dive into our first scenario.

## Scenario 1 (create new collection)

This is the most basic scenario - creating a collection. We will use the following timing code (across all scenarios) to capture the performance of individual actions. The action is measured multiple times for multiple trials and a confidence interval is reported in milliseconds. 

{% highlight fsharp %}
open FSharp.Stats
open System.Diagnostics

let extractCI (ci:Intervals.Interval<float>) = 
  match ci with 
  | Intervals.ClosedInterval (a,b) -> ((b-a)/2.0+a,(b-a)/2.0)
  | Intervals.Empty -> (-1.0,-1.0)  

let calculateCI (times: int64 array) = 
  times
  |> Array.toSeq
  |> Seq.map (fun x -> float x)
  |> (ConfidenceInterval.ci 0.95)
  |> extractCI

let timeIt numTrials numRuns action =
  
  let times: int64 array = Array.zeroCreate outer

  for o = 0 to (outer-1) do 
    printf "%d\n" o

    let timer = Stopwatch ()
    timer.Start()
    for i = 0 to (inner-1) do
      action () |> ignore
    timer.Stop()

    times[o] <- timer.ElapsedMilliseconds
  calculateCI times

{% endhighlight %}


Next we list the code to create the collections and calculate performance. The `timeIt` command takes three parameters: number of trials (10), number of runs per trial (1000), and a function with signature `unit -> collectionType<T>` (e.g. createList has signature `unit -> list<int>`).

{% highlight fsharp %}
let createList ()  = [ for i in 0 .. 1000 -> i % 10 ]
let createSeq ()  = seq { for i in 0 .. 1000 -> i % 10 }
let createArray ()  = [| for i in 0 .. 1000 -> i % 10 |]

let listCI = timeIt 10 1000 createList
let seqCI = timeIt 10 1000 createSeq
let arrayCI = timeIt 10 1000 createArray
{% endhighlight %}

And the results:

{% include result1.html %}

Arrays were created marginally faster than lists, but it appears that sequences were created almost instantaneously. Well that isn't 100% true - sequences are [lazy](https://docs.microsoft.com/en-us/dotnet/fsharp/language-reference/lazy-expressions), which means that they aren't evaluated until they are needed. And since the code never used the sequence it was never actually created. In the next scenario we will *use* the elements. 

## Scenario 2 (sequential access)

This scenario measures the performance of a common use for data structures - sequential access. Sequential access occurs when you access elements in a predetermined, ordered sequence (e.g. iterating through the elements in a `for` loop). 

{% highlight fsharp %}
let sumSequential lst = 
  let mutable sum = 0
  for e in lst do
    sum <- sum + e
  sum

let sumList ()  = [ for i in 0 .. 1000 -> i % 10 ] |> sumSequential
let sumSeq ()  = seq { for i in 0 .. 1000 -> i % 10 } |> sumSequential
let sumArray ()  = [| for i in 0 .. 1000 -> i % 10 |] |> sumSequential

let listCI = timeIt 10 1000 sumList
let seqCI = timeIt 10 1000 sumSeq
let arrayCI = timeIt 10 1000 sumArray
{% endhighlight %}

And the results:

{% include result2.html %}

Sequences had the fastest time, followed by array and list respectively. Given that there are only a few milliseconds between the conditions and each condition includes 1000 repetitions, the difference for a single execution is only a few microseconds - hardly worth optimizing in my opinion.

*NOTE: the times above include the time to create a collection PLUS the time to sum its elements. I included the time to create the collection so that times could be better compared across scenarios; this will be true for all following scenarios.*

## Scenario 3 (random access)

The third scenario measures the performance of a collection with respect to its ability to perform random access (sometimes called direct access). Random access is the ability to access an arbitrary element of a sequence.

![Sequential vs Random access](https://upload.wikimedia.org/wikipedia/commons/a/a7/Random_vs_sequential_access.svg "Sequential vs Random access")

{% highlight fsharp %}
let sumListRandomAccess lst = 
  let mutable sum = 0
  for i in 0 .. 25 do
    sum <- sum + (lst |> List.item (40*i))
  sum

let sumSeqRandomAccess lst = 
  let mutable sum = 0
  for i in 0 .. 25 do
    sum <- sum + (lst |> Seq.item (40*i))
  sum

let sumArrayRandomAccess lst = 
  let mutable sum = 0
  for i in 0 .. 25 do
    sum <- sum + (lst |> Array.item (40*i))
  sum

let sumList ()  = [ for i in 0 .. 1000 -> i % 10 ] |> sumListRandomAccess
let sumSeq ()  = seq { for i in 0 .. 1000 -> i % 10 } |> sumSeqRandomAccess
let sumArray ()  = [| for i in 0 .. 1000 -> i % 10 |] |> sumArrayRandomAccess

let listCI = timeIt 10 1000 sumList
let seqCI = timeIt 10 1000 sumSeq
let arrayCI = timeIt 10 1000 sumArray
{% endhighlight %}

And the results:

{% include result3.html %}

Here we see the main reason to avoid sequences - they have terrible random access times. Arrays are faster than lists, but you must know how many elements they will contain at compile time.

## Scenario 4 (search and count)

In this scenario I implement a common processing task - count the number of occurrences of a target element in a given collection. In the code below, the target element is `5`.

{% highlight fsharp %}
let count5List ()  = [ for i in 0 .. 1000 -> i % 10 ] |> (List.filter (fun elem -> elem = 5)) |> List.length
let count5Seq ()  = seq { for i in 0 .. 1000 -> i % 10 } |> (Seq.filter (fun elem -> elem = 5)) |> Seq.length
let count5Array ()  = [| for i in 0 .. 1000 -> i % 10 |] |> (Array.filter (fun elem -> elem = 5)) |> Array.length

let listCI = timeIt 10 1000 count5List
let seqCI = timeIt 10 1000 count5Seq
let arrayCI = timeIt 10 1000 count5Array
{% endhighlight %}

And the results:

{% include result4.html %}

Similar to the results of [Scenario 2](#scenario-2-sequential-access), the difference here is not really worth optimizing. 

## Scenario 5 (pattern match and recursion)

Pattern matching is one of my favorite pieces of F# syntax. Besides being extremely readable, the F# compiler will ensure that the patterns check all possible cases. When it comes to processing collections, however, you must use lists to enjoy the full power of pattern matching. Lists are also the only collection that can be used with recursive functions. The example below restates the `count5` problem from Scenario 4 using a recursive function with pattern matching.

{% highlight fsharp %}
let rec countMatch target sumSoFar lst  = 
  match lst with
  | [] -> sumSoFar
  | head :: tail -> if head = target then countMatch target (sumSoFar + 1) tail else countMatch target sumSoFar tail


let count5List ()  = [ for i in 0 .. 1000 -> i % 10 ] |> (countMatch 5 0)
{% endhighlight %}

(This function only works for lists and is about 3 times slower than the equivalent function for lists from Scenario 4.)

## Scenario 6 (interoperability) 

In my opinion the final scenario describes the most important criteria for selecting a collection - interoperability. Sequences are represented by the `seq<T>` type, which is an alias for `IEnumerable<T>`. Therefore, any .NET type that implements `IEnumerable<T>` interface can be used as a sequence. I actually used this convenience in [Scenario 2](#scenario-2-sequential-access) to create the `sumSequential` function - its inferred type is `seq<int> -> int`. So you can use `Seq.length` to calculate the number of elements in sequences, lists, or arrays.

{% highlight fsharp %}
let testSeq = seq {1;2;3} |> Seq.length
let testList = [1;2;3] |> Seq.length
let testArray = [|1;2;3|] |> Seq.length
{% endhighlight %}

For this reason, it is recommended to accept sequences in public facing functions (i.e. those that will be imported by other .NET projects). But that doesn't mean you should only use sequences in libraries - if you need to perform pattern matching you can always convert the input sequence to a list[^2]. 

## Conclusion 

I hope that this post has helped you get a better feel for collections in F#. I will end this post with a flowchart that you can use to guide you if you are having trouble.

![Collection flow diagram](/assets/images/mermaid-diagram-2022-09-07-063841.svg "Collection flow diagram")


#### Footnotes

[^1]: F# has specialized collection types that are designed from a functional programming perspective rather than an object-oriented perspective (compare with those found in System.Collections.Generic). 
[^2]: It is always possible to convert to and from any collection type. For example, you can convert a list **to** a sequence using [`List.toSeq`](https://fsharp.github.io/fsharp-core-docs/reference/fsharp-collections-listmodule.html#toSeq). Conversely, you can create a list **from** a sequence using [`List.ofSeq`](https://fsharp.github.io/fsharp-core-docs/reference/fsharp-collections-listmodule.html#ofSeq). 