import React from 'react';
import SimpleHeader from '../../components/SimpleHeader';
import Frame from '../../components/Frame';
import TextBlock from '../../components/TextBlock';

const JosoorExploreSystemsPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <SimpleHeader logoSrc="/images/josoorlogo.png" logoAlt="Josoor" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold text-gray-900 text-center my-5 py-5">eXplore: The System of Systems</h1>
            <Frame layout="vertical" gap="4" justify="start" align="stretch" padding="8" width="full" bgColor="white" border="true" shadow="xl" className="rounded pt-0">
                <div className="pb-8 px-4 max-w-full mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 my-4">Multi-Modular Mini Twins  </h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line self-stretch py-5">
                        <span style={{ fontSize: 'medium' }}>
                            DT Design followed a bottom up approach creating mini-DTs of the components of the main DT due to the variety of these elements, their attributes and behavior Along the process, three design principles were applied strictly to ensure an Enterprise Grade system trusted at the government level:
                        </span>
                        <span style={{ fontWeight: 'bolder', fontSize: 'medium' }}>
                            1- Context and Data go hand in hand.{' '}
                        </span>
                        <span style={{ fontSize: 'medium' }}>
                            Jointly, the Database was designed to tell the Context of the transformation through the relations and flow. Thus, making the database intuitive to understand and impossible to ignore.
                        </span>
                        <span style={{ fontWeight: 'bolder', fontSize: 'medium' }}>
                            2- Real-time integration with backend systems:{' '}
                        </span>
                        <span style={{ fontSize: 'medium' }}>
                            project, HR, and IT systems—feeding live operational data, risks, and progress.
                        </span>
                        <span style={{ fontWeight: 'bolder', fontSize: 'medium' }}>
                            3- A variety of AI-powered interfaces{' '}
                        </span>
                        <span style={{ fontSize: 'medium' }}>
                            for chat, reporting, and simulation—making the entire organization navigable and transparent in real time.
                        </span>
                        Jointly, the Database was designed to tell the Context of the transformation through the relations and flow. Thus, making the database AI-intuitive to understand and impossible to ignore.
                    </p>
                    <img
                        loading="lazy"
                        srcSet="https://cdn.builder.io/api/v1/image/assets%2Fdcb6338cd56942dd9d0d7f3bbd865659%2Ff86f1e1e40fb43e0b8ef52e3ef32735d?width=100 100w, https://cdn.builder.io/api/v1/image/assets%2Fdcb6338cd56942dd9d0d7f3bbd865659%2Ff86f1e1e40fb43e0b8ef52e3ef32735d?width=200 200w, https://cdn.builder.io/api/v1/image/assets%2Fdcb6338cd56942dd9d0d7f3bbd865659%2Ff86f1e1e40fb43e0b8ef52e3ef32735d?width=400 400w, https://cdn.builder.io/api/v1/image/assets%2Fdcb6338cd56942dd9d0d7f3bbd865659%2Ff86f1e1e40fb43e0b8ef52e3ef32735d?width=800 800w, https://cdn.builder.io/api/v1/image/assets%2Fdcb6338cd56942dd9d0d7f3bbd865659%2Ff86f1e1e40fb43e0b8ef52e3ef32735d?width=1200 1200w, https://cdn.builder.io/api/v1/image/assets%2Fdcb6338cd56942dd9d0d7f3bbd865659%2Ff86f1e1e40fb43e0b8ef52e3ef32735d?width=1600 1600w, https://cdn.builder.io/api/v1/image/assets%2Fdcb6338cd56942dd9d0d7f3bbd865659%2Ff86f1e1e40fb43e0b8ef52e3ef32735d?width=2000 2000w, https://cdn.builder.io/api/v1/image/assets%2Fdcb6338cd56942dd9d0d7f3bbd865659%2Ff86f1e1e40fb43e0b8ef52e3ef32735d"
                        src="https://cdn.builder.io/api/v1/image/assets%2Fdcb6338cd56942dd9d0d7f3bbd865659%2Ff86f1e1e40fb43e0b8ef52e3ef32735d"
                        alt="System architecture diagram"
                        className="aspect-[1.78] object-cover object-center w-full mt-5 min-h-[20px] min-w-[20px] overflow-hidden p-5"
                    />
                </div>

                <h2 className="text-3xl font-bold text-gray-900">Digital Twin Definition Language </h2>
                <div className="self-stretch pb-5">
                    <h3 className="text-xl font-bold mb-2">Our Standard for Modeling</h3>
                    <p className="mb-4">
                        DTDL is a simple, JSON-based language for defining the structure, properties, and behaviors of digital twins. It acts like a blueprint, making it easy to create virtual replicas of real-world systems for simulation, monitoring, and optimization.
                    </p>

                    <h3 className="text-xl font-bold mb-2">Adoption and Origin</h3>
                    <p className="mb-4">
                        Released as an open-source standard by Microsoft in 2018 for Azure Digital Twins, DTDL emerged during the 2010s IoT boom to standardize modeling amid growing interoperability needs. It's widely adopted in IoT and manufacturing, with recent boosts like the 2024 Siemens partnership enhancing cross-platform compatibility.
                    </p>

                    <h3 className="text-xl font-bold mb-2">Why Josoor Relies on DTDL</h3>
                    <p className="mb-4">
                        We selected DTDL for its unmatched simplicity and focus on IoT-centric twins, enabling seamless sharing and integration. This aligns perfectly with government digital transformation goals, ensuring efficient strategy execution without unnecessary complexity.
                    </p>

                    <h3 className="text-xl font-bold mb-2">Alternatives and Uniqueness</h3>
                    <p className="mb-4">
                        While options like Asset Administration Shell (AAS) excel in industrial assets and OWL ontologies in semantic applications, DTDL stands out for its accessible, open-source design tailored to broad interoperability.
                    </p>

                    <h3 className="text-xl font-bold mb-2">The Digital Twin Consortium (DTC)</h3>
                    <p className="mb-4">
                        Founded in 2020 by the Object Management Group, DTC unites leaders like Microsoft and Siemens to advance standards and best practices. It's a leading authority—though not the only one, alongside ISO and European initiatives. Explore more at:{' '}
                        <a
                            href="https://www.digitaltwinconsortium.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            https://www.digitaltwinconsortium.org/
                        </a>.
                    </p>
                </div>
            </Frame>
        </div>
    </div>
  );
};

export default JosoorExploreSystemsPage;
