import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import { Questions } from '../api/questions.js';

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

    if(title !== '' && tags.length > 0){
      Meteor.call('questions.insert', title, tags, content);
 
      // Clear form
      ReactDOM.findDOMNode(this.refs.textQuestion).value = '';
      ReactDOM.findDOMNode(this.refs.textQuestionTags).value = '';
      ReactDOM.findDOMNode(this.refs.textContentQuestion).value = '';

      //alert('Pregunta creada correctamente!');
      this.setState({
        finished: true,
      });

    } else{
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
        <Navbar />
        <br/>
        <br/>
        {this.props.currentUser ? 
          <div className="container form-container">
            <div className="form-title">
              <h3>Realiza una pregunta</h3>
            </div>
            <form className="new-question" onSubmit={this.handleSubmit.bind(this)} >
              <label>Pregunta: </label>
              <br/>
              <input
                type="text"
                ref="textQuestion"
                placeholder="Cuál es tu pregunta?"
                size="70"
                maxLength="30"
              />
              <br/>
              <label>Tags: </label>
              <br/>
              <input
                type="text"
                ref="textQuestionTags"
                placeholder="e.g. (campus cálculo admisiones)"
                size="70"
              />
              <br/>
              <br/>
              <label>Contenido: </label>
              <br/>
              <textarea cols="70" rows="4" ref="textContentQuestion"/>
              <br/>
              <br/>
              <button type="submit" className="btn btn-primary btn-form">
                Preguntar
              </button>
              
            </form>
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
