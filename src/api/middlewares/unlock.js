import Mutex from "../mutex";

export function onErrorUnlockMiddleware(error) {
    const config = error.config;
    
    if(config && config.lockToken)
        Mutex.releaseLock(config.lockToken);

    return Promise.reject(error);
}