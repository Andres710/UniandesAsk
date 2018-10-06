import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import { NavLink } from 'react-router-dom';

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      onChange: props.onChange
    };
  }
  
  render() {
    return (
      <nav className="navbar navbar-expand-sm bg-light navbar-light">

        <a className="navbar-brand" href="/">Uniandes Ask</a>
  
        <ul className="navbar-nav">
          {!!Meteor.user()?<li className="nav-item">
            <a className="nav-link" href="new">Crear pregunta</a>
          </li>:''}
          <li className="nav-item">
            <a className="nav-link" href="#">Link 2</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Link 3</a>
          </li>
          <li className="nav-item">
            <AccountsUIWrapper />
          </li>
        </ul>
      </nav>
    );
  }
}