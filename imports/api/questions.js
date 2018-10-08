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
  'questions.insert'(title, tags, content){
    check(title, String);
    check(tags, [String]);
    check(content, String);


    if(!this.userId){
      throw new Meteor.Error('not-authorized');
    }

    Questions.insert({
      title,
      tags,
      content,
      createdAt: new Date(), // current time
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
      answers: [],
      qualifiers: [],
      score: 0
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
  'questions.upScore'(questionId){
    check(questionId, String);

    if(!this.userId){
      throw new Meteor.Error('not-authorized');
    }

    Questions.update(
      {_id:questionId},
      {
        $inc: {
          score: 1
        },
        $push: { qualifiers: this.userId }
      });

    const respuesta = Questions.findOne({_id:questionId});
    return respuesta;
  },
  'questions.downScore'(questionId){
    check(questionId, String);

    if(!this.userId){
      throw new Meteor.Error('not-authorized');
    }

    Questions.update(
      {_id:questionId},
      {
        $inc: { score: -1 },
        $push: { qualifiers: this.userId }
      });

    const respuesta = Questions.findOne({_id:questionId});
    return respuesta;
  },
});

