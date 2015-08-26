# CrowdShelf server

## Installation
1. Clone the repository with `git@github.com:CrowdShelf/server.git`
2. `cd` into the folder
3. Run `npm install` to install dependencies
4. Run `npm start` and you'll be up and running on port 3000, or an environment defined port.

## Data model
For a book in our database that is owned by a user:

    {
        isbn: String
        owner: String,
        availavleForRent: Boolean, 
        rentedTo: String,
        numberOfCopies: Integer,
        history: {
            timestamp: username (String)
        }
    }

## API
