Changes:
Remove commands from URI (like "addrenter", "removemember").
URI's should always point to resource. 
Use HTTP commands to specify command (POST, PUT, GET, DELETE etc).

Books should be individual objects for individual physical copies.
Therefore, the numberOfCopies field is removed and 
rentedTo Array[String] # Username
is changed to 
rentedTo String # Username. 

Books should be identified by bookId, not ISBN. Books can be retrieved by ISBN, title, author
etc by modifiers like ?isbn="21321312" 
e.g. GET /books/?isbn="12323"

Change main resource names to plural (crowd -> crowds)

There should generally be PUT, GET and DELETE for each (sub-)field in an object given by the URI
like PUT /book/:bookid/owner/ and GET /api/books/:bookid/renter

PUT /api/book/:bookid/renter/:username
DEL /api/book/:bookid/renter/:username

## Data model
A `book` is a book in our database that is owned by a user:

    {
        _id: String,
        isbn: String,
        owner: String, # username
        rentedTo: String # username
	// To be implemented later:
	condition : String # like: New, worn out etc.
	rentedToHistory: : Array[(String, Date, Date)] # username of borrower, date borrowed, date returned
	picture : ??? # Picture of the book taken by its owner
    }


A `crowd` has the following properties:

    {
        _id: String, 
        name: String,
        owner: String, # username
        members: Array[String] # usernames
    }
    
Users are kept in a relational database, separate from crowds and books. 
A user is represented by its unique string username, and the object contain nested book objects: 

    {
        username: String,
        booksOwned: Array[Book],
        booksRented: Array[Book],
        crowds: Array[String] # The _id's for the crowds
    }


The `_id` fields for `Book` and `Crowd` are given by MongoDB upon creation, and identifies the object unqiuely in the database. 
When you create a new object, the `_id`-fields are irrelevant. Add it if you want. The new object is returned
with the mongodb `_id`.

## API
Remember header `Content-Type` should be `application/json`on all requests. You'll need `/api/` in front of your request. 

### Books
#### Create 
**Request:** 

`PUT /book` puts a book as defined in the data model.

**Response:** 

The new book object from the database.

This can be a new item, or an item with changed properties.

#### Add and remove renters
**Requests:** 

* `PUT /book/:bookid/renter/:username` to add a renter to a book.
* `DEL /book/:bookid/renter/:username` to remove a renter to a book.

**Data:** 

`None`

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
`GET /books/` |  An object with a field `books` that is an array of all books`
`GET /books/:bookId` | `book`-object for the specified `bookId`.
`GET /books/?isbn=1234421` | An object with a field `books` that is an array of all books with the given ISBN 
`GET /books/?isbn=1234421?owner="esso"` | An object with a field `books` that is an array of all books with the given ISBN and owner
`GET /books/?author="McMurdoc" | An object with a field `books` that is an array of all books with the given author
`GET /books/?title="The bible" | An object with a field `books` that is an array of all books with the given title

**Error codes:**

HTTP Code | Comment
--- | ---
`404 Not found` | The ISBN or owner is not found.

### Crowds
#### Create and edit 
**Request:** 

`POST /crowd` to post a new crowd on the data format given above. Note that `_id` is a value given by Mongodb, and including it in the posted data does not affect anything. 

**Response:** 

The new `crowd`-object with the `_id` from Mongodb.

**Error codes**

HTTP Code | Error message | Comment
--- | --- | ---
`409 Conflict` | Crowd name already in use. |  We require unique crowd names.
`422 Unprocessable entity` | | Something's wrong with the data sent, e.g. a missing field. 


**Request:** 

* `PUT /crowds/:crowdId/members/:username` to add (put) a member into the crowd, 
* `DEL /crowds/:crowdId/members/:username` to remove a member from a crowd.

**Data:** 

`None`

**Response:** 

HTTP Code | Comment
--- | ---
`404 Not found` | Route is not found. You're either trying to update position of someone who's not driving, or you've given the wrong route code.
`422 Unprocessable entity` | Something wrong with the data given, e.g. missing field `username`. 
`409 Conflict` | Already a member of the crowd 

#### Get crowds 

Request | Response
--- | ---
`GET /crowds` | An object with a field `crowds` that is an array of all `crowd`-objects.
`GET /crowds/:crowdId` | A `crowd`-object for the specified ID.
`DEL .. the above`

**Errors:**

HTTP Code | Comment
--- | ---
`404 Not found` | Route is not found. You're either trying to update position of someone who's not driving, or you've given the wrong route code.


### Users 
**Request:**  

`GET /users/:username`
`DEL /users/:username`

**Response:**

The `User` object with the given username.
    
The `Book` is as given in the data models above. The Crowds are those that the user is a part of.

**Errors:**

HTTP Code | Comment
--- | ---
`404 Not found` | Route is not found. You're either trying to update position of someone who's not driving, or you've given the wrong route code.