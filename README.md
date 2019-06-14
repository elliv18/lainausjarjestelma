# LOANING SYSTEM

Summer training 2019 project to build fullstack loaning system.

## PUBLIC URL

- SITE: lainaus.project.tamk.cloud

- API:

## Example `.env` file

Bellow is example `.env` file

```
    # NODE_ENV
    NODE_ENV=development

    # BACKEND

    BACKEND_PORT=3050
    BACKEND_HOST=localhost

    # jwt
    JWT_SECRET=T6Y3JRYmL6
    JWT_TIME=1d

    # bcrypt salt rounds
    SALT_ROUNDS=10

    # Root admin info
    ROOT_ADMIN_EMAIL=1
    ROOT_ADMIN_PASS=1
    ROOT_ADMIN_FIRST_NAME=Root
    ROOT_ADMIN_LAST_NAME=admin
    ROOT_ADMIN_ADDRESS=server
    ROOT_ADMIN_PERSON_NUMBER=127.0.0.1
    ROOT_ADMIN_PHONE=127.0.0.1

    # minium password length - max length is 18
    MIN_PW=3

    # PRISMA

    PRISMA_PORT=3060

    # FRONTEND

    FRONTEND_HOST=localhost
    FRONTEND_PORT=3000

    # PUBLIC URL

    PUBLIC_URL=lainaus.project.tamk.cloud
    PUBLIC_API_URL=
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

## Project used technologies

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
- winston + daily rotate logs
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

## Backend logs

Backend log files is saved `backend` folder inside subfolder `logs`. `[root dir]/backend/logs`

## Remote server info

IP: 172.16.101.140
DNS: lainaus.project.tamk.cloud

port backend: 3050
port frontend: 3000

user: lainaus
pass: proto19

user: deploy
pass: proto19
