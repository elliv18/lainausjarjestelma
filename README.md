# Lainausjärjestelmä

2019 - Kesäharjoittelu lainausjärjestelmä projeckti, jossa luodaan
fullstack lainausjärjestelmä kokonaisuus.

## PUBLIC URL

- lainaus.project.tamk.cloud

## Example `.env` file

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

## Development environment setup

1. Clone the repo
2. Create a .env file(above) to the root folder of the repo
3. Navigate to `/backend` and run `yarn install`
4. Navigate to `/frontend` and run `yarn install`
5. Navigate to root of the repo, and run `docker-compose up -d`

Start developing.

### Code formatting

We use Prettier and TSLint.
All code has to pass `yarn lint` or it fails the CI.

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
