const urlWithHigherPriority = ['auth/refresh'];

class APILockService {
    locked = false
    lockToken = null
    resolveWaitPromise = null
    
    lock = (lockToken) => {
        if(this.locked){
            // throw new Error('APIService has already been locked.');
            return;
        }
        this.lockToken = lockToken;
        this.locked = true;
    }

    isLocked = (config) => {
        if(urlWithHigherPriority.includes(config.url)) return false;

        if(config.lockToken === this.lockToken){ //We do not want to block the API request which placed the lock in first place
            return false;
        }
        
        return this.locked;
    }

    releaseLock = (lockToken) => {
        if(lockToken === this.lockToken){
            this.locked = false;
            if(this.resolveWaitPromise !== null) {
                this.resolveWaitPromise();
            }
        }
    }

    waitTillUnlocked = () => {
        return new Promise((resolve) => {
            this.resolveWaitPromise = () => {
                resolve();
            }
            setTimeout(() =>{
                this.locked = false;
                resolve();
            }, 150000);// timeout after 2.5 mins
        });
    }
}

const apiServiceInstance = new APILockService();

export default apiServiceInstance;