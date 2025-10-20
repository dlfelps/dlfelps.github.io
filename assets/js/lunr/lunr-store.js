var store = [{
        "title": "Welcome to my blog!",
        "excerpt":"My goal for this site is to document the “experiments” that I perform while exploring various computer science topics. I hope to include future posts on the following topics:      .NET   domain driven design   software architecture   If you have any suggestions or comments please email me at dlfelps@gmail.com.  ","categories": [],
        "tags": [],
        "url": "/2022/06/04/My-First-Post.html",
        "teaser": null
      },{
        "title": "Experiment 01",
        "excerpt":"This experiment explores various publishing options associated with .NET, including: framework-dependent vs self-contained Windows vs Linux vs OSX and more… Introduction The traditional way to distribute a .NET application is by compiling code (e.g. C#) into bytecode known as CIL. This bytecode can then be run by anyone who has...","categories": [],
        "tags": ["net"],
        "url": "/2022/06/06/DOTNET-Publishing-Options.html",
        "teaser": null
      },{
        "title": "Experiment 02",
        "excerpt":"The next few posts take step back to examine the benefits of creating reproducible software. We will explore: the continuously reproducible mindset (this post) foundational tools for reproducibility (Exp 03) creating a continuously reproducible .NET project (Exp 04) Introduction Scientific experiments must be repeatable and reproducible to be considered scientific....","categories": [],
        "tags": ["reproducible","net"],
        "url": "/2022/06/20/Reproducible-Dotnet-Series.html",
        "teaser": null
      },{
        "title": "Experiment 03",
        "excerpt":"This post describes the approach that I use to make my code reproducible. NOTE: I have only tested this on smallish projects and there certainly are other ways to create reproducible software. Introduction The first post in this series described the characteristics of reproducible code. This post describes my approach...","categories": [],
        "tags": ["reproducible","net","docker","ci/cd"],
        "url": "/2022/06/25/Reproducible-Foundations.html",
        "teaser": null
      },{
        "title": "Experiment 04",
        "excerpt":"In the final post of the series I give a practical example of how to incorporate continuously reproducible strategies into your workflow. Introduction In the first post in this series I described the characteristics of reproducible code. In the second post I described the foundational tools that I use in...","categories": [],
        "tags": ["reproducible","net","docker","ci/cd"],
        "url": "/2022/07/06/Reproducible-Example.html",
        "teaser": null
      },{
        "title": "Experiment 05",
        "excerpt":"When should you store data as a list, sequence, or an array? This post explains why you need all three in F#. Introduction Lists, sequences, and arrays appear interchangeable on the surface - they are all linear collections of elements of the same type. But the architects of F# included...","categories": [],
        "tags": ["net","list","seq","collections"],
        "url": "/2022/09/01/List-vs-Seq.html",
        "teaser": null
      },{
        "title": "Experiment 06",
        "excerpt":"The first post in the domain specific language series explores the basics of domain modeling using record types in F#. Introduction A recent study1 found that programmers who used functional, statically-typed languages often started a programming task by constructing types to model their problem domain. I do too, but it’s...","categories": [],
        "tags": ["net","dsl","ddd"],
        "url": "/2022/10/01/DSL1.html",
        "teaser": null
      },{
        "title": "Experiment 07",
        "excerpt":"The second post in the domain specific language series demonstrates how you can use F# computation expressions to create an embedded language. Introduction Please read the first post in this series before continuing. This post demonstrates how to create a custom computation expression to capture data. You may have already...","categories": [],
        "tags": ["net","dsl","ddd"],
        "url": "/2022/10/02/DSL2.html",
        "teaser": null
      },{
        "title": "Experiment 08",
        "excerpt":"The final post explains how to use an external domain specific language to load records after compile time! Introduction In the previous two posts we explored several ways to model a simple stock trading domain using syntax that is available (or extendable) within F#. This can be described as an...","categories": [],
        "tags": ["net","dsl","ddd"],
        "url": "/2022/10/03/DSL3.html",
        "teaser": null
      },{
        "title": "Experiment 09",
        "excerpt":"This post explores the possibility of using inclusive programming languages, i.e. ones that successfully accommodate functional and object-oriented programming styles in a single codebase. Introduction Python, C++, Java, and C# are 4 out of the top 10 most popular languages on any survey/poll/list, and they have one thing in common...","categories": [],
        "tags": ["inclusive","programming-languages","kotlin","scala","rust","swift","functional","object-oriented"],
        "url": "/2022/11/01/inclusive.html",
        "teaser": null
      },{
        "title": "Experiment 10",
        "excerpt":"Introducing the Quantum Smalltalk series In this series I am going to introduce you to some of my favorite quantum experiments while modeling those experiments in Pharo Smalltalk. We will explore the quantum properties of superposition and entanglement. Our experimental model is rather simple - the optical devices typically used...","categories": [],
        "tags": ["quantum","smalltalk"],
        "url": "/2024/02/01/quantum-smalltalk1.html",
        "teaser": null
      },{
        "title": "Experiment 11",
        "excerpt":"Introduction Experiment 11 introduces the concepts of quantum superposition by making a slight modification to Experiment 10. Experiment #11 Modify the setup from Experiment #10 by removing the block on the lower path. This allows the photon to now take one of four paths: State name Path at BS1 Path...","categories": [],
        "tags": ["quantum","smalltalk"],
        "url": "/2024/03/01/quantum-smalltalk2.html",
        "teaser": null
      },{
        "title": "Experiment 12",
        "excerpt":"Introduction Experiment #12 doesn’t introduce any new concepts, but it prepares us for a surprising result in Experiment #13. Experiment #12 Modify the setup from Experiment #11 by removing the second beamsplitter. This allows the photon to take one of two paths: State name Path at BS1 Detector Probability R...","categories": [],
        "tags": ["quantum","smalltalk"],
        "url": "/2024/04/01/quantum-smalltalk3.html",
        "teaser": null
      },{
        "title": "Experiment 13",
        "excerpt":"Introduction In Experiments #10 and #12 we observed photons acting like particles. In Experiment #11 a photon’s actions could only be explained using wave-like behavior. In 1978, John Wheeler proposed an experiment to test the limits this paradox. He designed the experiment to answer the following questions: Does the photon...","categories": [],
        "tags": ["quantum","smalltalk"],
        "url": "/2024/05/01/quantum-smalltalk4.html",
        "teaser": null
      },{
        "title": "Experiment 14",
        "excerpt":"Introduction Our final post in the Quantum Smalltalk series explores a thought experiment proposed by Avshalom Elitzur and Lev Vaidman to demonstrate an unusual quantum feature - interaction-free measurement. Experiment #14 Elitzur and Vaidman proposed the following thought experiment: You are given 100 EV bombs. Due to a manufacturing problem...","categories": [],
        "tags": ["quantum","smalltalk"],
        "url": "/2024/06/01/quantum-smalltalk5.html",
        "teaser": null
      },{
        "title": "Experiment 15",
        "excerpt":"This post explores DINOv2 - a foundational vision model from FAIR. Introduction Yann LeCun is one of the godfathers of deep learning1. He believes that one of the most critical challenges to solve in the current era is how to give AI systems common sense. Common sense is difficult to...","categories": [],
        "tags": ["vit","computer-vision","image-retrieval","ml-portfolio","self-supervised"],
        "url": "/2024/06/02/VIT-amster.html",
        "teaser": null
      },{
        "title": "Experiment 16",
        "excerpt":"This post explores unique concepts in few-shot learning. Introduction Few-shot learning describes the situation where a classifier must generalize to new classes using only a few examples of each new class. It represents scenarios where data collection (or annotation) is costly for the classes you care about, but you may...","categories": [],
        "tags": ["few-shot","computer-vision","ml-portfolio","meta-learning"],
        "url": "/2024/06/03/few-shot.html",
        "teaser": null
      },{
        "title": "Experiment 17",
        "excerpt":"This post introduces Concept Bottleneck Models - an interpretable approach to machine learning. Introduction to Explainable AI Explainable machine learning models describe how and why a prediction was made. Experts in explainable AI (XAI) make a distinction between interpretabiliy and explainability: source Interpretability is the extraction of relevant sub-symbolic information...","categories": [],
        "tags": ["explainable","interpretable","computer-vision","ml-portfolio"],
        "url": "/2024/06/04/explainable.html",
        "teaser": null
      },{
        "title": "Experiment 18",
        "excerpt":"This post describes simple approaches to attack and defend machine learning models. Introduction to adversarial machine learning Adversarial machine learning refers to a set of techniques that adversaries use to attack machine learning systems. These attacks exploit vulnerabilities in ML models, aiming to manipulate their behavior or compromise their performance....","categories": [],
        "tags": ["adversarial","evasion","computer-vision","ml-portfolio"],
        "url": "/2024/07/01/adversarial.html",
        "teaser": null
      },{
        "title": "Experiment 19",
        "excerpt":"This post describes the stable diffusion architecture for generative AI. Introduction I am going to introduce this post with a real conversation I had with Microsoft’s Copilot: Me: Can you explain Generative AI to me like I am 5 years old? Copilot: Certainly! Imagine you have a magical drawing book....","categories": [],
        "tags": ["generative","stable-diffusion","computer-vision","ml-portfolio"],
        "url": "/2024/08/01/generative.html",
        "teaser": null
      },{
        "title": "Experiment 20",
        "excerpt":"This post describes a command line tool I created that scrapes a website and generates reports. Introduction It is greatly rewarding to build a tool that solves a real problem. The scale of the problem dictates the number of potential users your tool can help. This project solves a small...","categories": [],
        "tags": ["scraper","cli","selenium","httpx","yattag","typer","backend"],
        "url": "/2024/12/01/scraper.html",
        "teaser": null
      },{
        "title": "Experiment 21",
        "excerpt":"This post converts GPS trajectory data into learned embedded features to reveal human mobility patterns, enabling applications in urban planning, personalized services, and behavioral analysis. Introduction Human mobility patterns tell fascinating stories. Where we go, when we travel, and how we move through space reveals insights about urban planning, social...","categories": [],
        "tags": ["claude","gps","mobility"],
        "url": "/2025/08/21/mobility.html",
        "teaser": null
      },{
        "title": "Experiment 22",
        "excerpt":"The blog post introduces CoBAD (Collective Behavior Anomaly Detection), a deep learning approach that detects anomalous group behaviors in human mobility data by analyzing stay points and collective patterns rather than individual trajectories. Introduction: Beyond Individual Anomalies Traditional anomaly detection in human mobility has predominantly focused on identifying individual outliers—detecting...","categories": [],
        "tags": ["claude","gps","mobility","cobad"],
        "url": "/2025/09/01/cobad.html",
        "teaser": null
      },{
        "title": "Experiment 23",
        "excerpt":"The blog post describes a fork of the DE-ViT algorithm that adapts it for few-shot object detection on satellite imagery by using DINOv3 vision transformers pretrained on the SAT-493M dataset, with a target application of detecting objects in the xView dataset. Zero-Shot Object Detection for Overhead Imagery: A DE-ViT Adaptation...","categories": [],
        "tags": ["claude","few-shot","dino","devit"],
        "url": "/2025/10/01/devit.html",
        "teaser": null
      },{
        "title": "Experiment 24",
        "excerpt":"The blog post demonstrates that few-shot LLMs can match 96% of fine-tuned model accuracy on scene graph extraction with 103x faster inference. Comparing Scene Graph Extraction Methods: From Fine-tuned T5 to Few-Shot LLMs Introduction What is Scene Graph Parsing? In computer vision and natural language processing, scene graph parsing is...","categories": [],
        "tags": ["claude","semantic","scene-graph","captioning","langextract","t5","few-shot","llm","gemini"],
        "url": "/2025/11/01/langextract.html",
        "teaser": null
      },{
        "title": "Experiment 25",
        "excerpt":"The blog post describes a reinforcement learning benchmark environment for cloud resource allocation that uses RL algorithms to learn optimal VM scheduling policies. Solving Cloud Resource Allocation with Reinforcement Learning Introduction Cloud computing has revolutionized how we deploy and manage applications, but efficiently allocating resources across virtual machines (VMs) remains...","categories": [],
        "tags": ["claude","cloud-gym","reinforcement-learning","rl","ppo","optimization","policy"],
        "url": "/2025/12/01/cloud-gym.html",
        "teaser": null
      }]
