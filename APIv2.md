# API V2
## Data model

The objects you can retrieve from the API are separated into three classes: `Book`, `Crowd`, and `User`.
When retrieving an object, you can specify if you want it to contain references to other objects or the objects themselves.

##### `Book` object with references:

    {
        _id: String,
        isbn: String,
        owner: String, # username
        numberOfCopies: Integer,
        numAvailableForRent: Integer,  
        rentedTo: Array[String] # usernames
    }
    
`numberOfCopies` indicates the number of copies the owner has, while `numAvailableForRent` indicates the number of copies the owner wants to rent out.
##### `Book` object with nested objects:

    {
        _id: String,
        isbn: String
        owner: User,
        numberOfCopies: Integer,
        numAvailableForRent: Integer,
        rentedTo: Array[User] # Contains user objects with references
    }
    
##### `User` object with references:

    {
        username: String, # Unique identifier
        booksOwned: Array[String], # _id of the books
        booksRented: Array[String], # _id of the books
        crowds: Array[String] # _id of the crowds
    }

The list of `Crowd` id's or objects are the crowds that the user is a member of. 
##### `User` object with nested objects:

    {
        username: String,
        booksOwned: Array[Book], # Contains book objects with references
        booksRented: Array[Book], # Contains book objects with references
        crowds: Array[Crowd] # Contains crowd objects with references
    }
	
##### `Crowd` object with references:

    {
        _id: String, 
        name: String,
        owner: String, # username
        members: Array[String] # usernames
    }

##### `Crowd` object with nested objects:

    {
        _id: String, 
        name: String,
        owner: User,
        members: Array[User] # Contains user objects with references
    }
    
Note that nesting of objects only go down one level. If you retrieve a `Crowd` with `User` objects, these `User` objects will contain references, not full `Book` or `Crowd` objects. 
Unless explicitly specified, you will always retrieve objects with references. 


### Books
#### Create
_not affected_
**Request:** `PUT /book` puts a book as defined in the data model.

**Response:** The new book from the database.

This can be a new item, or an item with changed properties.

#### Add and remove renters
_not affected_
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
_affected_
Get an item with a given ISBN or/and of a specific owner:

Request | Response
--- | ---
`GET /book/:isbn` |  An array of `book`-objects (containing references) of the specified `isbn`
`GET /book/:isbn/:owner` | `book`-object (containing references) for the specified `isbn` and `owner`. 
`GET /bookobj/:isbn` |  An array of `book`-objects (containing objects) of the specified `isbn`
`GET /bookobj/:isbn/:owner` | `book`-object (containing objects) for the specified `isbn` and `owner`. 

**Error codes:**

HTTP Code | Comment
--- | ---
`404 Not found` | The ISBN or owner is not found.


### Crowds
#### Create
_not affected_
**Request:** `POST /crowd` to post a new crowd on the data format given above. Note that `_id` is a value given by Mongodb, and including it in the posted data does not affect anything. 

**Response:** The new `crowd`-object with the `_id` from Mongodb.

**Error codes**

HTTP Code | Comment
--- | ---
`422 Unprocessable entity` | Something's wrong with the data sent, e.g. a missing field. 

#### Add and remove members
_not affected_
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
_affected_
Request | Response
--- | ---
`GET /crowd` | An array of all `crowd`-objects (with references).
`GET /crowd/:crowdId` | A `crowd`-object (with references) for the specified ID.
`GET /crowdobj` | An array of all `crowd`-objects (with nested objects).
`GET /crowdobj/:crowdId` | A `crowd`-object for the specified ID (with with nested objects).

**Errors:**

HTTP Code | Comment
--- | ---
`404 Not found` | Route is not found. You're either trying to update position of someone who's not driving, or you've given the wrong route code.


### Users 
_affected_
Request | Response
--- | ---
`GET /user/:username` | `User`-object (with references) for the given username.
`GET /userobj/username` | `User`-object (with nested objects) for the given username.
**Errors:**

HTTP Code | Comment
--- | ---
`404 Not found` | Route is not found. You're either trying to update position of someone who's not driving, or you've given the wrong route code.
