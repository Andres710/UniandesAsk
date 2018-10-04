import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Questions = new Mongo.Collection('questions');

if(Meteor.isServer){
  Meteor.publish('questions', function questionsPublication() {
    return Questions.find();
  });
}

Meteor.methods({
  'questions.insert'(text, tags){
    check(text, String);
    check(tags, [String]);


    if(!this.userId){
      throw new Meteor.Error('not-authorized');
    }

    Questions.insert({
      text,
      tags,
      createdAt: new Date(), // current time
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
      answers: []
    });
  },
  'questions.remove'(questionId){
    check(questionId, String);

    const question = Questions.findOne(questionId);

    if (question.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Questions.remove(questionId);
  },
});

