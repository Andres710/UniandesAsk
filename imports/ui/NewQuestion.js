import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import {Link} from 'react-router-dom';

import {Questions} from '../api/questions.js';

import Navbar from './Navbar.js';

class NewQuestion extends Component {

  constructor(props){
    super(props);

    this.state = {
      finished: false,
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    // Find the text field via the React ref
    const title = ReactDOM.findDOMNode(this.refs.textQuestion).value.trim();
    console.log(title);

    const stringTags = ReactDOM.findDOMNode(this.refs.textQuestionTags).value.trim();
    const tags = stringTags.split(' ');

    const content = ReactDOM.findDOMNode(this.refs.textContentQuestion).value.trim();
    console.log(content);

    if (title !== '' && tags.length > 0) {
      Meteor.call('questions.insert', title, tags, content);

      // Clear form
      ReactDOM.findDOMNode(this.refs.textQuestion).value = '';
      ReactDOM.findDOMNode(this.refs.textQuestionTags).value = '';
      ReactDOM.findDOMNode(this.refs.textContentQuestion).value = '';

      //alert('Pregunta creada correctamente!');
      this.setState({
        finished: true,
      });

    } else {
      alert('Debes llenar todos los campos para preguntar.');
    }


  }

  render() {
    let finished = this.state.finished;
    if(finished){
      return (
        <div>
          <Navbar/>
          <br/>
          <br/>

          <div className="container detail-container">
            <h3>Pregunta Creada Exitosamente</h3>
            <br/>
            <br/>
            <h5><a href="/">Regresar a la lista de preguntas.</a></h5>
          </div>

        </div>
      );

    }

    return (
      <div>
        <Navbar/>
        <br/>
        <br/>
        {this.props.currentUser ?
          <div id="contenedorNuevaPreg" className="container form-container">
            <div className="row">
              <div className="col-7">
                <div className="form-title">
                  <h3 className="letraBonita">Realiza una pregunta</h3>
                </div>
                <form className="new-question" onSubmit={this.handleSubmit.bind(this)}>
                  <label className="letraBonita">Titulo: </label>
                  <br/>
                  <input
                    className="letraBonita form-control"
                    type="text"
                    ref="textQuestion"
                    placeholder="Agrega un titulo llamativo a tu pregunta"
                    size="70"
                    maxLength="30"
                  />
                  <br/>
                  <label className="letraBonita">Tags: </label>
                  <br/>
                  <input
                    className="form-control"
                    type="text"
                    ref="textQuestionTags"
                    placeholder="e.g. (campus cálculo admisiones)"
                    size="70"
                  />
                  <br/>
                  <br/>
                  <label className="letraBonita">Pregunta detallada: </label>
                  <br/>
                  <textarea placeholder="Redacta la pregunta que quieres realizar"
                            className="letraBonita form-control" cols="70" rows="4" ref="textContentQuestion"/>
                  <br/>
                  <br/>
                  <button type="submit" className="letraBonita btn btn-light btn-form">
                    Preguntar
                  </button>
                </form>
              </div>
              <div className="col-5">
                <img src="phraseImg.png" alt="imagen" id="imgNew"/>
              </div>
            </div>
          </div> : ''
        }
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('questions');

  return {
    currentUser: Meteor.user(),
  };
})(NewQuestion);
