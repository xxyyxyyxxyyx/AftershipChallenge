# Aftership Challenge SF Movie App

## Problem
Create a service that shows on a map where movies have been filmed in San Francisco. The user should be able to filter the view using autocompletion search.

## Solution
My solution uses Node.js and is backend focused. A static html page is served which contains a map and a form for querying movie titles.On startup if the database collection is empty/outdated, a new collection is created/updated from DataSF’s API endpoint . Updates are checked on a dialy basis and uses a temporary collection to store the new set of records. A manual set difference operation is used to filter new records and inserted into the database. Twitter’s typeahead.js library is used for auto completion feature.As user types on the form, matching movie titles are queried from database and displayed in auto completion list. On form submission, matching records are queried from database and Google Maps Geocoding API are used to transcode film locations into geocodes, which are then passed to the frontend and rendered on the map. Due to the limitation on the number of Geocoding API calls, the geocodes associated with each successful search are stored in the database. Subsequent queries on the same location are fetched locally from the database. For movie records with numerous locations, a timeout function is used to bypass google api query limit per second.    
The solution uses MVC architecture for separation of concerns. Each element of the solution is separated to enhance modularity and maintainability. All incoming requests are routed via middleware to controllers which houses the business logic and manipulates database and renders views accordingly.MongoDB was preferred as database soltuion for its native support for handling javascript objects.

## Trade-offs
* The informal syntax of film locations made it impossible to get geocode values for some of the records and affected the overall accuracy of other map markers.
* No information on the time complexity of typehead.js library implementation. Unsure about the performance for very large auto complete list.
* Initially, slower reponse time for movies with numerous locations due to the use of setTimeout function to circumvent query limit.
* Response time could have been improved if locations with response status of ZERO_RESULTS were to be skipped (hence no setTimeout is fired) while getting geocode from local database. But that would entail discarding record information and hence has not been implemented. Prefer relying on preprocessing of such location addresses to solve the issue without loss of information.
## Further Improvements
* Preprocessing of locations with vague addresses to improve accuracy and speed response time from local database.
* Further reading into Mongoose and MondoDB driver documentation to implement set difference operation natively. Currently set difference operation is implemented manually.
* Further reading into promises, arrow functions and async callbacks for more cleaner elegant code.
* Further reading into rewire or similar modules for dependency injection for integration testing.
* Implementing trie data structure instead of using typeahead.js library.
* Further reading into better logging practices.
## Links
Heroku App : [SF Movie App](https://xxyysf.herokuapp.com/)  
Profile : [Github](https://github.com/xxyyxyyxxyyx)



