# USOF
---

Question and answer service with social media interactions.

## About app
---
Whole USOF application with frontend and backend as a single app.

<h3>Technology stack:</h3>
<ul>
	<li><b>Backend</b>: 	<i>NodeJS</i>, <i>Express</i> </li>
	<li><b>Database</b>: 	<i>Postgresql</i> </li>
	<li><b>Frontend</b>: 	<i>React</i>, <i>Redux></i>, <i>SASS</i>, <i>MUI</i> </li>
	<li><b>Bundler</b>: 	<i>Vite</i> </li>
</ul>

<h3>Architecture:<h3>
<ul>
	<li><b>Server-API:</b> 	<i>REST and JSON-API specifications, MVC pattern</i> </li>
	<li><b>Database-API:</b> <i>builder pattern</i> </li>
	<li><b>Styles:</b> <i> BEM specification</i> </li>
	<li><b>Authentication:</b> <i> Access and refresh tokens model with JWT</i> </li>
</ul>

<h3>Features:<h3>
<ul>	
	<li>Authorization, registering, reseting password</li>
	<li>User pages</li>
	<li>All CRUD operations with posts and comments</li>
	<li>Sorting, filtering, pagination</li>
	<li>Likes, dislikes, user rating</li>
	<li>Interactions with images</li>
	<li>Admin panel</li>
	<li>Mobile friendly and responsive layout</li>
	<li>Smooth and convinient UI/UX </li>
	<li>Incredible loaders, slow down your network just to face this beauty</li>
</ul>
<hr>
<h2>Before start preparations</h2>

### 1. DataBase
---
    start postgresql server and create empty data base
    
### 2. Installing dependencies and preparing database
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
	- DISABLE_MAILGUN = # 1 in case you want to disable it or 0 if not
### 4. Starting server
---
	yarn dev 	#for developing mode
	yarn build:client && yarn build:server 	#for production