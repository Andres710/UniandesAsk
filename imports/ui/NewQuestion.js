import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import { Questions } from '../api/questions.js';

import Navbar from './Navbar.js';

class NewQuestion extends Component {

  handleSubmit(event) {
    event.preventDefault();
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textQuestion).value.trim();
    console.log(text);

    const stringTags = ReactDOM.findDOMNode(this.refs.textQuestionTags).value.trim();
    const tags = stringTags.split(' ');

    if(text !== '' && tags.length > 0){
      Meteor.call('questions.insert', text, tags);
 
      // Clear form
      ReactDOM.findDOMNode(this.refs.textQuestion).value = '';
      ReactDOM.findDOMNode(this.refs.textQuestionTags).value = '';
      alert('Pregunta creada exitosamente!');
    } else{
      alert('Debes llenar todos los campos para preguntar.');
    }
    
    
    
  }

  render() {
    return (
      <div>
        <Navbar />
        <br/>
        <br/>
        {this.props.currentUser ? 
          <div className="container">
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
                size="100"
              />
              <br/>
              <label>Tags: </label>
              <br/>
              <input
                type="text"
                ref="textQuestionTags"
                placeholder="e.g. (campus cálculo admisiones)"
                size="100"
              />
              <br/>
              <br/>
              <button href='/' type="submit" className="btn btn-primary btn-lg btn-block">
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
