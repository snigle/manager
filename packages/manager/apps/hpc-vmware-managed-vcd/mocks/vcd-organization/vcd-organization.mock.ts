import IVcdOrganization from '../../src/types/vcd-organization.interface';

export const organizationList: IVcdOrganization[] = [
  {
    currentState: {
      apiUrl: 'https://vcd.my.company',
      billingType: 'MONTHLY',
      description: 'Company VCD Organization',
      fullName: 'Company VCD',
      region: 'EU-WEST-GRA',
      name: 'org-eu-west-gra-6cfa2c69-c62c-4853-80ee-c9682e6727f0',
      spla: false,
      webInterfaceUrl: 'https://vcd.my.company',
    },
    currentTasks: [
      {
        id: '1fda9001-a48b-4022-a656-ac295d363470',
        link:
          '/v2/vmwareCloudDirector/organization/6cfa2c69-c62c-4853-80ee-c9682e6727f0/task/1fda9001-a48b-4022-a656-ac295d363470',
        status: 'PENDING',
        type: 'VCD_UPDATE',
      },
    ],
    id: '6cfa2c69-c62c-4853-80ee-c9682e6727f0',
    resourceStatus: 'UPDATING',
    targetSpec: {
      description: 'Company VCD Organization targetSpec',
      fullName: 'Company VCD targetSpec',
    },
    updatedAt: '2024-06-14T09:21:21.943Z',
    iam: {
      id: 'id1',
      urn: 'urn:1',
    },
  },
  {
    currentState: {
      apiUrl: 'https://vcd.my.demo.lab',
      billingType: 'DEMO',
      description: 'My demo VCD Organization',
      fullName: 'Demo VCD',
      region: 'CA-EAST-BHS',
      name: 'org-ca-east-bhs-61ebdcec-0623-4a61-834f-a1719cd475b4',
      spla: true,
      webInterfaceUrl: 'https://vcd.my.second.lab',
    },
    currentTasks: [],
    id: '61ebdcec-0623-4a61-834f-a1719cd475b4',
    resourceStatus: 'READY',
    targetSpec: {
      description: 'My demo VCD Organization targetSpec',
      fullName: 'Demo VCD targetSpec',
    },
    updatedAt: '2024-06-14T09:21:21.943Z',
    iam: {
      id: 'id2',
      urn: 'urn:2',
    },
  },
];
