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
    }
  }

  deleteThisQuestion() {
    Meteor.call('questions.remove', this.props.question._id);
  }

  renderTags() {
    return this.props.question.tags.map((tag, i) => (
      <div className="col flexiGrow">
        <button type="button" className="btn btn-dark disabled botonTag2" key={"id"+i}>{tag}</button>
      </div>
    ));
  }

  render() {

    return (
      <div className="col-6">
        <Link id="linkQuestion" className="hvr-icon-rotate" to={{
          pathname: `question/${this.props.question._id}`,
          state: {
            currentQuestion: this.props.question,
            currentUser: Meteor.user()
          }
        }}>
          <div id="containerTags" className="container">
            <div className="row">
              {this.renderTags()}
            </div>
          </div>
          <div className="questionContainer">
            <div className="row">
              <div id="iconoArchive" className="col-3">
                <img src="archive.svg" alt="archivador" className="hvr-icon"></img>
              </div>
              <div className="col-3" id="scoreDiv">
                <h5 id="h5Score">Score</h5>
                <p id="puntaje">{this.props.question.score}</p>
              </div>
              <div className="col-6 text-center">
                <p id="textoPregunta">{this.props.question.title}</p>
                <p id="usuarioFecha">{this.props.question.createdAt.toDateString()}</p>
                <p id="usuarioPregunta">{this.props.question.username}</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

