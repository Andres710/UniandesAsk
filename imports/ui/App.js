import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import {Questions} from '../api/questions.js';
import {Answers} from '../api/answers.js';

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

  removeTagFilter(event) {
    event.preventDefault();

    let newFilterTags = this.state.filterTags;
    console.log(event.target.value);
    const deleteTag = event.target.value;
    newFilterTags.splice(newFilterTags.indexOf(deleteTag), 1);

    this.setState({
      filterTags: newFilterTags
    });

  }

  renderFilterTags() {
    return this.state.filterTags.map((tag) => (
      <button type="button" className="btn btn-dark col-2 botonTag" key={tag} value={tag} onClick={this.removeTagFilter.bind(this)}>{tag}</button>
    ));
  }

  renderQuestions() {
    let filteredQuestions = this.props.questions;
    let currentTags = this.state.filterTags;
    if (currentTags.length > 0) {
      filteredQuestions = filteredQuestions.filter(question => {
        for (let i = 0; i < currentTags.length; i++) {
          if (!question.tags.includes(currentTags[i])) {
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
    if (this.state.filterTags.length > 0) {
      filters = (
        <div className="row">
          {this.renderFilterTags()}
        </div>
      );
    }
    return (
      <div className="backo">
        <Navbar/>
        <br/>
        <div className="container">
          <div className="jumbotron" id="jumboFiltro">
            <form onSubmit={this.addTagFilter.bind(this)}>
              <div className="form-row">
                <div className="col-4" id="filtra_label">
                  <label>Filtra por Tags:</label>
                </div>
                <div className="col-8">
                  <input type="text" className="form-control form-control-lg" id="colFormLabelLg" ref="textFilterTag"
                    placeholder="Agrega un tag"/>
                </div>
              </div>
            </form>
            <br/>
            {filters}
          </div>
          <div className="jumbotron">
            <h2>Preguntas</h2>
            {this.renderQuestions()}
          </div>
        </div>

      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('questions');

  return {
    questions: Questions.find({}, {sort: {createdAt: -1}}).fetch(),
    currentUser: Meteor.user(),
  };
})(App);
