import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import './styles/Question.css';

import { Questions } from '../api/questions.js';

import Navbar from './Navbar.js';
import Question from './Question.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterTags: []
    };
  }

  addTagFilter(event) {
    event.preventDefault();

    let newFilterTags = this.state.filterTags;
    const newTag = ReactDOM.findDOMNode(this.refs.textFilterTag).value.trim();
    console.log(newTag);
    newFilterTags.push(newTag);

    this.setState({
      filterTags: newFilterTags
    });

    ReactDOM.findDOMNode(this.refs.textFilterTag).value = '';

  }

  renderFilterTags() {
    return this.state.filterTags.map((tag) => (
      <li key={tag}>{tag} </li>
    ));
  }

  renderQuestions() {
    let filteredQuestions = this.props.questions;
    let currentTags = this.state.filterTags;
    if(currentTags.length > 0) {
      filteredQuestions = filteredQuestions.filter(question => {
        for(let i = 0; i < currentTags.length; i++) {
          if(!question.tags.includes(currentTags[i])){
            return false;
          }
        }
        return true;
      });
    } 
    return filteredQuestions.map((question) => (
      <Question key={question._id} question={question}/>
    ));
  }

  render() {
    let filters;
    if(this.state.filterTags.length > 0) {
      filters = (
        <div className="container">
          <ul className="horizontal-list">
            <li>Tags: </li>
            {this.renderFilterTags()}
          </ul>
          <br/>
        </div>
      );
    }

    return (
      <div>
        <Navbar />
        <br/>
        <br/>

        <div className="container">
          <div className="container">
            <h3>
              Busca por tags:
            </h3>
            <form className="new-tag-filter" onSubmit={this.addTagFilter.bind(this)}>
              <input
                type="text"
                ref="textFilterTag"
                placeholder="Agrega un tag"
                size="20"
              />
            </form>
          </div>

          {filters}

          {this.renderQuestions()}
          
        </div>

      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('questions');

  return {
    questions: Questions.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user(),
  };
})(App);
