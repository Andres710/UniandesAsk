import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import './styles/Question.css';
import { Link } from 'react-router-dom';


import { Questions } from '../api/questions.js';

export default class Question extends Component {

  deleteThisQuestion() {
    Meteor.call('questions.remove', this.props.question._id);
  }


  renderTags() {
    return this.props.question.tags.map((tag) => (
      <li key={tag}>{tag} </li>
    ));
  }

  render() {
    return (
      <div className="container questionContainer">
        <div className="rows">
          <Link to={{
            pathname: `question/${this.props.question._id}`, 
            state: {
              currentQuestion: this.props.question,
            }
          }}>
            {this.props.question.text}
          </Link>
        </div>
        <div className="rows">
          <ul className="horizontal-list">
            <li>Tags: </li>
            {this.renderTags()}
          </ul>
          <div className="col-md-6">
            Realizada por: {this.props.question.username}
            <button className="delete" onClick={this.deleteThisQuestion.bind(this)}>
              &times;
            </button>
          </div>
        </div>

      </div>
    );
  }

  // render() {
  //   return (
  //     <li>
  //       {this.props.question.text} by: <strong>{this.props.question.username}</strong>

  //       <button className="delete" onClick={this.deleteThisQuestion.bind(this)}>
  //         &times;
  //       </button>
  //     </li>
  //   );
  // }
}
