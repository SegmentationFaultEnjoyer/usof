import Mutex from '@/api/mutex';

export async function requestLockMiddleWare(config) {
    // console.log('check if locked', config.url);
    if(Mutex.isLocked(config)) {
        await Mutex.waitTillUnlocked();
    }
    // console.log('not locked', config.url);
    return config;
}