# CrowdShelf server

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
