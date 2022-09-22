import Mutex from "../mutex";

export function onErrorUnlockMiddleware(error) {
    const config = error.config;
    
    if(config.lockToken)
        Mutex.releaseLock(config.lockToken);

    return Promise.reject(new Error(error.message));
}