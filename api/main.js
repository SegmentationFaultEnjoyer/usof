require("dotenv").config();

const { runService } = require('./server');
const { initMailGun } = require('./helpers/sendToMail')

const injectViteMiddleWare = require('../vite');
const migrate = require('./assets/migrate');

const myArgs = process.argv.slice(2);

async function main() {
    if (myArgs[0] === 'run') {
        if (myArgs[1] === 'service') {
            try {
                await injectViteMiddleWare();

                if(!Number(process.env.DISABLE_MAILGUN)) initMailGun()
                
                runService()
            } catch (error) {
                console.error('Error occured:', error.message);
                console.log('Trying to restart...');
                setTimeout(() => {
                    runService()
                }, 5000)
                
            }
        }
    }
    
    if(myArgs[0] === 'migrate') {
        await migrate();
    }
}

main();