import * as platform from 'platform';
export function getMacAddress(): string {
    return platform.device.uuid;
}
