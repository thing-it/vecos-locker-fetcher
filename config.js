'use strict';

const config = {
   logLevel: 'debug',

   oauth2Endpoint: 'https://identity.releezme.net',
   oauth2ClientId: '',
   oauth2ClientSecret: '',

   sapiAdminEndpoint: 'https://sapi.releezme.net',
   sapiAdminUsername: '',
   sapiAdminPassword: '',

   // ONlY REQUIRED IF SYNCHRONIZATION ENABLED
   scimEndpoint: 'https://scim.releezme.net',
   scimUsername: '',
   scimPassword: '',

   sapiPersonalLockerEndpoint: 'https://sapi.releezme.net',
   sapiPersonalLockerUsername: '',
   sapiPersonalLockerPassword: '',
   // ONlY REQUIRED IF SYNCHRONIZATION ENABLED

   deviceId: 'VECOS',

   // Synchronize to Vecos - requires SCIM
   synchronization: true,
   // Synchronize vecos allocations to bookings
   synchronizeAllocations: true,
   // milliseconds
   allocationSynchronizationInterval: 600000,

   // milliseconds
   peerUserPollingInterval: 3600000,
   patchUsersExternalId: false,

   // milliseconds
   expiration: 31536000000, //1 year

   // seconds
   openTime: 10,

   contactNumber: '',

   // Enter your locker bank's positioning in the BIM model here. Use the locker bank UUID from Vecos as key!
   lockerBankPositions: {
      '234234-928d-47e3-3423-4008165ebf1d': {
         comment: '06_03-A-01-001-080',
         label: 'Vecos Lockers 06.A.01 (001-080)',
         projectUuid: '2d761818-9147-4319-a4e4-ca33b7c970f6',
         siteName: 'Some Other Campus',
         buildingName: '12',
         floorName: '01',
         spaceName: '12.A.01.955',
         xPosition: 18560,
         yPosition: 32300,
         zPosition: 0
      },
      '23423423-e397-2117-9471-c243aa8f8a40': {
         comment: '12_03-B-01-081-160',
         label: 'Vecos Lockers 12.B.01 (081-160)',
         projectUuid: '123456-9147-4319-3432-ca33b7c970f6',
         siteName: 'Some Campus',
         buildingName: '06',
         floorName: '01',
         spaceName: '06.B.01.938',
         xPosition: 66900,
         yPosition: 32300,
         zPosition: 0
      },
      'any': {
         projectUuid: '7b47ac8b-d329-43f5-8cbf-e0984d16d64b',
         siteName: 'Bad Homburg',
         buildingName: 'Lokschuppen',
         floorName: '1. OG',
         spaceName: '254',
         xPosition: 11200,
         yPosition: 21000,
         zPosition: 3000
      }
   },
   lockerBankCalenderEntitlements: {
      'any': { // locker bank uuid
         view: ["[db0c7aa0-e913-11ea-9fae-69045adf73f6]qaLab:lockerStation/user"],
         book: ["[db0c7aa0-e913-11ea-9fae-69045adf73f6]qaLab:lockerStation/user"],
         manage: ["[db0c7aa0-e913-11ea-9fae-69045adf73f6]qaLab:lockerStation/admin"]
      }
   }
};
module.exports = config;
