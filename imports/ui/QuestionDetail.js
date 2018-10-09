import React, {Component} from 'react';
import Navbar from './Navbar.js';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import {Answers} from '../api/answers.js';

import PropTypes from 'prop-types';
import { Questions } from '../api/questions.js';

class QuestionDetail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      deleted: false,
    };
  }

  deleteThisQuestion() {
    Meteor.call('questions.remove', this.props.question._id);
    this.setState({
      deleted: true,
    });
  }

  renderTags() {
    let questionTags = this.props.question.tags;
    console.log(questionTags);
    return questionTags.map((tag, i) => (
      <div className="col"  key={i} id="flexiGrow2">
        <button type="button" className="btn btn-dark botonTag3">{tag}</button>
      </div>
    ));
  }

  handleSubmit(event) {
    event.preventDefault();
    const answer = this.textIn.value.trim();
    Meteor.call('answer.insert', answer, this.props.question._id);
    this.textIn.value = '';
  }

  mostrarRespuestas() {
    //let yoEstoy = [];
    //let mostrar = false;
    //if (this.props.currentUser != null && this.props.answers.qualifiers) {
    //  yoEstoy = this.props.answers.qualifiers.filter(yo => yo === this.props.currentUser._id);
    //  if (yoEstoy.length === 0)
    //    mostrar = true;
    //}
    let claseH5 = 'h5ScoreDetail';
    const respuestas = this.props.answers.filter(ans => ans.question === this.props.question._id);
    return respuestas.map((ans) => (
      <div key={ans._id} className="container" id="infoRespContainer">
        <div className="row" id="filaSeparador">
          <div className="col-2" id="divScoreDetail">
            {this.props.currentUser && ans.qualifiers ?
              ans.qualifiers.filter(yo => yo === this.props.currentUser._id).length === 0 ?
                <button className="btn" id="btnImgScoreUp" onClick={this.increaseAnswerScore.bind(this, ans._id)}>
                  <img src="/up.svg" className="imgScore" alt="up"/>
                </button> : null : claseH5='Puntaje'}
            <h5 id={claseH5}>{ans.score}</h5>
            {this.props.currentUser && ans.qualifiers ?
              ans.qualifiers.filter(yo => yo === this.props.currentUser._id).length === 0 ?
                <button className="btn" id="btnImgScoreDown" onClick={this.decreaseAnswerScore.bind(this, ans._id)}>
                  <img src="/down.svg" className="imgScore" alt="down"/>
                </button> : null : null}
          </div>
          <div className="col-10" id="divTextDetail">
            <p className="textoDetail">{ans.text}</p>
            <p className="usernameDetail">Publisher: {ans.username}</p>
            <p className="usernameDetail">Date: {ans.createdAt.toDateString()}</p>
          </div>
        </div>
      </div>
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

  increaseAnswerScore(answer) {
    Meteor.call('answer.upScore', answer);
  }

  decreaseAnswerScore(answer) {
    Meteor.call('answer.downScore', answer);
  }

  render() {
    let deleted = this.state.deleted;
    if (deleted) {
      return (
        <div>
          <Navbar/>
          <br/>
          <br/>

          <div className="container detail-container">
            <h3>Pregunta Eliminada Exitosamente</h3>
            <br/>
            <br/>
            <h5><a href="/">Regresar a la lista de preguntas.</a></h5>
          </div>

        </div>
      );

    }

    if (this.props.question) {
      if (this.props.question.title) {
        let califique = this.props.question.qualifiers;
        let usernameOwner = this.props.question.username;
        let yoEstoy = [];
        let mostrar = false;
        let mostrarBorrar = false;
        if (this.props.currentUser) {
          yoEstoy = califique.filter(yo => yo === this.props.currentUser._id);

          if (this.props.currentUser.username === usernameOwner) {
            mostrarBorrar = true;
          }

          if (yoEstoy.length === 0)
            mostrar = true;
        }
        let question = this.props.question;
        let claseH5 = 'h5ScoreDetail';
        if (!mostrar)
          claseH5 = 'h5ScoreSolo';
        return (
          <div>
            <Navbar/>
            <br/>
            <div className="container detail-container">
              {mostrarBorrar ?
                <button id="botonEliminarFinal" className="btn rounded-circle btn-danger btn-form" onClick={this.deleteThisQuestion.bind(this)}>&times;</button> : null}
              <div className="jumbotron" id="jumboDetail">
                <h2 id="h2Detail">{this.props.question.title}</h2>
              </div>
              <div className="container" id="infoPregContainer">
                <div className="row">
                  <div className="col-2" id="divScoreDetail">
                    {mostrar ? <button className="btn" id="btnImgScoreUp" onClick={this.increaseScore.bind(this)}>
                      <img src="/up.svg" className="imgScore" alt="up"/>
                    </button> : null}
                    <h5 id={claseH5}>{this.props.question.score}</h5>
                    {mostrar ? <button className="btn" id="btnImgScoreDown" onClick={this.decreaseScore.bind(this)}>
                      <img src="/down.svg" className="imgScore" alt="down"/>
                    </button> : null}
                  </div>
                  <div className="col-10" id="divTextDetail">
                    <p className="textoDetail">{this.props.question.content}</p>
                    <p className="usernameDetail">Asker: {question.username}</p>
                    <p className="usernameDetail">Date: {question.createdAt.toDateString()}</p>
                    <div className="row">
                      {this.props.question.tags? this.renderTags() : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br/>
            <div className="container detail-container">
              <div className="jumbotron" id="jumboDetail">
                <h2 id="h2Detail">Respuestas</h2>
              </div>
              {this.props.currentUser ?
                <div className="jumbotron" id="jumboAgregar">
                  <h5 id="h5Respuestas">Responder Pregunta</h5>
                  <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
                    <input placeholder="Redacta la respuesta que le quieres dar al usuario"
                      type="text"
                      className="letraBonita form-control" cols="20" rows="4"
                      ref={(textIn) => this.textIn = textIn}/>
                  </form>
                </div> : null}
              {this.mostrarRespuestas()}
            </div>
          </div>
        );
      }
      else
        return <div>Cargando</div>;
    }
    return null;
  }
}

QuestionDetail.propTypes = {
  answers: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
  question: PropTypes.object,
};

export default withTracker((props) => {
  Meteor.subscribe('answers');
  Meteor.subscribe('questions');
  return {
    answers: Answers.find({}, {sort: {score: -1}}).fetch(),
    question: Questions.findOne({_id: props.match.params.id}),
    currentUser: Meteor.user(),
  };
})(QuestionDetail);
