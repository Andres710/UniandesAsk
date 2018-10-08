import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import {Questions} from '../api/questions.js';

export default class Question extends Component {

  constructor(props) {
    super(props);

    this.state = {
      answer: ''
    };
  }

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
          <h1>
            <Link to={{
              pathname: `question/${this.props.question._id}`,
              state: {
                currentQuestion: this.props.question,
                currentUser: Meteor.user()
              }
            }}>
              {this.props.question.title}
            </Link>
          </h1>
        </div>
        <div className="rows">
          <ul className="horizontal-list">
            <li>Tags:</li>
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
}


