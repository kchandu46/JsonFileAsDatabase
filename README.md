# JsonFileAsDatabase
Reducing cost: instead of buying a database as service, we can use simple json file as database for small scale applications
I have taken example of alexa reviews and implemented microservice for usage of json file as a database

Instruction to use project:

Steps to run the app:
1.npm install
2.npm start

for testing :npm test
coverage: npm run coverage;


APIS:
GET: http://localhost:8080/reviews
GET: http://localhost:8080/reviews?rating=1&review_source=iTunes&reviewed_date=2017-12-09T00:01:12.000Z
GET: http://localhost:8080/totalRatings
GET: http://localhost:8080/averageMonthlyRating
POST: http://localhost:8080/create


// Assumptions: 
1.Only Two stores(itunes, google play) reviews availble in the list
2.Authenticaion is not required as of now.

TODo's:
1. Inputs values are not validated.
2. "/reviews" api performance can be improved using : child rocess( Dividing the file, while reading )
3. "/reviews" api. filter can be extended to support multiple operators(<, > >=)
4. Centralized error handling.
