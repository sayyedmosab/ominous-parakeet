import React, { useEffect } from 'react';

const JosoorVisionPage: React.FC = () => {
  useEffect(() => {
    document.title = 'AI Twin Tech - Josoor Vision';
  }, []);


  return (
    <div className="bg-gray-900">
        <div className="relative rounded-lg overflow-hidden shadow-2xl min-h-[80vh] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed"
                style={{ backgroundImage: `url(/images/think.png)` }}
            ></div>
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative p-8 md:p-12 text-white container mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-electric-blue-400">Founder's Letter: Origins</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    <div className="text-white text-base leading-8 text-left space-y-4 bg-black/30 rounded-lg p-4 md:p-6">
                      <div className="space-y-4">
                        <p>
                          Just over two years ago was my first introduction to GenAI. What started as a basic ask to ChatGPT to design a training program to teach me "AI", continued non-stop over the entire weekend to end with contemplating how unlocking the human potential is not in the pursuit of answers but rather the articulation of the right questions. And from that came the concept of the Living Transformation Network, a semi-sentient network of AIs carrying one mission to improve humanity and life by taking over the complexity of society and daring us to think.
                        </p>
                        <p>
                          <strong>"What do we do with all the spare time we will have?"</strong>
                        </p>
                        <p>
                          That experience changed me forever. I even published the wild interaction in a LinkedIn article, with the aim of helping other skeptics or on the fence seniors to make the jump and embrace AI.
                        </p>
                        <p>
                          Since then, I have been pursuing that specific concept. Which at its core is "how to make transformation management push back and control the complexity beast?" I continued to design the model itself. Yet after six months, even with a sound model that took all the complexity and jammed it into a relational database, <strong>the AI tech was still not there yet</strong>, and a solution then meant investing the old way (licenses, infra., coders etc.).
                        </p>
                      </div>
                    </div>
                    <div className="text-white text-base leading-8 text-left space-y-4 bg-black/30 rounded-lg p-4 md:p-6">
                      <p>
                        So I kept it on a slow burner, refining and tweaking based on real life client setups I encounter.
                      </p>
                      <p>
                        Until a few months back. GenAI started to make significant leaps in capabilities, and the AI development tools and communities advanced with more "no coding" solutions. Suddenly, the fire power needed to navigate the complex maze of relations was not only available, but remarkably affordable. Not only that, but cloud hosting had also a breakthrough with Azure certified by the government after years of a no-cloud hosting policy.
                      </p>
                      <p>
                        <strong>I had no choice, no excuse and no regrets in chasing this dream.</strong>
                      </p>
                      <p>
                        All my career I was a pioneer, but for others' benefit. This was my chance to flip the script and pioneer with no constraints. In fact, part of the fuel behind this was all the bottled up "red-tape" frustration. I am pursuing this all the way Inshallah.
                      </p>
                      <p>
                        I hope once the concept and its national benefis clicks, you will join me in this journey, whether as an Architect or a Builder, so we give it the best chance of success.
                      </p>
                      <p>
                        <strong>CEO/Founder - Mosab Sayyed</strong>
                      </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default JosoorVisionPage;
