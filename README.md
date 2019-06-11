# Lainausjärjestelmä

2019 - Kesäharjoittelu lainausjärjestelmä projeckti, jossa luodaan
fullstack lainausjärjestelmä kokonaisuus.

## Esim env fie

Alla on esimerkki .env tiedostosta

```
    DB_USERNAME=admin
    DB_PASSWORD=admin
    DB_NAME=db

    BACKEND_PORT=3050
    BACKEND_HOST=localhost

    JWT_SECRET=SuperSalainen19
    JWT_TIME=1d

    SALT_ROUNDS=10

    NODE_ENV=development

    FRONTEND_HOST=localhost
    FRONTEND_PORT=3000

    PRISMA_PORT=3060
    PRISMA_SECRET=SuperSalainen19
    PRISMA_MAS=SuperSalainen19
```

## Projectin ajaminen

1. asenna tarvittavat ohjelmistot

   - docker
   - docker-compose
   - yarn
   - curl

2. lataa tiedotot koneele kansioon
3. aja yarn backend ja frontend kansioissa
4. root kansiossa aja `docker-compose up -d`
5. dev mode on ajossa:
   - backend: localhost:3050
   - frontend: localhost:3000
   - prisma: localhost:3060
   - prisma admin: localhost:3060/\_admin

## Käytetyt teknologiat

- docker
- docker-compose

### Backend

- nodejs
- express
- typescript
- pridma
- apollo server
- graphql-yoga
- postgresql
- winston + daily rotate
- jwt
- detenv

### Frontend

- nextjs
- javascript es6
- devextreme grid
- apollo client
- cookies
- react
- webpack

## ETÄ SERVER

IP: 172.16.101.140
DNS: lainaus.project.tamk.cloud

port backend: 3050
port frontend: 3000

user: lainaus
pass: proto19

user: deploy
pass: proto19
