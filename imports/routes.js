import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// containers
import App from './ui/App.js';


import NewQuestion from './ui/NewQuestion.js';
import QuestionDetail from './ui/QuestionDetail.js';

export const AppRoutes = () => (
  <Router>
    <div>
      <Route exact path='/' component={App}/>
      <Route exact path='/new' component={NewQuestion}/>
      <Route exact path='/question/:id' component={QuestionDetail}/>
    </div>
  </Router>
);