import React, {Component} from 'react';
import Navbar from './Navbar.js';
import {Meteor} from "meteor/meteor";
import {withTracker} from "meteor/react-meteor-data";
import {Answers} from '../api/answers.js';

class QuestionDetail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentQuestion: {},
      currentUser: {}
    };
  }

  componentDidMount() {
    const currentQuestion = this.props.location.state.currentQuestion;
    const currentUser = this.props.currentUser;

    this.setState({
      currentQuestion: currentQuestion,
      currentUser: currentUser
    });
  }

  renderTags() {
    let questionTags = this.state.currentQuestion.tags;
    console.log(questionTags);
    return questionTags.map((tag) => (
      <li key={tag}>{tag} </li>
    ));
  }

  handleSubmit(event) {
    event.preventDefault();
    const answer = this.textIn.value.trim();
    Meteor.call('answer.insert', answer, this.state.currentQuestion._id);
    this.textIn.value = '';
  }

  mostrarRespuestas() {
    let usuarioRespuesta = Meteor.user();
    let yoEstoy = [];
    let mostrar = false;
    // if (usuarioRespuesta != null && this.props.answers.qualifiers!== undefined) {
    //   yoEstoy = this.props.answers.qualifiers.filter(yo => yo === usuarioRespuesta._id);
    //   if (yoEstoy.length === 0)
    //     mostrar = true;
    // }
    const respuestas = this.props.answers.filter(ans => ans.question === this.state.currentQuestion._id);
    return respuestas.map((ans, i) => (
      <li key={i}>
        <div>
          {usuarioRespuesta != null && ans.qualifiers !== undefined ?
            ans.qualifiers.filter(yo => yo === usuarioRespuesta._id).length === 0 ?
              <button className="" onClick={this.increaseAnswerScore.bind(this, ans._id)}>
                &#8896;
              </button> : '' : ''}
          Score: {ans.score}.
          {usuarioRespuesta != null && ans.qualifiers !== undefined ?
            ans.qualifiers.filter(yo => yo === usuarioRespuesta._id).length === 0 ?
              <button className="" onClick={this.decreaseAnswerScore.bind(this, ans._id)}>
                &#8897;
              </button> : '' : ''}
          Respuesta: {ans.text}. Publicación: {ans.username}.
        </div>
      </li>
    ));
  }

  increaseScore(event) {
    event.preventDefault();
    Meteor.call('questions.upScore', this.state.currentQuestion._id, (err, question) => {
      if (err) {
      }
      this.setState({currentQuestion: question});
    });
  }

  decreaseScore(event) {
    event.preventDefault();
    Meteor.call('questions.downScore', this.state.currentQuestion._id, (err, question) => {
      if (err) {
      }
      this.setState({currentQuestion: question});
    });
  }

  increaseAnswerScore(answer) {
    Meteor.call('answer.upScore', answer);
  }

  decreaseAnswerScore(answer) {
    Meteor.call('answer.downScore', answer);
  }

  render() {
    if (this !== undefined) {
      if (this.state.currentQuestion.text !== undefined) {
        let califique = this.state.currentQuestion.qualifiers;
        let usuarioPregunta = Meteor.user();
        let yoEstoy = [];
        let mostrar = false;
        if (usuarioPregunta != null) {
          yoEstoy = califique.filter(yo => yo === usuarioPregunta._id);
          if (yoEstoy.length === 0)
            mostrar = true;
        }
        let question = this.state.currentQuestion;
        return (
          <div>
            <Navbar/>
            <br/>
            <br/>

            {mostrar ? <button className="" onClick={this.increaseScore.bind(this)}>
              &#8896;
            </button> : ''}
            <h5>{this.state.currentQuestion.score}</h5>
            {mostrar ? <button className="" onClick={this.decreaseScore.bind(this)}>
              &#8897;
            </button> : ''}
            <h3>{this.state.currentQuestion.text}</h3>
            <ul className="horizontal-list">
              <li>Tags:</li>
              {this.state.currentQuestion.tags !== undefined ? this.renderTags() : ''}
            </ul>
            <h4>Preguntado por: {question.username}</h4>
            <div>
              {!!usuarioPregunta ? <div>
                <h5>Responder Pregunta</h5>
                < form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
                  <input
                    type="text"
                    ref={(textIn) => this.textIn = textIn}
                    placeholder='Type to add new answer'
                  />
                </form>
              </div> : ''}
              <h2>Respuestas:</h2>
              <ul>
                {this.mostrarRespuestas()}
              </ul>
            </div>
          </div>
        );
      }
      else
        return <div>Cargando</div>;
    }
  }
}

export default withTracker(() => {
  Meteor.subscribe('answers');

  return {
    answers: Answers.find({}, {sort: {score: -1}}).fetch(),
    currentUser: Meteor.user()
  };
})(QuestionDetail);
