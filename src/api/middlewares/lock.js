import Mutex from '@/api/mutex';

export async function requestLockMiddleWare(config) {
    if(Mutex.isLocked(config)) {
        await Mutex.waitTillUnlocked();
    }
    
    return config;
}