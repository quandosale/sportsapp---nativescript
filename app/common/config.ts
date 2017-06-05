export const CONFIG = {
    // SERVER_URL: 'http://192.168.3.4:3002',
    SERVER_URL: 'http://13.112.160.235',
    timeout: 6000,
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
]