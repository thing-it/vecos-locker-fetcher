'use strict';

const config = {
   meshId: '', //without dashes
   ifcProjectGlobalId: '',
   siteName: '',
   buildingName: '',	
   floorName: '',	
   spaceName: '',

   lockerAdminRoleId: 'lockerAdmin',

   oauth2Endpoint: 'https://identity.releezme.net',
   oauth2ClientId: '',
   oauth2ClientSecret: '',
   oauth2Username: '',
   oauth2Password: '',
   apiEndpoint: 'https://sapi.releezme.net',

   scimOauth2Username : '',
   scimOauth2Password: '',
   scimEndpoint: '',
   sapiOauth2Username: '',
   sapiOauth2Password: '',
   sapiEndpoint: 'https://sapi.releezme.net',
   sapiAdminOauth2Username: '',
   sapiAdminOauth2Password: '',
   sapiAdminEndpoint: 'https://sapi.releezme.net',
   synchronizeAllocationsInterval: 30000,
   userGroupId: '',
   contactNumber: '',

   exportFilePath1: './vecos-locker-output-for-documentation.csv',
   exportFilePath2: './vecos-locker-output-for-TIP-import.csv',
};

module.exports = config;
