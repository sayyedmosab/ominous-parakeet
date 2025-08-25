import { CapabilityData, RagStatus } from './components/types';

/*
 * sampleData provides a small set of mock capability information for
 * development and testing.  Each L1 capability contains a handful
 * of L2 and L3 entries with basic RAG statuses and overlay
 * attributes.  When a real Supabase backend is available the
 * application will automatically switch to live data; otherwise
 * this sample will be used.
 */
const sampleData: CapabilityData = [
  {
    id: 'ops-unit',
    name: 'Ops Unit',
    status: RagStatus.Green,
    attributes: {
      staffNeeds: 50,
      itTools: 30,
      processDocumentation: 70,
      teamHealth: 80,
      resistanceLevel: 20,
      budgetAllocated: 200,
      highRisks: 1,
    },
    l2Capabilities: [
      {
        id: 'ops-infra',
        name: 'Infra Team',
        status: RagStatus.Amber,
        attributes: {
          staffNeeds: 60,
          itTools: 40,
          processDocumentation: 50,
          teamHealth: 60,
          resistanceLevel: 30,
          budgetAllocated: 150,
          highRisks: 2,
        },
        l3Capabilities: [
          {
            id: 'ops-infra-1',
            name: 'Networking',
            status: RagStatus.Green,
            attributes: {
              staffNeeds: 45,
              itTools: 55,
              processDocumentation: 80,
              teamHealth: 85,
              resistanceLevel: 15,
              budgetAllocated: 60,
              highRisks: 0,
            },
          },
          {
            id: 'ops-infra-2',
            name: 'Hosting',
            status: RagStatus.Red,
            attributes: {
              staffNeeds: 75,
              itTools: 35,
              processDocumentation: 20,
              teamHealth: 40,
              resistanceLevel: 50,
              budgetAllocated: 90,
              highRisks: 3,
            },
          },
        ],
      },
      {
        id: 'ops-design',
        name: 'Design Team',
        status: RagStatus.Red,
        attributes: {
          staffNeeds: 30,
          itTools: 20,
          processDocumentation: 40,
          teamHealth: 45,
          resistanceLevel: 60,
          budgetAllocated: 80,
          highRisks: 2,
        },
        l3Capabilities: [
          {
            id: 'ops-design-1',
            name: 'UX',
            status: RagStatus.Amber,
            attributes: {
              staffNeeds: 25,
              itTools: 30,
              processDocumentation: 70,
              teamHealth: 55,
              resistanceLevel: 35,
              budgetAllocated: 40,
              highRisks: 1,
            },
          },
          {
            id: 'ops-design-2',
            name: 'UI',
            status: RagStatus.Green,
            attributes: {
              staffNeeds: 20,
              itTools: 25,
              processDocumentation: 65,
              teamHealth: 70,
              resistanceLevel: 20,
              budgetAllocated: 35,
              highRisks: 0,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'arch-team',
    name: 'Arch Team',
    status: RagStatus.Amber,
    attributes: {
      staffNeeds: 40,
      itTools: 60,
      processDocumentation: 50,
      teamHealth: 70,
      resistanceLevel: 25,
      budgetAllocated: 180,
      highRisks: 2,
    },
    l2Capabilities: [
      {
        id: 'arch-web',
        name: 'Web Architecture',
        status: RagStatus.Green,
        attributes: {
          staffNeeds: 35,
          itTools: 65,
          processDocumentation: 55,
          teamHealth: 75,
          resistanceLevel: 20,
          budgetAllocated: 90,
          highRisks: 1,
        },
        l3Capabilities: [
          {
            id: 'arch-web-1',
            name: 'Frontend',
            status: RagStatus.Green,
            attributes: {
              staffNeeds: 40,
              itTools: 70,
              processDocumentation: 60,
              teamHealth: 80,
              resistanceLevel: 20,
              budgetAllocated: 45,
              highRisks: 0,
            },
          },
          {
            id: 'arch-web-2',
            name: 'Backend',
            status: RagStatus.Amber,
            attributes: {
              staffNeeds: 50,
              itTools: 60,
              processDocumentation: 50,
              teamHealth: 60,
              resistanceLevel: 30,
              budgetAllocated: 45,
              highRisks: 1,
            },
          },
        ],
      },
      {
        id: 'arch-security',
        name: 'Security',
        status: RagStatus.Red,
        attributes: {
          staffNeeds: 45,
          itTools: 50,
          processDocumentation: 45,
          teamHealth: 55,
          resistanceLevel: 40,
          budgetAllocated: 60,
          highRisks: 3,
        },
        l3Capabilities: [
          {
            id: 'arch-security-1',
            name: 'Vulnerability Mgmt',
            status: RagStatus.Red,
            attributes: {
              staffNeeds: 55,
              itTools: 45,
              processDocumentation: 35,
              teamHealth: 50,
              resistanceLevel: 45,
              budgetAllocated: 30,
              highRisks: 2,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'data-team',
    name: 'Data Team',
    status: RagStatus.Green,
    attributes: {
      staffNeeds: 55,
      itTools: 65,
      processDocumentation: 60,
      teamHealth: 85,
      resistanceLevel: 15,
      budgetAllocated: 220,
      highRisks: 0,
    },
    l2Capabilities: [
      {
        id: 'data-analytics',
        name: 'Analytics',
        status: RagStatus.Green,
        attributes: {
          staffNeeds: 50,
          itTools: 70,
          processDocumentation: 65,
          teamHealth: 90,
          resistanceLevel: 10,
          budgetAllocated: 110,
          highRisks: 0,
        },
        l3Capabilities: [
          {
            id: 'data-analytics-1',
            name: 'Reporting',
            status: RagStatus.Green,
            attributes: {
              staffNeeds: 45,
              itTools: 75,
              processDocumentation: 70,
              teamHealth: 95,
              resistanceLevel: 5,
              budgetAllocated: 55,
              highRisks: 0,
            },
          },
          {
            id: 'data-analytics-2',
            name: 'ML Ops',
            status: RagStatus.Amber,
            attributes: {
              staffNeeds: 60,
              itTools: 65,
              processDocumentation: 50,
              teamHealth: 80,
              resistanceLevel: 20,
              budgetAllocated: 55,
              highRisks: 1,
            },
          },
        ],
      },
    ],
  },
];

export default sampleData;