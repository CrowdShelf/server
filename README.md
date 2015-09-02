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
        owner: String username,
        numberOfCopies: Integer,
        availableForRent: Integer, 
        rentedTo: Array[String usernames]
    }
    
A `crowd` has the following properties:

    {
        _id: String, 
        name: String,
        creator: String username,
        members: Array[String usernames]
    }
    
Users are kept in a relational database, seperate from crowds and books. 
A user is represented by its unique string username.

The `_id` fields are given by MongoDB upon creation, and identifies the object unqiuely in the database. 
When you create a new object, the `_id`-fields are irrelevant. Add it if you want. The new object is returned
with the mongodb `_id`.

## API
Remember header `Content-Type` should be `application/json`on all requests.

You'll need `/api/` in front of a request. If you want the latest API, you can just use that. If you want a specific 
version of the API, follow `api` with the version number, e.g. `/api/v2/`.

As of August 26. 2015 there's only one version of the api.

### Books
#### Create 
**Request:** `PUT /book` puts a book as defined in the data model.

This can be a new item, or an item with changed properties.

#### Add and remove renters
**Requests:** 

* `PUT /book/:isbn/:owner/addrenter` to add a renter to a book.
* `PUT /book/:isbn/:owner/removerenter` to remove a renter to a book.

**Data:** `{username: usernameToAddOrRemove}`

**Response:**

HTTP Code | Comment
--- | ---
`200 OK` | Added/removed
`422 Unprocessable entity` | Something wrong with the data given, usually missing field `username`. 
`409 Conflict` | Already a renter.


#### Get books
Get an item with a given ISBN or/and of a specific owner:

Request | Response
--- | ---
`GET /book/:isbn` |  An array of `book`-objects of the specified `isbn`
`GET /book/:isbn/:owner` | `book`-object for the specified `isbn` and `owner`. 


**Error codes:**

HTTP Code | Comment
--- | ---
`404 Not found` | The ISBN or owner is not found.


### Crowds
#### Create and edit 
**Request:** `POST /crowd` to post a new crowd on the data format given above. Note that `_id` is a value given by Mongodb, and including it in the posted data does not affect anything. 

**Response:** The new `crowd`-object with the `_id` from Mongodb.

**Error codes**

HTTP Code | Comment
--- | ---
`422 Unprocessable entity` | Something's wrong with the data sent, e.g. a missing field. 


**Request:** `PUT /crowd/:crowdId/addmember` to add (put) a member into the crowd, 
or `PUT /crowd/:crowdId/removemember` to remove a member from a crowd.

**Data:** `{username: newMemberUsernme} `

**Response:** 

HTTP Code | Comment
--- | ---
`404 Not found` | Route is not found. You're either trying to update position of someone who's not driving, or you've given the wrong route code.
`422 Unprocessable entity` | Something wrong with the data given, e.g. missing field `username`. 
`409 Conflict` | Already a member of the crowd 

#### Get crowds 

Request | Response
--- | ---
`GET /crowd` | An array of all `crowd`-objects.
`GET /api/crowd/:crowdId` | A `crowd`-object for the specified ID.

**Errors:**

HTTP Code | Comment
--- | ---
`404 Not found` | Route is not found. You're either trying to update position of someone who's not driving, or you've given the wrong route code.


### Users 
**Request:**  `GET /user/:username`

**Response:**

    {
        username: String,
        booksOwned: Array[Book],
        booksRented: Array[Book],
        crowds: Array{Crowd]
    }
    
The `Book` and `Crowd` are as given in the data models above. The Crowds are those that the user is a part of.

**Errors:**

HTTP Code | Comment
--- | ---
`404 Not found` | Route is not found. You're either trying to update position of someone who's not driving, or you've given the wrong route code.
