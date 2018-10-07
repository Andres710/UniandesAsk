import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {Questions} from "./questions";

export const Answers = new Mongo.Collection('answers');

if (Meteor.isServer) {
  Meteor.publish('answers', function questionsPublication() {
    return Answers.find();
  });
}

Meteor.methods({
  'answer.insert'(text, questionId) {
    check(questionId, String);
    check(text, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Answers.insert({
      text: text,
      question: questionId,
      createdAt: new Date(), // current time
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
      qualifiers: [],
      score: 0
    });
  },
  'answer.upScore'(answerId) {
    check(answerId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Answers.update(
      {_id: answerId},
      {
        $inc: {score: 1},
        $push: {qualifiers: this.userId}
      });
  },
  'answer.downScore'(answerId) {
    check(answerId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Answers.update(
      {_id: answerId},
      {
        $inc: {score: -1},
        $push: {qualifiers: this.userId}
      });
  },
});