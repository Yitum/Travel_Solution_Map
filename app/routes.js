import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import AddCharacter from './components/AddCharacter';
import AddPlace from './components/AddPlace';

export default (
  <Route component={App}>
    <Route path='/' component={Home} />
    <Route path='/add' component={AddPlace} />
  </Route>
);