import React, { Component } from 'react';
import './styles/Question.css';

import Navbar from './Navbar.js';


export default class QuestionDetail extends Component {

  constructor(props){
    super(props);

    this.state = {
      currentQuestion : {}
    };
  }

  componentDidMount() {
    const { currentQuestion } = this.props.location.state;
 
    this.setState({
      currentQuestion: currentQuestion,
    });
  }

  renderTags() {
    let questionTags = this.state.currentQuestion.tags;
    console.log(questionTags);
    return questionTags.map((tag) => (
      <li key={tag}>{tag} </li>
    ));



  }

  
  render() {
    let question = this.state.currentQuestion;
    return (
      <div>
        <Navbar/>
        <br/>
        <br/>

        <h3>{question.text}</h3>
        <ul className="horizontal-list">
          <li>Tags: </li>
          {question.tags !== undefined ? this.renderTags() : ''}
        </ul>
        <h4>Preguntado por: {question.username}</h4>
      </div>
    );
  }
}
