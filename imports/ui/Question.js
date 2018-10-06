import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import './styles/Question.css';
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
    return this.props.question.tags.map((tag) => (
      <li key={tag}>{tag} </li>
    ));
  }

  handleSubmit(event) {
    event.preventDefault();
    const answer = this.textIn.value.trim();
    Meteor.call('questions.answer', this.props.question._id, answer, Meteor.user().username);
    this.textIn.value = '';
  }

  mostrarRespuestas() {
    return this.props.question.answers.map((ans, i) => (
      <li key={i}>
        Respuesta: {ans.text}. Publicación: {ans.publisher}.
      </li>
    ));
  }

  increaseScore(event) {
    event.preventDefault();
    Meteor.call('questions.upScore', this.props.question._id);
  }

  decreaseScore(event) {
    event.preventDefault();
    Meteor.call('questions.downScore', this.props.question._id);
  }

  render() {
    let califique = this.props.question.qualifiers;
    let usuarioPregunta = Meteor.user();
    let yoEstoy;
    let mostrar = false;
    if (usuarioPregunta!==null) {
      mostrar = true;
      yoEstoy = califique.filter(yo => yo === Meteor.user()._id);
      if (yoEstoy.length > 0) mostrar = false;
    }

    return (
      <div className="container questionContainer">
        <div className="rows">
          <h1>
            <Link to={{
              pathname: `question/${this.props.question._id}`,
              state: {
                currentQuestion: this.props.question,
              }
            }}>
              {this.props.question.text}
            </Link>
          </h1>
        </div>
        <div className="rows">
          {mostrar ? <button className="" onClick={this.increaseScore.bind(this)}>
            &#8896;
          </button> : ''}
          <h5>{this.props.question.score}</h5>
          {mostrar ? <button className="" onClick={this.decreaseScore.bind(this)}>
            &#8897;
          </button> : ''}
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
          <div>
            <h5>Responder Pregunta</h5>
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
              <input
                type="text"
                ref={(textIn) => this.textIn = textIn}
                placeholder="Type to add new answer"
              />
            </form>
            <ul>
              {this.mostrarRespuestas()}
            </ul>
          </div>
        </div>

      </div>
    );
  }
}


