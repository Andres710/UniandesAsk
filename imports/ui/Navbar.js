import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import {Link} from 'react-router-dom';
import {withTracker} from 'meteor/react-meteor-data';

import PropTypes from 'prop-types';

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark bg-dark sticky-top">
        <a className="letraBonita navbar-brand nav-link hvr-icon-grow" href="/">
          <img id="imgBrand" className="hvr-icon" src="/archive.svg" alt="brand"/>
          Uniandes Ask
        </a>
        <div className="row" id="">
          {this.props.currentUser ? <div className="col nav-item">
            
            <Link className="nav-link hvr-underline-from-center" to="/new">Crear pregunta</Link>
          </div> : null}
          <div className="col nav-item">
            <AccountsUIWrapper/>
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  currentUser: PropTypes.object,
};

export default withTracker(() => {
  return {
    currentUser: Meteor.user(),
  };
})(Navbar);
