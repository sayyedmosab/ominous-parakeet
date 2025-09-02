import React, { useEffect } from 'react';
import Frame from '../components/Frame';
import Hero from '../components/Hero';
import RubiksIframe from '../components/RubiksIframe';


const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'AI Twin Tech';
  }, []);

  const scrollingSections = [
    {
      title: "Transforming Strategy Execution",
      subtitle: "RETHINK COMPLEXITY, MAKE IT YOUR ASSET.",
      text: "Re-defining how you experience complex transformations. Labels like planning, monitoring, risks, dashboard etc remain the same, everything else changes. Not only from a look and feel, we re-defined what it means, how it is done and its role in an integrated model."
    },
    {
      title: "Imagine a parallel universe where strategy execution finally makes sense.",
      subtitle: "BEYOND THEORY, A WORKING SOLUTION",
      text: "We heard it all: Science fiction, Consultants Jargon, Another framework. Even the \"its farfetched\", \"something for another generation\". Our answer. IT IS A DEVELOPED SOLUTION. Specifically, a Net.js Webapp with a Supabase Database and a tailored Gemini Assistant coupled with a 5 year dataset of an entity's national transformation."
    },
    {
      title: "So, How does that work?",
      subtitle: "ONLY GREAT QUESTIONS UNLOCK GREAT ANSWERS",
      text: "We understand, you have questions and you will get the answers. But before you can receive the answers, you must understand what are the right questions and how they evolved. So keep scrolling and start your initiation journey."
    },
    {
      title: "Your Organization",
      subtitle: "Much like a Rubik's cube",
      text: "Each of its 27 cubes represents a piece of the puzzle. Strategy, Performance, Policies, People, Process, Tools add external like globalization, events etc..all interacting. Transforming means solving the cube and to do that, you need to understand how these different cubes interact together. We had to dismantle and examine its anatomy."
    },
    {
      title: "Hidden Relations Unveiled",
      subtitle: "Relations ran Deeper",
      text: "While deciphering the cubes, and focusing on what role they play, how they interact, their inputs/outputs, a model began to appear. A sketchy pattern that made sense and felt right but remained elusive. We had to go deeper on each one. Every cube had to be dismantled further."
    },
    {
      title: "Where others stop",
      subtitle: "Facing Complexity Head On",
      text: "Two truths became evident. First, the scale of complexity was much more than our highest expectations with layers of dependencies involved. Second, the scarcity in helping resources. Few have gone this deep covering everything holistically. We had to research everywhere and in some cases develop missing gaps. the slow process began, covering them one by one."
    },
    {
      title: "2 years later…",
      subtitle: "Mission Accomplished, Just in Time",
      text: "Finally, all the components where dissected, analyzed and mapped. A twin model that bridged every relation and interaction across a complex web of complex dependencies. Just when AI breakthroughs accelerated, became accessible,and at shockingly affordable costs."
    },
    {
      title: "The future, today",
      subtitle: "Digital Twin Model of an Organization",
      text: "The final element, the heart of the solution was plugged in. Bringing the Digital Twin to life, and bringing hope back to transformations. From here you and us have two paths:"
    }
  ];

  return (
    <div className="bg-transparent">
      {/* Rubiks Animation */}
      <section className="relative z-0">
        <RubiksIframe height="calc(100vh - 5rem)" />
      </section>

    </div>
  );
};

export default HomePage;
