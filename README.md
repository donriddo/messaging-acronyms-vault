[![Coverage Status](https://coveralls.io/repos/github/donriddo/messaging-acronyms-vault/badge.svg?branch=main)](https://coveralls.io/github/donriddo/messaging-acronyms-vault?branch=main)

# WTF API (Node.js, Express, TypeScript, Docker, MongoDB, Mongoose)

## Steps to run app

1. Clone the repository

### If you want to run inside containers

2. RUN `docker-compose up` - expects you to have docker installed

### If not running inside containers

2. `cd` into the cloned repo and RUN `yarn install` to install all the necessary dependencies

4. Get a working `.env` file. There is a template to follow which is `.env.sample`

5. RUN `yarn test` to run the tests.

6. RUN `yarn serve` to launch the app


## How to use the app

#### By default, *1542* acronyms have been seeded into the DB, so you can start testing right away

### GET ENDPOINTS

[1] You can list authors by calling `GET /api/authors`

[2] You can list acronyms by calling `GET /api/acronyms`

[3] You can fuzzy-search acronyms by doing `GET /api/acronyms?$search=keyword`

#### List of utility GET query parameters

##### All list endpoints are paginated and will return a response with the format
```json
{
  "message": "Acronyms retrieved successfully",
  "data": [
    {
      "_id": "6077010debdb134a9c5fd3a7",
      "key": "?",
      "value": "I don't understand what you mean",
      "author": "6077010debdb1369b95fd3a6",
      "createdAt": "2021-04-14T14:49:50.460Z",
      "updatedAt": "2021-04-14T14:49:50.460Z",
      "__v": 0,
      "id": "6077010debdb134a9c5fd3a7"
    }
  ],
  "meta": {
    "limit": 1,
    "offset": 0,
    "total": 1542
  }
}
```

- `$search=keyword` allows you perform fuzzy matching acronym key/value

- `$offet=number` allows you to skip a number of records e.g `GET /api/acronyms?$offset=500`

- `$limit=number` allows you specify how many records returned per API call e.g `GET /api/acronyms?$limit=100`

- `$populate=comma,seperated,fields` allows you to populate a relation field e.g `/api/acronyms?$limit=1&$populate=author` will return
```json
{
  "message": "Acronyms retrieved successfully",
  "data": [
    {
      "_id": "6077010debdb134a9c5fd3a7",
      "key": "?",
      "value": "I don't understand what you mean",
      "author": {
        "_id": "6077010debdb1369b95fd3a6",
        "email": "author@admin.user",
        "createdAt": "2021-04-14T14:49:49.883Z",
        "updatedAt": "2021-04-14T15:23:03.409Z",
        "__v": 0,
        "id": "6077010debdb1369b95fd3a6"
      },
      "createdAt": "2021-04-14T14:49:50.460Z",
      "updatedAt": "2021-04-14T14:49:50.460Z",
      "__v": 0,
      "id": "6077010debdb134a9c5fd3a7"
    }
  ],
  "meta": {
    "limit": 1,
    "offset": 0,
    "total": 1542
  }
}
```


### POST ENDPOINTS

[1] To generate auth API key, do
```json
POST /api/authors/generate-api-key

{
  "email": "you@domain.tld"
}
```

[2] To create a new acronym
```json
POST /api/acronyms
HEADERS "x-api-key"="your-api-key"

{
	"key": "some-key",
	"value": "some-value"
}
```

### PUT ENDPOINTS

[1] To update an acronym, do
```json
PUT /api/acronyms/:acronymId
HEADERS "x-api-key"="your-api-key"

{
	"key": "some-new-key",
	"value": "some-new-value"
}
```

### DELETE ENDPOINTS

[1] To delete an acronym, do
```json
DELETE /api/acronyms/:acronymId
HEADERS "x-api-key"="your-api-key"
```
