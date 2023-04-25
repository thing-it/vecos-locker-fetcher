const OAuth2 = require('simple-oauth2'), superagent = require('superagent'), superagentPrefix = require('superagent-prefix'), fs = require('fs');

const config = require('./config');

class LockerFetcher {
    constructor() {
        this.apiEndpoint = superagentPrefix(config.sapiAdminEndpoint + '/api');
        this.csv = {
            das: '# Thing-it DAS CSV\n' +
                `# Exported On: ${new Date().toISOString()}\n` +
                '# Customer: Unknown\n' +
                '# Mesh: Unknown\n' +
                '# Gateway: Unknown\n' +
                'deviceId,actorId,sensorId,label,description,logLevel,keywords,group,plugin,ifcProjectGlobalId,siteName,buildingName,floorName,spaceName,xPosition,yPosition,zPosition,inventoryNumber,configuration.oauth2Endpoint,configuration.oauth2ClientId,configuration.oauth2ClientSecret,configuration.scimOauth2Username,configuration.scimOauth2Password,configuration.scimEndpoint,configuration.sapiOauth2Username,configuration.sapiOauth2Password,configuration.sapiEndpoint,configuration.sapiAdminOauth2Username,configuration.sapiAdminOauth2Password,configuration.sapiAdminEndpoint,configuration.peerUserPollingInterval,configuration.synchronization,configuration.patchUsersExternalId,configuration.sectionUuid,configuration.contactNumber,configuration.synchronizeAllocations,configuration.allocationSynchronizationInterval,configuration.lockerBankUuid,configuration.lockerUuid,configuration.category,configuration.expiration,configuration.openTime,delete,assetAction\n',
            asset: '# Thing-it Asset CSV\n' +
                `# Exported On: ${new Date().toISOString()}\n` +
                '# Customer: QA Lab (5f48d2846cc323e3c91040e7)\n' +
                'externalId,label,uuid,assetClassificationScheme,assetClassificationId,assetClassificationLabel,inventoryNumber,manufacturerName,manufacturerSerialNumber,plugin,imageUrl,ifcProjectGlobalId,siteName,buildingName,floorName,spaceName,xPosition,yPosition,zPosition,keywords,locationCode,createCalendar,calendarBook,calendarManage,calendarView,calendarBookingKeywords,calendarCheckinDisabled,calendarCheckinLocationRequired,calendarManualCheckoutDisabled,calendarAutoCheckout,calendarAutoCheckoutCustomDuration,calendarBookingPeriodGranularity,calendarRestrictBookingPeriodMinimum,calendarBookingPeriodMinimum,calendarRestrictBookingPeriodMaximum,calendarBookingPeriodMaximum,calendarRestrictMaximumTimeInAdvance,calendarMaximumTimeInAdvance,calendarRestrictReleaseTime,calendarReleaseTimeRestriction,calendarReleaseTimeWeekday,calendarReleaseTimeTime,calendarEnableBusinessHours,calendarBusinessHours_start_hour,calendarBusinessHours_start_minute,calendarBusinessHours_end_hour,calendarBusinessHours_end_minute,calendarNoParallelBookings,calendarPreNotificationText,calendarCheckoutNotificationText\n'
        };
    }
    async initialize() {
        await this.authorize();
    }
    async start() {
        this.addLine('das', `${config.deviceId},,,${config.deviceId},,${config.logLevel},,,vecos/vecos,,,,,,,,,,${config.oauth2Endpoint},${config.oauth2ClientId},${config.oauth2ClientSecret},${config.scimUsername},${config.scimPassword},${config.scimEndpoint},${config.sapiPersonalLockerUsername},${config.sapiPersonalLockerPassword},${config.sapiPersonalLockerEndpoint},${config.sapiAdminUsername},${config.sapiAdminPassword},${config.sapiAdminEndpoint},${config.peerUserPollingInterval},${config.synchronization},,,,,,,,,ignore`);
        const sections = await this.getSections();
        for (const location of await this.getLocations()) {
            const sectionsOfLocation = sections.filter(section => section.LocationId === location.Id);
            const locationName = `${config.deviceId}_${this.sanitizeName(location.Name)}`;
            for (const section of sectionsOfLocation) {
                const sectionName = `${locationName}_${this.sanitizeName(section.Name)}`;
                console.log(sectionName)
                if (config.synchronization) {
                    this.addLine('das', `${sectionName},,,${sectionName},,${config.logLevel},,${config.deviceId}.${sectionName},vecos/section,,,,,,,,,,,,,,,,,,,,,,,,,${section.Id},${config.contactNumber},,,,,,,,,ignore`);
                }
                const lockerBanks = await this.getLockerBanksOfSection(section.Id);
                for (const lockerBank of lockerBanks) {
                    console.log(lockerBank.Id);
                    const position = config.lockerBankPositions[lockerBank.Id] || config.lockerBankPositions['any'];
                    const entitlements = config.lockerBankCalenderEntitlements[lockerBank.Id] || config.lockerBankCalenderEntitlements['any'];
                    const lockerBankName = `${config.lockerBankPositions[lockerBank.Id]?.label}` || config.lockerBankPositions['any'];//`${sectionName}_${this.sanitizeName(lockerBank.Name)}`;
                    this.addLine('das', `${sectionName}_${this.sanitizeName(lockerBank.Name)},,,${lockerBankName},,${config.logLevel},,${config.deviceId}.${sectionName},vecos/lockerStation,${position.projectUuid},${position.siteName},${position.buildingName},${position.floorName},${position.spaceName},${position.xPosition},${position.yPosition},${position.zPosition},,,,,,,,,,,,,,,,,,,${config.synchronizeAllocations},${config.allocationSynchronizationInterval},${lockerBank.Id},,,,,,update`);
                    const lockers = await this.getAllLockersOfLockerBank(lockerBank.Id);
                    for (const locker of lockers) {
                        const lockerName = `${sectionName}_${this.sanitizeName(lockerBank.Name)}_${locker.DoorNumber}`;
                        this.addLine('das', `${sectionName}_${this.sanitizeName(lockerBank.Name)},${lockerName},,${locker.FullDoorNumber},,${config.logLevel},,,vecos/locker,${position.projectUuid},${position.siteName},${position.buildingName},${position.floorName},${position.spaceName},${position.xPosition},${position.yPosition},${position.zPosition},${lockerName},,,,,,,,,,,,,,,,,,,,,${locker.Id},S,${config.expiration},${config.openTime},,update`);
                        this.addLine('asset', `,${locker.FullDoorNumber},,din276,,,${lockerName},,,vecos/locker,,${position.projectUuid},${position.siteName},${position.buildingName},${position.floorName},${position.spaceName},${position.xPosition},${position.yPosition},${position.zPosition},,,true,"${entitlements.book.join(',')}","${entitlements.manage.join(',')}","${entitlements.view.join(',')}",,,,,custom,5,,,,,,,,,,,,,,,,,true,,`);
                    }
                }
            }
        }
        this.save();
    }
    async authorize() {
        const credentials = {
            client: {
                id: config.oauth2ClientId,
                secret: config.oauth2ClientSecret
            },
            auth: {
                tokenHost: config.oauth2Endpoint,
                tokenPath: '/connect/token'
            },
        };
        this.oauth2 = OAuth2.create(credentials);
        const tokenConfig = {
            scope: 'Vecos.Releezme.Web.SAPI offline_access',
            grant_type: 'password',
            username: config.sapiAdminUsername,
            password: config.sapiAdminPassword
        };
        await this.getToken(tokenConfig)
    }
    async getToken(tokenConfig) {
        const httpOptions = {
        };
        const result = await this.oauth2.clientCredentials.getToken(tokenConfig, httpOptions);
        this.accessToken = this.oauth2.accessToken.create(result);
    }
    async getLocations() {
        const response = await superagent
            .get(`/locations`)
            .set('Authorization', 'Bearer ' + this.accessToken.token.access_token)
            .set('accept', 'application/json')
            .use(this.apiEndpoint)
            .ok(res => res.status < 400);
        return response.body.Locations;
    }
    async getSections() {
        const response = await superagent
            .get(`/sections`)
            .set('Authorization', 'Bearer ' + this.accessToken.token.access_token)
            .set('accept', 'application/json')
            .use(this.apiEndpoint)
            .ok(res => res.status < 400);
        return response.body.Sections;
    }
    async getLockerBanksOfSection(sectionUuid) {
        const response = await superagent
            .get(`/sections/${sectionUuid}/lockerbanks`)
            .set('Authorization', 'Bearer ' + this.accessToken.token.access_token)
            .set('accept', 'application/json')
            .use(this.apiEndpoint)
            .ok(res => res.status < 400);
        return response.body.LockerBanks;
    }
    async getLockersOfLockerBank(lockerBankUuid, pageNumber = 1, pageSize = 200) {
        const response = await superagent
            .get(`/lockerbanks/${lockerBankUuid}/lockers`)
            .set('accept', 'application/json')
            .set('Authorization', 'Bearer ' + this.accessToken.token.access_token)
            .query(`pageNumber=${pageNumber}`)
            .query(`pageSize=${pageSize}`)
            .use(this.apiEndpoint)
            .ok(res => res.status < 400);
        return response.body;
    }
    async getAllLockersOfLockerBank(lockerBankUuid) {
        const lockers = [];
        let nextPage = 1;
        while (nextPage !== -1) {
            const response = await this.getLockersOfLockerBank(lockerBankUuid, nextPage);
            lockers.push(...response.Lockers);
            nextPage = response.Paging.HasNextPage ? response.Paging.PageNumber + 1 : -1;
        }
        return lockers;
    }
    addLine(category, string) {
        this.csv[category] += `${string}\n`;
    }
    save() {
        Object.keys(this.csv).forEach(key => fs.writeFileSync(`vecos-${key}-import.csv`, "\uFEFF" + this.csv[key], 'utf8'))
    }
    sanitizeName(name) {
        return name.replace(/ /g, '-').replace(/\./g, '-').replace(/\//g, '-')
    }
}
start().then();
async function start() {
    const lockerFetcher = new LockerFetcher();
    await lockerFetcher.initialize();
    await lockerFetcher.start();
}