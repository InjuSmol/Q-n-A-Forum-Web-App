// Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.

const bcrypt = require('bcrypt');
const UserModel = require('./models/users');
const QuestionModel = require('./models/questions');
const AnswerModel = require('./models/answers');
const TagModel = require('./models/tags');


let mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/fake_so', {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const initialize = async() => {
    try {
        const [,, adminUsername, adminPassword] = process.argv;
        if (!adminUsername || !adminPassword) {
            console.error('Admin username and password must be provided');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

        const adminUser = new UserModel({
            username: adminUsername,
            email: `${adminUsername.toLowerCase()}@fake_so.com`,
            passwordHash: hashedPassword,
            role: 'admin'
        });

        await adminUser.save(); // might have to return it because program doesn't terminate
        console.log('Admin user created successfully.');
    } catch(error) {
        console.error('Error creating admin user:', error);
    }

    const password = '1234'; // PASSWORD FOR ALL SAMPLE USERS
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const firstUser = new UserModel({
        username: 'TheBestCoder',
        email: 'thebestcoder@gmail.com',
        passwordHash: hashedPassword,
        role: 'user',
        reputation: 900
    });
    firstUser.save();
    
    const secondUser = new UserModel({
        username: 'Xx_code_monkey_xX',
        email: 'codemonkey@gmail.com',
        passwordHash: hashedPassword,
        role: 'user',
        reputation: 55
    });
    secondUser.save();
    
    const thirdUser = new UserModel({
        username: 'TheDebtCollector_',
        email: 'debtcollector@gmail.com',
        passwordHash: hashedPassword,
        role: 'user',
        reputation: -200
    });
    thirdUser.save();
    
    const firstTag = new TagModel({
        name: 'react'
    });
    firstTag.save();
    
    const secondTag = new TagModel({
        name: 'express'
    });
    secondTag.save();

    const thirdTag = new TagModel({
        name: 'Node.js'
    });
    thirdTag.save();

    const firstAnswer = new AnswerModel({
        text: 'You can center a div by using flexbox...',
        ans_by: firstUser.username,
        answer_id: firstUser._id
    });
    firstAnswer.save();

    const secondAnswer = new AnswerModel({
        text: "Another way to center a div is to use grid layout...",
        ans_by: secondUser.username,
        answer_id: secondUser._id
    });
    secondAnswer.save();

    const thirdAnswer = new AnswerModel({
        text: "You can also center a div by setting margin to auto...",
        ans_by: thirdUser.username,
        answer_id: thirdUser._id
    });
    thirdAnswer.save();

    const fourthAnswer = new AnswerModel({
        text: "REST API design should follow principles like...",
        ans_by: firstUser.username,
        answer_id: firstUser._id
    });
    fourthAnswer.save();

    const fifthAnswer = new AnswerModel({
        text: "One of the best practices is to use proper HTTP methods...",
        ans_by: secondUser.username,
        answer_id: secondUser._id
    });
    fifthAnswer.save();

    const sixthAnswer = new AnswerModel({
        text: "Another practice is to keep the API as stateless as possible...",
        ans_by: thirdUser.username,
        answer_id: thirdUser._id
    });
    sixthAnswer.save();

    const seventhAnswer = new AnswerModel({
        text: "State in React can be managed using useState hook...",
        ans_by: firstUser.username,
        answer_id: firstUser._id
    });
    seventhAnswer.save();

    const eighthAnswer = new AnswerModel({
        text: "For complex state, you might consider using useReducer or context API...",
        ans_by: secondUser.username,
        answer_id: secondUser._id
    });
    eighthAnswer.save();

    const ninthAnswer = new AnswerModel({
        text: "Managing state in class components can be done using this.setState...",
        ans_by: thirdUser.username,
        answer_id: thirdUser._id
    });
    ninthAnswer.save();
    
    const firstQuestion = new QuestionModel({
        title: "How to center a div in CSS?",
        summary: "Struggling with centering a div element in CSS.",
        text: "I've tried a few different ways to center a div in CSS, but none seem to work. Can someone help?",
        asked_by: firstUser.username,
        tags: [firstTag],
        userID: firstUser._id,
        answers: [firstAnswer, secondAnswer, thirdAnswer]
    });
    firstQuestion.save();
    
    const secondQuestion = new QuestionModel({
        title: "Best practices for REST API design?",
        summary: "Looking for best practices in designing RESTful APIs.",
        text: "What are some of the best practices to keep in mind while designing RESTful APIs?",
        asked_by: secondUser.username,
        tags: [secondTag],
        userID: secondUser._id,
        answers: [fourthAnswer, fifthAnswer, sixthAnswer]
    });
    secondQuestion.save();
    
    const thirdQuestion = new QuestionModel({
        title: "How to manage state in React?",
        summary: "Confused about state management in React components.",
        text: "Can someone explain how to effectively manage state in React components?",
        asked_by: thirdUser.username,
        tags: [thirdTag],
        userID: thirdUser._id,
        answers: [seventhAnswer, eighthAnswer, ninthAnswer]
    });
    thirdQuestion.save()
    console.log('Initialized.');
}

initialize()
  .catch((err) => {
    console.log('ERROR: ' + err);
    if(db) db.close();
  });