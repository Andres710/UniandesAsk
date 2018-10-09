import React, {Component} from 'react';
import Navbar from './Navbar.js';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import {Link} from 'react-router-dom';
import {Answers} from '../api/answers.js';

class QuestionDetail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentQuestion: {},
      currentUser: {},
      deleted: false,
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

  deleteThisQuestion() {
    Meteor.call('questions.remove', this.state.currentQuestion._id);
    this.setState({
      deleted: true,
    });
  }

  renderTags() {
    let questionTags = this.state.currentQuestion.tags;
    console.log(questionTags);
    return questionTags.map((tag, i) => (
      <div className="col" id="flexiGrow2">
        <button type="button" className="btn btn-dark botonTag3" key={"id" + i}>{tag}</button>
      </div>
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
    let claseH5 = "h5ScoreDetail";
    const respuestas = this.props.answers.filter(ans => ans.question === this.state.currentQuestion._id);
    return respuestas.map((ans, i) => (
      <div key={ans._id} className="container" id="infoRespContainer">
        <div className="row" id="filaSeparador">
          <div className="col-2" id="divScoreDetail">
            {usuarioRespuesta != null && ans.qualifiers !== undefined ?
              ans.qualifiers.filter(yo => yo === usuarioRespuesta._id).length === 0 ?
                <button className="btn" id="btnImgScoreUp" onClick={this.increaseAnswerScore.bind(this, ans._id)}>
                  <img src="/up.svg" className="imgScore" alt="up"/>
                </button> : '' : claseH5="Puntaje"}
            <h5 id={claseH5}>{ans.score}</h5>
            {usuarioRespuesta != null && ans.qualifiers !== undefined ?
              ans.qualifiers.filter(yo => yo === usuarioRespuesta._id).length === 0 ?
                <button className="btn" id="btnImgScoreDown" onClick={this.decreaseAnswerScore.bind(this, ans._id)}>
                  <img src="/down.svg" className="imgScore" alt="down"/>
                </button> : '' : ''}
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

    if (this !== undefined) {
      if (this.state.currentQuestion.title !== undefined) {
        let califique = this.state.currentQuestion.qualifiers;
        let usuarioPregunta = Meteor.user();
        let usernameOwner = this.state.currentQuestion.username;
        let yoEstoy = [];
        let mostrar = false;
        let mostrarBorrar = false;
        if (usuarioPregunta != null) {
          yoEstoy = califique.filter(yo => yo === usuarioPregunta._id);

          if (usuarioPregunta.username === usernameOwner) {
            mostrarBorrar = true;
          }

          if (yoEstoy.length === 0)
            mostrar = true;
        }
        let question = this.state.currentQuestion;
        let claseH5 = "h5ScoreDetail";
        if (!mostrar)
          claseH5 = "h5ScoreSolo"
        return (
          <div>
            <Navbar/>
            <br/>
            <div className="container detail-container">
              {mostrarBorrar ?
                <button id="botonEliminarFinal" className="btn rounded-circle btn-danger btn-form" onClick={this.deleteThisQuestion.bind(this)}>&times;</button> : ''}
              <div className="jumbotron" id="jumboDetail">
                <h2 id="h2Detail">{this.state.currentQuestion.title}</h2>
              </div>
              <div className="container" id="infoPregContainer">
                <div className="row">
                  <div className="col-2" id="divScoreDetail">
                    //El usuario que crea una pregunta puede poner up a la respuesta. Mejor manejar excepción
                    {mostrar ? <button className="btn" id="btnImgScoreUp" onClick={this.increaseScore.bind(this)}>
                      <img src="/up.svg" className="imgScore" alt="up"/>
                    </button> : ''}
                    <h5 id={claseH5}>{this.state.currentQuestion.score}</h5>
                    {mostrar ? <button className="btn" id="btnImgScoreDown" onClick={this.decreaseScore.bind(this)}>
                      <img src="/down.svg" className="imgScore" alt="down"/>
                    </button> : ''}
                  </div>
                  <div className="col-10" id="divTextDetail">
                    <p className="textoDetail">{this.state.currentQuestion.content}</p>
                    <p className="usernameDetail">Asker: {question.username}</p>
                    <p className="usernameDetail">Date: {question.createdAt.toDateString()}</p>
                    <div className="row">
                      {this.state.currentQuestion.tags !== undefined ? this.renderTags() : ''}
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
              {usuarioPregunta ?
                <div className="jumbotron" id="jumboAgregar">
                  <h5 id="h5Respuestas">Responder Pregunta</h5>
                  <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
                    <input placeholder="Redacta la respuesta que le quieres dar al usuario"
                              type="text"
                              className="letraBonita form-control" cols="20" rows="4"
                              ref={(textIn) => this.textIn = textIn}/>
                  </form>
                </div> : ''}
              {this.mostrarRespuestas()}
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
  Meteor.subscribe('questions');

  return {
    answers: Answers.find({}, {sort: {score: -1}}).fetch(),
    currentUser: Meteor.user()
  };
})(QuestionDetail);
