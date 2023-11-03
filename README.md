# Elysia Js with Bun runtime

### CRUD and AUTH with Elysia Js Bun API

#### Install Bun
- https://bun.sh/docs/installation

#### setup database and env
- create database elysia_app with mysql
- setup .env
- `DATABASE_URL= "mysql://root:Asdqwe12345@localhost:3306/elysia_app?schema=public"`
- `JWT_SECRETS= "secret"`
- `JWT_EXPIRED= "2h"`

#### list dependency
- "elysia": "latest" (Nov 3th, 2023)
- "@elysiajs/cookie": "^0.7.0"
- "@elysiajs/jwt": "^0.7.0"
- "@prisma/client": "^5.5.2",
- "prisma": "^5.5.2"

checkout detail in package.json

#### install dependency
```bash
bun i  
```
#### init prisma
```bash
npx prisma migrate dev --name init  
```

#### Development
To start the development server run:
```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.

#### http request list
- Register user* post: http://localhost:3000/register (body: name email, password)
- Login user* post: http://localhost:3000/login (body: email, password)
- List user* get: http://localhost:3000/user (use response value from login "access_token" to headers)
- By ID user* get: http://localhost:3000/user/1 (use response value from login "access_token" to headers) (params: id)
- Update user* get: http://localhost:3000/user/1 (use response value from login "access_token" to headers) (params: id) (body: name, email, password)
- Delete user* post: http://localhost:3000/user/1 (use response value from login "access_token" to headers) (params: id)
  
#### Author
- [@reyadek](https://www.github.com/reyadek)
