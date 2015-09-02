# CrowdShelf server
Server for the CrowdShelf apps, written with NodeJS, ExpressJS and Sequelize.

## Workflow
We're using JIRA for issue tracking. We try to follow [Chrockford's style guide](http://javascript.crockford.com/code.html) for our code.

## Installation
1. Clone the repository with `git@github.com:CrowdShelf/server.git`
2. `cd` into the folder
3. Run `npm install` to install dependencies
4. Set up mongodb locally and export an environment variable `MONGODB` that defines its URL.
5. Run `npm start` and you'll be up and running on port 3000, or an environment defined port.

## Deployment 
### Heroku
The server is currently running on Heroku. It has CI with the `master`-branch. You'll find it on `crowdshelf.herokuapp.com/api`.

## Data model
A `book` is a book in our database that is owned by a user:

    {
        _id: String,
        isbn: String
        owner: String,
        availavleForRent: Integer, 
        rentedTo: Array[string], ,
        numberOfCopies: Integer,
    }
    
A `crowd` has the following properties:

    {
        _id: String, 
        name: String,
        creator: String,
        members: Array[String]
    }
    
Users are kept in a relational database, seperate from crowds and books. 
A user is represented by its unique string username.

The `_id` fields are given by MongoDB upon creation, and identifies the object unqiuely in the database. When you create a new object, you don't post the `_id`-fields.

## API
Remember header `Content-Type` should be `application/json`on all requests.

You'll need `/api/` in front of a request. If you want the latest API, you can just use that. If you want a specific 
version of the API, follow `api` with the version number, e.g. `/api/v2/`.

As of August 26. 2015 there's only one version of the api.

### Create and edit books
Put an item as defined above to the database:
`PUT /api/book`

This can be a new item, or an item with changed properties.

### Get books
Get an item with a given ISBN or/and of a specific owner:

`GET /book/:isbn` returns all data on all available owners of a specific book as an array.
`GET /book/:isbn/:owner` returns data on a specfic book of a specific owner.
`PUT /book/:isbn/:owner/addrenter/:renter` to add a renter to a book.
`PUT /book/:isbn/:owner/removerenter/:renter` to remove a renter to a book.

`:isbn` is replaced with the ISBN-number as a string, and `:owner` is replaced with
an identifier for the owner.

### Crowds
`POST /api/crowd` to post a new crowd.

`PUT /api/crowd/:crowdId` to add (put) a member into the crowd.

`GET /api/crowd` to get all crowds with name and id.

`GET /api/crowd/:crowdId` to get members of a given `crowdId`.


### Users 
#### Get 
**Request** 
`GET /user/:username`

**Response***
    {
        username: String,
        books: Array[Book],
        crowds: Array{Crowd]
    }
    
The `Book` and `Crowd` are as given in the data models above, and are the Crowds that the user is a part of, and the book he owns.