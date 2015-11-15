import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import AddCharacter from './components/AddCharacter';
import AddPlace from './components/AddPlace';
import Place from './components/Place'

export default (
  <Route component={App}>
    <Route path='/' component={Home} />
    <Route path='/add' component={AddPlace} />
    <Route path='/places/:name' component={Place} />
  </Route>
);