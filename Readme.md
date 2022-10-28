# USOF
---

Whole USOF application with frontend and backend as a single app, that is question and answer service with social media interactions.

## Before start preparations

### 1. DataBase
---
    start postgresql server and create empty data base
    
### 2 .Installing dependencies and preparing database
---
	yarn install      
	yarn migrate
### 3. ENV
---
#### Create ***.env*** file with following entries:
	- PORT= #port
	- HOST= #host
	- JWT_TOKEN= #token key
	- JWT_ACCESS_TOKEN_LIFESPAN= #minutes exp: '60 minutes'
	- JWT_REFRESH_TOKEN_LIFESPAN= #hours (not less than 1, not greater than 6) exp: '2 hours'
	- DB_URL= #postgres connection string exp: "postgresql://user:password@localhost:8889/db_name?sslmode=disable"
	- MAILGUN_API_KEY= #your api key for mailgun service
	- MAILGUN_DOMEN= #your mailgun domen
### 4. Starting server
---
	yarn dev #for developing mode
    yarn start #for production