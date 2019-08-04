import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import storeRoot from './store';

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();
const history = syncHistoryWithStore(browserHistory, routingStore);
storeRoot.setRouting(routingStore);

const App = () => {
  return (
    <React.Fragment>
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={require('./page/index').default} />
          <Route path="/AStar-demo" exact component={require('./page/index').default} />
          <Route component={require('./page/404').default} />
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default App;
