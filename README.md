# CrowdShelf server
Server for the CrowdShelf apps, written with NodeJS, ExpressJS and Sequelize.

## Workflow
We're using JIRA for issue tracking. We try to follow [Chrockford's style guide](http://javascript.crockford.com/code.html) for our code.

## Installation
1. Clone the repository with `git@github.com:CrowdShelf/server.git`
2. `cd` into the folder
3. Run `npm install` to install dependencies
4. Run `npm start` and you'll be up and running on port 3000, or an environment defined port.

## Data model
An `book` is a book in our database that is owned by a user:

    {
        isbn: String
        owner: String,
        availavleForRent: Boolean, 
        rentedTo: String,
        numberOfCopies: Integer,
    }
    
A `crowd` has the following properties:

    {
        name: String,
        creator: String,
        members: Array[String]
    }

## API
Remember header `Content-Type` should be `application/json`on all requests.

You'll need `/api/` in front of a request. If you want the latest API, you can just use that. If you want a specific 
version of the API, follow `api` with the version number, e.g. `/api/v2/`.

As of August 26. 2015 there's only one version of the api.

### Create and edit 
Put an item as defined above to the database:
`PUT /api/book`

This can be a new item, or an item with changed properties.

### Get
Get an item with a given ISBN or/and of a specific owner:

`GET /book/:isbn` returns all data on all available owners of a specific book as an array.
`GET /book/:isbn/:owner` returns data on a specfic book of a specific owner.

`:isbn` is replaced with the ISBN-number as a string, and `:owner` is replaced with
an identifier for the owner.
