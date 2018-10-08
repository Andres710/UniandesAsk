import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import {Link} from 'react-router-dom';

export default class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      onChange: props.onChange
    };
  }

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark sticky-top">
        <a className="navbar-brand nav-link hvr-underline-from-center" href="/">Uniandes Ask</a>
        <div className="row" id="">
          {!!Meteor.user() ? <div className="col nav-item">
            
            <Link className="nav-link hvr-underline-from-center" to="/new">Crear pregunta</Link>
          </div> : ''}
          <div className="col nav-item">
            <AccountsUIWrapper/>
          </div>
        </div>
      </nav>
    );
  }
}