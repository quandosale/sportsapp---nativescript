export const CONFIG = {
    SERVER_URL: 'http://13.113.160.171',
    timeout: 8000,
    COOKIE_FILE: 'calm_tmp.dat'
};
export const BLEConfig = {
    serviceUUID: "180d",
    characteristicUUID: "2a37",
    serviceUUID_1: "ffe0",        // heart book
    characteristicUUID_1: "ffe2"
}
export const LEVEL = [{
    numberOfPatient: 1,
    // sizeOfStorage: 40000
    sizeOfStorage: 5 * 1024 * 1024 * 1024
},
{
    numberOfPatient: 10,
    sizeOfStorage: 10 * 1024 * 1024 * 1024
},
{
    numberOfPatient: 30,
    sizeOfStorage: 50 * 1024 * 1024 * 1024
},
{
    numberOfPatient: 99999,
    sizeOfStorage: 100 * 1024 * 1024 * 1024
},
];
export const SNS_GOOGLE_serverClientId = "369911498027-hm2orsu1neb2npr58icv3p965edcag2q.apps.googleusercontent.com";