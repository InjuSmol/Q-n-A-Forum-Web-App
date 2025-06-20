import mongoose from "mongoose";

const mockingoose = require('mockingoose');
import { insertNewUser,
  //authenticateUser,
  addTag, getQuestionsByOrder, filterQuestionsBySearch, fetchAndIncrementQuestionViewsById, saveQuestion, getTagIds, saveAnswer, getTagCountMap } from '../models/application';
import { IAnswer, IUser,IQuestion, ITag } from '../models/types/types';
import Questions from '../models/questions';
import Tags from '../models/tags';
import User from '../models/users';
import bcrypt from 'bcrypt';
import {Server} from "http";

Questions.schema.path('answers', Array);
Questions.schema.path('tags', Array);

const _tag1: ITag = {
  _id: '507f191e810c19729de860ea',
  name: 'react'
};

const _tag2: ITag = {
  _id: '65e9a5c2b26199dbcc3e6dc8',
  name: 'javascript'
};

const _tag3: ITag = {
  _id: '65e9b4b1766fca9451cba653',
  name: 'android'
};

const _ans1: IAnswer = {
  _id: '65e9b58910afe6e94fc6e6dc',
  text: 'ans1',
  ans_by: 'ans_by1',
  ans_date_time: new Date('2023-11-18T09:24:00'),
  votes: 5
};

const _ans2: IAnswer = {
  _id: '65e9b58910afe6e94fc6e6dd',
  text: 'ans2',
  ans_by: 'ans_by2',
  ans_date_time: new Date('2023-11-20T09:24:00'),
  votes: 10
};

const _ans3: IAnswer = {
  _id: '65e9b58910afe6e94fc6e6de',
  text: 'ans3',
  ans_by: 'ans_by3',
  ans_date_time: new Date('2023-11-19T09:24:00'),
  votes: 2
};

const _ans4: IAnswer = {
  _id: '65e9b58910afe6e94fc6e6df',
  text: 'ans4',
  ans_by: 'ans_by4',
  ans_date_time: new Date('2023-11-19T09:24:00'),
  votes: 3
};

const _questions: IQuestion[] = [
  {
    _id: '65e9b58910afe6e94fc6e6dc',
    title: 'Quick question about storage on android',
    text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
    tags: [_tag3, _tag2],
    answers: [_ans1, _ans2],
    ask_date_time: new Date('2023-11-16T09:24:00'),
    views: 48,
    votes: 0
  },
  {
    _id: '65e9b5a995b6c7045a30d823',
    title: 'Object storage for a web application',
    text: 'I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.',
    tags: [_tag1, _tag2],
    answers: [_ans1, _ans2, _ans3],
    ask_date_time: new Date('2023-11-17T09:24:00'),
    views: 34,
    votes: 0
  },
  {
    _id: '65e9b9b44c052f0a08ecade0',
    title: 'Is there a language to write programmes by pictures?',
    text: 'Does something like that exist?',
    tags: [],
    answers: [_ans1],
    ask_date_time: new Date('2023-11-19T09:24:00'),
    views: 12,
    votes: 0
  },
  {
    _id: '65e9b716ff0e892116b2de09',
    title: 'Unanswered Question #2',
    text: 'Does something like that exist?',
    tags: [],
    answers: [],
    ask_date_time: new Date('2023-11-20T09:24:00'),
    views: 233,
    votes: 0
  },
];

let server: Server;

describe('application module', () => {

  beforeEach(() => {
    mockingoose.resetAll();
    server = require("../server");

  });

  afterEach(async () => {
    jest.clearAllMocks();
    server.close();
    await mongoose.disconnect();
  });
  
  // addTag
  test('addTag return tag id if the tag already exists', async () => {
    mockingoose(Tags).toReturn(_tag1, 'findOne');

    const result = await addTag('react');
    if (result)
      expect(result.toString()).toEqual(_tag1._id?.toString());
    else
      fail(`Expected a String but got null`);

  });

  test('addTag return tag id of new tag if does not exist in database', async () => {
    mockingoose(Tags).toReturn(null, 'findOne');
    const result = await addTag('javascript');
    expect(result).toBeDefined();
  });

  test('addTag returns null if findOne throws an error', async () => {
    mockingoose(Tags).toReturn(new Error('error'), 'findOne');
    const result = await addTag('react');
    expect(result).toBeNull();
  });

  test('addTag returns null if save throws an error', async () => {
    mockingoose(Tags).toReturn(null, 'findOne');
    mockingoose(Tags).toReturn(new Error('error'), 'save');
    const result = await addTag('javascript');
    expect(result).toBeNull();
  });

  // filterQuestionsBySearch
  test('filter questions with empty search string should return all questions', () => {
    const result = filterQuestionsBySearch(_questions, '');

    expect(result.length).toEqual(_questions.length);
  });

  test('filter questions with undefined list of questions should return empty list', () => {
    const result = filterQuestionsBySearch(undefined, 'react');
    expect(result.length).toEqual(0);
  });

  test('filter questions with empty list of questions should return empty list', () => {
    const result = filterQuestionsBySearch([], 'react');
    expect(result.length).toEqual(0);
  });

  test('filter questions with empty questions and empty string should return empty list', () => {
    const result = filterQuestionsBySearch([], '');
    expect(result.length).toEqual(0);
  });

  test('filter question by one tag', () => {
    const result = filterQuestionsBySearch(_questions, '[android]');

    expect(result.length).toEqual(1);
    expect(result[0]._id).toEqual('65e9b58910afe6e94fc6e6dc');
  });

  test('filter question by multiple tags', () => {
    const result = filterQuestionsBySearch(_questions, '[android] [react]');

    expect(result.length).toEqual(2);
    expect(result[0]._id).toEqual('65e9b58910afe6e94fc6e6dc');
    expect(result[1]._id).toEqual('65e9b5a995b6c7045a30d823');
  });

  test('filter question by one keyword', () => {
    const result = filterQuestionsBySearch(_questions, 'website');

    expect(result.length).toEqual(1);
    expect(result[0]._id).toEqual('65e9b5a995b6c7045a30d823');
  });

  test('filter question by tag and keyword', () => {

    const result = filterQuestionsBySearch(_questions, '[android]');

    expect(result.length).toEqual(1);
    expect(result[0]._id).toEqual('65e9b58910afe6e94fc6e6dc');
  });

  // getQuestionsByOrder
  test('get active questions, newest questions sorted by most recently answered 1', async () => {
    mockingoose(Questions).toReturn(_questions.slice(0, 3), 'find');

    const result = await getQuestionsByOrder('active');

    expect(result.length).toEqual(3);
    expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
    expect(result[1]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
    expect(result[2]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
  });

  test('get active questions, newest questions sorted by most recently answered 2', async () => {
    const questions = [{
      _id: '65e9b716ff0e892116b2de01',
      answers: [_ans1, _ans3], // 18, 19 => 19
      ask_date_time: new Date('2023-11-20T09:24:00')
    },
    {
      _id: '65e9b716ff0e892116b2de02',
      answers: [_ans1, _ans2, _ans3, _ans4], // 18, 20, 19, 19 => 20
      ask_date_time: new Date('2023-11-20T09:24:00')
    },
    {
      _id: '65e9b716ff0e892116b2de03',
      answers: [_ans2], // 20 => 20
      ask_date_time: new Date('2023-11-20T09:24:00')
    }];

    mockingoose(Questions).toReturn(questions, 'find');

    const result = await getQuestionsByOrder('active');

    expect(result.length).toEqual(3);
    expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de02');
    expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de03');
    expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de01');
  });

  test('get newest questions', async () => {
    const questions = [
      {
        _id: '65e9b716ff0e892116b2de01',
        ask_date_time: new Date('2023-11-21T09:24:00')
      },
      {
        _id: '65e9b716ff0e892116b2de02',
        ask_date_time: new Date('2023-11-19T09:24:00')
      },
      {
        _id: '65e9b716ff0e892116b2de03',
        ask_date_time: new Date('2023-11-20T09:24:00')
      }
    ];

    mockingoose(Questions).toReturn(questions, 'find');

    const result = await getQuestionsByOrder('newest');

    expect(result.length).toEqual(3);
    expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de01');
    expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de03');
    expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de02');
  });

  test('get unanswered questions', async () => {
    mockingoose(Questions).toReturn([_questions[2], _questions[3]], 'find');

    const result = await getQuestionsByOrder('unanswered');
    expect(result.length).toEqual(2);
    expect(result[1]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
    expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
  });

  // fetchAndIncrementQuestionViewsById
  test('fetchAndIncrementQuestionViewsById throws error when given empty id', async () => {
    mockingoose(Questions).toReturn(new Error('error'), 'findOneAndUpdate');
    const result = await fetchAndIncrementQuestionViewsById('');

    expect(result).toEqual({ error: 'Error when fetching and updating a question' });

  });

  test('fetchAndIncrementQuestionViewsById returns question object', async () => {
    const question = _questions[0];
    const questionWithUpdatedViews = { ...question, views: question.views + 1 };
    mockingoose(Questions).toReturn(questionWithUpdatedViews, 'findOneAndUpdate');

    const result = await fetchAndIncrementQuestionViewsById('65e9b58910afe6e94fc6e6dc');
    expect((result as IQuestion)._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
    expect((result as IQuestion).views).toEqual(49);

  });

  // saveQuestion
  test('saveQuestion should save question with tag IDs', async () => {
    const currentQuestion: IQuestion = {
      _id: "test",
      title: 'How do I use async/await in JavaScript?',
      text: 'I need help understanding how to use async/await in JavaScript.',
      tags: [],
      answers: [],
      ask_date_time: new Date('2023-11-20T09:24:00'),
      asked_by: 'test',
      views: 0,
      votes: 0
    }
    mockingoose(Questions).toReturn(_questions[0], 'create');
    const result = await saveQuestion(currentQuestion);

    expect(result).toHaveProperty('_id');
    expect((result as IQuestion)._id).toBeDefined();
  });

  // saveAnswer
  test('saveAnswer should save answer', async () => {
    mockingoose(Questions).toReturn(_questions[0], 'findOne');
    mockingoose(Questions).toReturn({ ..._questions[0], answers: [_questions[0].answers, _ans3] }, 'save');
    const currentAnswer: IAnswer = {
      _id: "test",
      text: "test",
      ans_by: "test",
      ans_date_time: new Date('2023-11-20T09:24:00'),
      votes: 0
    }
    const result = await saveAnswer(currentAnswer);

    expect((result as IAnswer)._id).toBeDefined();
  });

  // getTagIds
  test('getTagIds should return list of tag ids', async () => {
    mockingoose(Tags).toReturn(_tag1, 'findOne');
    mockingoose(Tags).toReturn(_tag2, 'findOne');

    const result = await getTagIds(['react', 'javascript']);

    expect(result.length).toEqual(2);
  });

  test('getTagCountMap should return tag count map', async () => {
    mockingoose(Tags).toReturn([_tag1, _tag2, _tag3], 'find');
    const result = await getTagCountMap();

    if (result && !(result instanceof Map) && 'error' in result) {
      fail(`Expected a Map but got an error: ${result.error}`);
    } else if (result instanceof Map) {
      expect(result.get('react')).toEqual(0);
      expect(result.get('javascript')).toEqual(0);
      expect(result.get('android')).toEqual(0);
    } else {
      fail('Expected a Map but got null');
    }
  });

  test('getTagCountMap should return tag count map with the expected number of questions for each tag', async () => {
    mockingoose(Tags).toReturn([_tag1, _tag2, _tag3], 'find');
    mockingoose(Questions).toReturn(_questions, 'find');
    const result = await getTagCountMap();

    if (result && !(result instanceof Map) && 'error' in result) {
      fail(`Expected a Map but got an error: ${result.error}`);
    } else if (result instanceof Map) {
      expect(result.get('react')).toEqual(1);
      expect(result.get('javascript')).toEqual(2);
      expect(result.get('android')).toEqual(1);
    } else {
      fail('Expected a Map but got null');
    }
  });

  // insertNewUser

  // look into this
  test('should return user object', async () => {
    const user: IUser = {
      firstname: 'Newone',
      lastname: 'User',
      username: 'new_user12',
      email: 'new_user1230@gmail.com',
      password: 'Password@100',
      dob: new Date('2024-06-06'),
    };

    const savedUser = {
      ...user,
      _id: '675391d5f9dd11fc09b19106',
      createdAt: new Date('2024-12-07T00:07:49.290Z'),
      updatedAt: new Date('2024-12-07T00:07:49.290Z'),
      password: await bcrypt.hash(user.password, 10),
    };

    mockingoose(User).toReturn(null, 'findOne'); // No existing user
    mockingoose(User).toReturn(savedUser, 'save'); // Mock save

    const result = await insertNewUser(user);
    console.log("result: ", result);
    console.log("user: ", user);
    expect(result.password).not.toBe('Password@100');
  });

  test('should throw an error if email already exists', async () => {
    const user: IUser = {
      firstname: 'Newtwo',
      lastname: 'User',
      username: 'new_user',
      email: 'existing_user@gmail.com',
      password: 'Password@100',
      dob: new Date('2024-06-06'),
    };

    mockingoose(User).toReturn(user, 'findOne'); // Existing user with same email

    await expect(insertNewUser(user)).rejects.toThrow(
      'This email is already registered. Please use a different email or log in.'
    );
  });
  // look into this
  test('should throw an error if username already exists', async () => {
    const user1: IUser = {
      firstname: 'Newthreep',
      lastname: 'User',
      username: 'new_user',
      email: 'new_user890678@gmail.com',
      password: 'Password@100',
      dob: new Date('2024-06-06'),
    };
    const user2: IUser = {
      firstname: 'Newthreep',
      lastname: 'User',
      username: 'new_user',
      email: 'new_user890678@gmail.com',
      password: 'Password@100',
      dob: new Date('2024-06-06'),
    };

    mockingoose(User).toReturn(user1, 'findOne'); // Existing user with same username

    await expect(insertNewUser(user2)).rejects.toThrow(
      'This email is already registered. Please use a different email or log in.'
    );
  });

  test('should hash the password before saving the user', async () => {
    const user: IUser = {
      firstname: 'Newfour',
      lastname: 'User',
      username: 'new_user',
      email: 'new_user@gmail.com',
      password: 'Password@100',
      dob: new Date('2024-06-06'),
    };

    mockingoose(User).toReturn(null, 'findOne'); // No existing user
    mockingoose(User).toReturn(user, 'save'); // Mock save

    const result = await insertNewUser(user);
    const isPasswordHashed = await bcrypt.compare(user.password, result.password);
    expect(isPasswordHashed).toBe(true);
  });

});
