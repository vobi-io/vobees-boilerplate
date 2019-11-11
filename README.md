## appDomain

#### Scripts
``` npm run start:local``` runs project on local db

``` npm run start:testing``` runs project on local db with testing

``` npm run socket``` runs socket server

``` npm run start:devDocker``` start project with docker

#### Generate API documentation
``` npm run apidoc``` generate api documentation

``` npm run swagger``` generate documentation (swagger)

##### Other commands:
``` npm run lint``` Eslint error check

## Docker
``` docker-compose -f docker-compose.app.yml up --build``` run only server (ვორკერის და სოკეტის გარეშე) width debugger 

``` docker-compose up --build ``` run this command first time 

``` docker-compose up ``` start project

## GrapHQL API endpoints & Interface

GraphQL ინტერფესი ```http://localhost:8000/graphql```
see documentation of each model, mutations and queries

<img src="https://www.dropbox.com/s/zuiyj0y3tokwkv7/graphql.png?raw=1">

## API endpoints & Swagger Interface

platform has support of GRAPHQL and REST interface,
you can view rest documentation of routes on this domain http://localhost:8000/api-docs/

<img src="https://www.dropbox.com/s/hlxc0nc18mno6ma/swagger.png?raw=1">

