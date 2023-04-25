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
   oauth2ClientId: '35PByzct8kDQPZ27dM2932Qe6PP8qG5eHD7wJtaB56J22wn59W8zp2PY2Xzyzk4K',
   oauth2ClientSecret: '6SN9eL2qGEjHr6FKD66NK482omn4eH5T6JJsZyA7WRFo4bnX5aBnrysd3J57z46S',
   oauth2Username: 'dreso-locker-personal-user-api@thing-it.com',
   oauth2Password: 'DR3S0MM3R-P3R50N4L-US3R-ap1',
   apiEndpoint: 'https://sapi.releezme.net',

   scimOauth2Username : 'dreso-locker-personal-user-api@thing-it.com',
   scimOauth2Password: 'DR3S0MM3R-P3R50N4L-US3R-ap1',
   scimEndpoint: '',
   sapiOauth2Username: 'dreso-locker-personal-user-api@thing-it.com',
   sapiOauth2Password: 'DR3S0MM3R-P3R50N4L-US3R-ap1',
   sapiEndpoint: 'https://sapi.releezme.net',
   sapiAdminOauth2Username: 'dreso-locker-personal-user-api@thing-it.com',
   sapiAdminOauth2Password: 'DR3S0MM3R-P3R50N4L-US3R-ap1',
   sapiAdminEndpoint: 'https://sapi.releezme.net',
   synchronizeAllocationsInterval: 30000,
   userGroupId: '',
   contactNumber: '',

   exportFilePath1: './vecos-locker-output-for-documentation.csv',
   exportFilePath2: './vecos-locker-output-for-TIP-import.csv',
};

module.exports = config;
