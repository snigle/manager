export const vrackServicesListMocks = [
  {
    checksum: 'd41d8cd98f00b204e9800998ecf8427e',
    createdAt: '2023-03-10T12:00:00Z',
    currentState: {
      displayName: null,
      productStatus: 'DRAFT',
      subnets: [],
      vrackId: null,
      region: 'eu-west-lim',
    },
    currentTasks: [],
    id: 'vrs-ahc-fw4-od1-efq',
    resourceStatus: 'READY',
    targetSpec: {
      displayName: null,
      subnets: [],
    },
    updatedAt: '2023-03-10T12:00:00Z',
    iam: {
      displayName: 'test-qa',
      id: 'f30d4ca1-d183-4484-a408-27b9139dce3d',
      urn: 'urn:v1:eu:resource:vrackServices:vrs-ahc-fw4-od1-efq',
    },
  },
  {
    checksum: '4c5d68ea2231e90db7495406018a0f5e',
    createdAt: '2023-03-10T10:00:00Z',
    currentState: {
      displayName: 'My.vRack.Services',
      productStatus: 'DRAFT',
      subnets: [
        {
          cidr: '10.0.0.0/24',
          displayName: 'My.Subnet',
          serviceEndpoints: [
            {
              endpoints: [
                {
                  description: 'Nominal',
                  ip: '192.168.0.5',
                },
              ],
              managedServiceURN:
                'urn:v1:eu:resource:storageNetApp:examples-00e1-4a3d-ae89-ac145675c8bb',
            },
            {
              endpoints: [
                {
                  description: '',
                  ip: '192.168.0.2',
                },
              ],
              managedServiceURN:
                'urn:v1:eu:resource:storageNetApp:examples-a77c-478e-93ce-06aa94cbd9d1',
            },
          ],
          serviceRange: {
            cidr: '10.0.0.0/29',
            remainingIps: 1,
            reservedIps: 5,
            usedIps: 2,
          },
          vlan: 30,
        },
      ],
      vrackId: null,
      region: 'eu-west-gra',
    },
    currentTasks: [],
    id: 'vrs-ar7-72w-poh-3qe',
    resourceStatus: 'READY',
    targetSpec: {
      subnets: [
        {
          cidr: '192.168.0.0/16',
          displayName: 'My.Subnet',
          serviceEndpoints: [
            {
              endpoints: [
                {
                  description: 'Nominal',
                  ip: '192.168.0.5',
                },
              ],
              managedServiceURN:
                'urn:v1:eu:resource:storageNetApp:examples-00e1-4a3d-ae89-ac145675c8bb',
            },
            {
              endpoints: [
                {
                  description: '',
                  ip: '192.168.0.2',
                },
              ],
              managedServiceURN:
                'urn:v1:eu:resource:storageNetApp:examples-a77c-478e-93ce-06aa94cbd9d1',
            },
          ],
          serviceRange: {
            cidr: '192.168.0.0/29',
          },
          vlan: 30,
        },
      ],
    },
    updatedAt: '2023-03-10T10:10:00Z',
  },
  {
    checksum: 'fdd6a7a50286fd969102e319ef6b8545',
    createdAt: '2023-03-10T07:00:00Z',
    currentState: {
      displayName: 'My-vRack-Services-in-error',
      productStatus: 'DRAFT',
      subnets: [],
      vrackId: null,
      region: 'eu-west-rbx',
    },
    currentTasks: [
      {
        createdAt: '2023-03-10T08:00:00Z',
        id: 'ope-a4i-a5y-dof-pt7',
        link: '/v2/vrackServices/resource/vrs-asp-dtl-lym-wza',
        status: 'ERROR',
        type: 'VrackServicesUpdate',
        progress: [],
      },
    ],
    id: 'vrs-asp-dtl-lym-wza',
    resourceStatus: 'ERROR',
    targetSpec: {
      displayName: 'My-vRack-Services-in-error',
      subnets: [
        {
          cidr: '172.21.0.0/16',
          serviceEndpoints: [],
          serviceRange: {
            cidr: '172.21.0.0/29',
          },
          vlan: null,
        },
      ],
    },
    updatedAt: '2023-03-10T07:10:00Z',
  },
  {
    checksum: '003df9f0d644a36164a7de26ab20bf6c',
    createdAt: '2023-03-10T09:00:00Z',
    currentState: {
      productStatus: 'DRAFT',
      subnets: [],
      vrackId: null,
      region: 'eu-west-rbx',
    },
    currentTasks: [
      {
        id: 'ope-a1k-xn5-4gi-b0j',
        link: '/v2/vrackServices/resource/vrs-ahz-9t0-7lb-b5l',
        status: 'RUNNING',
        type: 'VrackServicesUpdate',
        progress: [],
        createdAt: '2023-03-10T19:10:00Z',
      },
    ],
    id: 'vrs-ahz-9t0-7lb-b5l',
    resourceStatus: 'UPDATING',
    targetSpec: {
      subnets: [
        {
          cidr: '172.21.0.0/16',
          serviceEndpoints: [],
          serviceRange: {
            cidr: '172.21.0.0/29',
          },
          vlan: null,
        },
      ],
    },
    updatedAt: '2023-03-10T09:10:00Z',
  },
  {
    checksum: '003df9f0d644a36164a7de26ab20bf6c',
    createdAt: '2023-03-10T09:00:00Z',
    currentState: {
      productStatus: 'DRAFT',
      subnets: [],
      vrackId: null,
      region: 'eu-west-rbx',
    },
    currentTasks: [],
    id: 'vrs-ahz-9t0-7lb-b5o',
    resourceStatus: 'READY',
    targetSpec: {
      subnets: [],
    },
    updatedAt: '2023-03-10T09:10:00Z',
  },
  {
    checksum: '003df9f0d644a36164a7de26ab20bf6c',
    createdAt: '2023-03-10T09:00:00Z',
    currentState: {
      displayName: 'MyActiveVrackServices',
      productStatus: 'ACTIVE',
      subnets: [],
      vrackId: 'pn-00001',
      region: 'eu-west-rbx',
    },
    currentTasks: [],
    id: 'vrs-ahz-9t0-7lb-b5r',
    resourceStatus: 'READY',
    targetSpec: {
      subnets: [],
    },
    updatedAt: '2023-03-10T09:10:00Z',
    iam: {
      displayName: 'vrs-ahz-9t0-7lb-b5',
      id: 'f30d4ca1-d183-4484-a408-27b9139dce3d',
      urn: 'urn:v1:eu:resource:vrackServices:vrs-ahz-9t0-7lb-b5',
    },
  },
  {
    checksum: '003df9f0d644a36164a7de26ab20bf6c',
    createdAt: '2023-03-10T09:00:00Z',
    currentState: {
      productStatus: 'DISABLED',
      subnets: [],
      vrackId: null,
      region: 'eu-west-rbx',
    },
    currentTasks: [],
    id: 'vrs-ahz-9t0-7lb-b5s',
    resourceStatus: 'READY',
    targetSpec: {
      subnets: [],
    },
    updatedAt: '2023-03-10T09:10:00Z',
  },
  {
    checksum: '003df9f0d644a36164a7de26ab20bf6c',
    createdAt: '2023-03-10T09:00:00Z',
    currentState: {
      productStatus: 'DRAFT',
      subnets: [
        {
          cidr: '192.168.0.0/16',
          displayName: 'My.Subnet',
          serviceEndpoints: [
            {
              endpoints: [
                {
                  description: 'Nominal',
                  ip: '192.168.0.5',
                },
              ],
              managedServiceURN:
                'urn:v1:eu:resource:storageNetApp:examples-00e1-4a3d-ae89-ac145675c8bb',
            },
            {
              endpoints: [
                {
                  description: '',
                  ip: '192.168.0.2',
                },
              ],
              managedServiceURN:
                'urn:v1:eu:resource:storageNetApp:examples-a77c-478e-93ce-06aa94cbd9d1',
            },
          ],
          serviceRange: {
            cidr: '192.168.0.0/29',
          },
          vlan: 30,
        },
      ],
      vrackId: null,
      region: 'eu-west-rbx',
    },
    currentTasks: [
      {
        createdAt: '2023-03-10T08:00:00Z',
        id: 'ope-a4i-a5y-dof-pt7',
        link: '/v2/vrackServices/resource/vrs-asp-dtl-lym-wza',
        status: 'ERROR',
        type: 'VrackServicesUpdate',
        progress: [],
      },
    ],
    id: 'vrs-ahz-9t0-7lb-b5t',
    resourceStatus: 'ERROR',
    targetSpec: {
      subnets: [],
    },
    updatedAt: '2023-03-10T09:10:00Z',
  },
  {
    checksum: '003df9f0d644a36164a7de26ab20bf6c',
    createdAt: '2023-03-10T09:00:00Z',
    currentState: {
      productStatus: 'DRAFT',
      subnets: [],
      vrackId: null,
      region: 'eu-west-rbx',
    },
    currentTasks: [],
    id: 'vrs-ahz-9t0-7lb-b5u',
    resourceStatus: 'READY',
    targetSpec: {
      subnets: [],
    },
    updatedAt: '2023-03-10T09:10:00Z',
  },
  {
    checksum: '003df9f0d644a36164a7de26ab20bf6c',
    createdAt: '2023-03-10T09:00:00Z',
    currentState: {
      productStatus: 'DRAFT',
      subnets: [
        {
          cidr: '192.168.0.0/16',
          displayName: 'My.Subnet',
          serviceEndpoints: [
            {
              endpoints: [
                {
                  description: 'Nominal',
                  ip: '192.168.0.5',
                },
              ],
              managedServiceURN:
                'urn:v1:eu:resource:storageNetApp:examples-00e1-4a3d-ae89-ac145675c8bb',
            },
            {
              endpoints: [
                {
                  description: '',
                  ip: '192.168.0.2',
                },
              ],
              managedServiceURN:
                'urn:v1:eu:resource:storageNetApp:examples-a77c-478e-93ce-06aa94cbd9d1',
            },
          ],
          serviceRange: {
            cidr: '192.168.0.0/29',
          },
          vlan: 30,
        },
      ],
      vrackId: null,
      region: 'eu-west-rbx',
    },
    currentTasks: [],
    id: 'vrs-ahz-9t0-7lb-b5v',
    resourceStatus: 'UPDATING',
    targetSpec: {
      displayName: 'new name',
    },
    updatedAt: '2023-03-10T09:10:00Z',
  },
  {
    checksum: '003df9f0d644a36164a7de26ab20bf6c',
    createdAt: '2023-03-10T09:00:00Z',
    currentState: {
      productStatus: 'DRAFT',
      subnets: [],
      vrackId: null,
      region: 'eu-west-rbx',
    },
    currentTasks: [],
    id: 'vrs-ahz-9t0-7lb-b5x',
    resourceStatus: 'READY',
    targetSpec: {
      subnets: [],
    },
    updatedAt: '2023-03-10T09:10:00Z',
  },
  {
    checksum: '003df9f0d644a36164a7de26ab20bf6c',
    createdAt: '2023-03-10T09:00:00Z',
    currentState: {
      productStatus: 'DRAFT',
      subnets: [
        {
          cidr: '192.168.0.0/16',
          displayName: 'My.Subnet',
          serviceEndpoints: [
            {
              endpoints: [
                {
                  description: 'Nominal',
                  ip: '192.168.0.5',
                },
              ],
              managedServiceURN:
                'urn:v1:eu:resource:storageNetApp:examples-00e1-4a3d-ae89-ac145675c8bb',
            },
            {
              endpoints: [
                {
                  description: '',
                  ip: '192.168.0.2',
                },
              ],
              managedServiceURN:
                'urn:v1:eu:resource:storageNetApp:examples-a77c-478e-93ce-06aa94cbd9d1',
            },
          ],
          serviceRange: {
            cidr: '192.168.0.0/29',
          },
          vlan: 30,
        },
      ],
      vrackId: null,
      region: 'eu-west-rbx',
    },
    currentTasks: [],
    id: 'vrs-ahz-9t0-7la-b5o',
    resourceStatus: 'DELETING',
    targetSpec: {},
    updatedAt: '2023-03-10T09:10:00Z',
  },
  {
    checksum: '003df9f0d644a36164a7de26ab20bf6c',
    createdAt: '2023-03-10T09:00:00Z',
    currentState: {
      productStatus: 'DRAFT',
      subnets: [],
      vrackId: null,
      region: 'eu-west-rbx',
    },
    currentTasks: [],
    id: 'vrs-ahz-9t0-7lc-b5o',
    resourceStatus: 'READY',
    targetSpec: {
      subnets: [],
    },
    updatedAt: '2023-03-10T09:10:00Z',
  },
  {
    checksum: '003df9f0d644a36164a7de26ab20bf6c',
    createdAt: '2023-03-10T09:00:00Z',
    currentState: {
      productStatus: 'DRAFT',
      subnets: [],
      vrackId: null,
      region: 'eu-west-rbx',
    },
    currentTasks: [],
    id: 'vrs-ahz-9t0-7ld-b5o',
    resourceStatus: 'READY',
    targetSpec: {
      subnets: [],
    },
    updatedAt: '2023-03-10T09:10:00Z',
  },
  {
    checksum: '003df9f0d644a36164a7de26ab20bf6c',
    createdAt: '2023-03-10T09:00:00Z',
    currentState: {
      productStatus: 'DRAFT',
      subnets: [],
      vrackId: null,
      region: 'eu-west-rbx',
    },
    currentTasks: [],
    id: 'vrs-ahz-9t0-7le-b5o',
    resourceStatus: 'READY',
    targetSpec: {
      subnets: [],
    },
    updatedAt: '2023-03-10T09:10:00Z',
  },
  {
    checksum: '003df9f0d644a36164a7de26ab20bf6c',
    createdAt: '2023-03-10T09:00:00Z',
    currentState: {
      productStatus: 'DRAFT',
      subnets: [],
      vrackId: null,
      region: 'eu-west-rbx',
    },
    currentTasks: [],
    id: 'vrs-ahz-9t0-7lf-b5o',
    resourceStatus: 'DELETING',
    targetSpec: {
      subnets: [],
    },
    updatedAt: '2023-03-10T09:10:00Z',
  },
  {
    checksum: '003df9f0d644a36164a7de26ab20bf6c',
    createdAt: '2023-03-10T09:00:00Z',
    currentState: {
      productStatus: 'DRAFT',
      subnets: [],
      vrackId: null,
      region: 'eu-west-rbx',
    },
    currentTasks: [],
    id: 'vrs-ahz-9t0-7lg-b5o',
    resourceStatus: 'READY',
    targetSpec: {
      subnets: [],
    },
    updatedAt: '2023-03-10T09:10:00Z',
  },
  {
    checksum: '003df9f0d644a36164a7de26ab20bf6c',
    createdAt: '2023-03-10T09:00:00Z',
    currentState: {
      productStatus: 'DRAFT',
      subnets: [],
      vrackId: null,
      region: 'eu-west-rbx',
    },
    currentTasks: [],
    id: 'vrs-ahz-9t0-7lh-b5o',
    resourceStatus: 'READY',
    targetSpec: {
      subnets: [],
    },
    updatedAt: '2023-03-10T09:10:00Z',
  },
  {
    checksum: '003df9f0d644a36164a7de26ab20bf6c',
    createdAt: '2023-03-10T09:00:00Z',
    currentState: {
      productStatus: 'DRAFT',
      subnets: [],
      vrackId: null,
      region: 'eu-west-rbx',
    },
    currentTasks: [],
    id: 'vrs-ahz-9t0-7li-b5o',
    resourceStatus: 'READY',
    targetSpec: {
      subnets: [],
    },
    updatedAt: '2023-03-10T09:10:00Z',
  },
  {
    checksum: '003df9f0d644a36164a7de26ab20bf6c',
    createdAt: '2023-03-10T09:00:00Z',
    currentState: {
      productStatus: 'DRAFT',
      subnets: [],
      vrackId: null,
      region: 'eu-west-rbx',
    },
    currentTasks: [],
    id: 'vrs-ahz-9t0-7lj-b5o',
    resourceStatus: 'READY',
    targetSpec: {
      subnets: [],
    },
    updatedAt: '2023-03-10T09:10:00Z',
  },
  {
    checksum: 'e65fa90ceffa95201a49c29b3c031e11',
    createdAt: '2024-02-27T17:43:15.225504Z',
    currentState: {
      displayName: 'SUB-test',
      productStatus: 'DRAFT',
      region: 'eu-west-lim',
      subnets: [
        {
          cidr: '10.0.0.0/24',
          displayName: null,
          serviceEndpoints: [],
          serviceRange: {
            cidr: '10.0.0.0/29',
            remainingIps: 3,
            reservedIps: 5,
            usedIps: 0,
          },
          vlan: null,
        },
      ],
      vrackId: 'pn-9000030',
    },
    currentTasks: [],
    id: 'vrs-d18-qi7-5lk-is2',
    resourceStatus: 'READY',
    targetSpec: {
      displayName: 'SUB-test',
      subnets: [
        {
          cidr: '10.0.0.0/24',
          displayName: null,
          serviceEndpoints: [],
          serviceRange: {
            cidr: '10.0.0.0/29',
          },
          vlan: null,
        },
      ],
    },
    updatedAt: '2024-03-26T11:37:49.16237Z',
    iam: {
      id: '685fd9e5-7634-450f-b085-81f23a6ee8e2',
      displayName: 'vrs-d18-qi7-5lk-is2',
      urn: 'urn:v1:labeu:resource:vrackServices:vrs-d18-qi7-5lk-is2',
    },
  },
];
