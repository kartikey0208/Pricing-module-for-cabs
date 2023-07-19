Note:
This is the outsketch of how the project was built.
I have used javascript as the primary language.
Tech stack of this project being MERN.
The project is still under developement...

The steps involved.

Step1:
Initialized a nodeJs project in a directory with the main server file/ entry point named as server.json.

Step2:
Installed mongoose to help use mongoDB database.
Installed express to get assistance of express App with API functionalities.
Installed jsonwebtoken to use token based authentication.

Step3:
Imported the 3 required modules jwt web token, mongoose and express.
Intantiated the express app to utilize its functionalities.

Step4:
Set up MongoDB schema and model based on the requred specifications.
Initialized a MongoDB connection with the help of ideally secret connection string (not so secret right now!).
Please be mindful and do not mis-use the database.

Step5:
Set up the authentication middleware based on jwt for protecting access to the API routes.

Step6:
Defined routes to respond to API requests.

Step7:
Started the server on say  `{$port}` = `5000`

Step8: 
Include a postmanCollection.json file which can be imported in postman and can be used to 
test my code easily.

Explanation1:
Now i will dive deep into the step 6 because there the logic lies.
Lets talk routes

`/admin/signup`: Allows admin signup. If the admin doesn't exist, a new admin is created,
 and a JWT token is returned for authentication.

`/users/signup`: Allows user signup. If the user doesn't exist,
 a new user is created, and a JWT token is returned for authentication.

`/admin/login`: Admin login route. Checks if admin credentials are valid and
 returns a JWT token for future authentication.

`/users/login`: User login route. Checks if user credentials are valid and
 returns a JWT token for future authentication.

`/calculate/:distance`: route calculates an answer based on the provided distance and
 the latest constants. It requires JWT authentication and determines the constant
 C based on the day of the week. 
 The answer is computed using the formula A * distance + B * distance + C. 
 Error handling is essential to ensure accurate results and database integrity.

`/admin/update-constants`: Allows admin to modify constants (A and B) and
 saves the changes to the database. Requires JWT authentication.

............ to be continued. 

Thanks for reading!

