Instructions & Descriptions: 

1. For the server install all the necessary framework. Run npm install in client and server folders, as well as the project folder.
    Requirements:
    $ npm install react
    $ npm install express
    $ npm install axios
    $ npm install mongoose
    $ npm install bcrypt
    $ npm install nodemon //
    $ npm install connect-mongo
    $ npm install express-session //
    $ npm install cors
    $ npm install react-icons
    $ npm install react-scripts
    $ npm install react-router-dom

2. Have mongoDB pre-installed on your computer (installed with brew in my case)

3. Start mongodb using mongod command ( on my M1 Sonoma laptop I have to do '$ sudo brew services start mongodb-community@7.0')

4. Initialize the database and create an admin user:
    1. cd to /server
    2. Run npm install
    3. Enter in terminal: `node init.js <admin-username> <admin-password>`
    4. Ctrl C when initialize is logged

5. start server:
    1. cd to /server
    2. Enter in terminal: nodemon ./server.js 

6. split terminal, cd to the client folder and start react application:
    1. cd to /client
    2. Run npm install
    3. Enter in terminal: npm start

7. You can use mongosh to navigate through the fake_so database

8. You can stop mongoDB using '$ sudo brew services stop mongodb-community@7.0' or refer to [Starting and stopping mongoDB](align-items:%2520center%253B) for other ways to do so.

9. To log into admin, use the email `<your_admin_username>@fake_so.com>`

9. Ctrl C out of both npm start and nodemon server.js processes to kill website



Contributions: 

InjuSmol: 

    loginform.js
    logouticon.js
    newanswerpage.js
    newquestionpage.js
    questionmainpage.js
    questionpreview.js
    registerform.js
    searchbar.js
    searchresults.js
    sidebar.js
    tagpreview.js
    tagspage.js
    viewquestion.js
    welcomepage.js
    server.js
    App.css
    App.js
    answers.js
    comments.js
    questions.js
    tags.js
    users.js
    init.js
    UML 

Zachary Cytryn:

    adminpage.js
    fakestackoverflow.js
    loginform.js
    newanswerpage.js
    newcommentpage.js
    newquestionpage.js
    profilepage.js
    questionmainpage.js
    questionpreview.js
    registerform.js
    sidebar.js
    viewquestion.js
    welcomepage.js
    App.css
    App.js
    server.js
    answers.js
    comments.js
    questions.js
    tags.js
    users.js
    init.js

