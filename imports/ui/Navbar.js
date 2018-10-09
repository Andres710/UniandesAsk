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
        <a className="letraBonita navbar-brand nav-link hvr-icon-grow" href="/">
          <img id="imgBrand" className="hvr-icon" src="/archive.svg" alt="brand"/>
          Uniandes Ask
        </a>
        <div className="row" id="">
          {!!Meteor.user() ? <div className="col nav-item">
            
            <Link className="nav-link hvr-underline-from-center" to="/new">Crear pregunta</Link>
          </div> : ''}
          <div className="col nav-item">
      // Este accountUIWrapper esta mal colocado porque cuando sale la pagina, hay que scroll hacia la derecha para ver toda la información de usuario
            <AccountsUIWrapper/>
          </div>
        </div>
      </nav>
    );
  }
}
