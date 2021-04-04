import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import HomePage from './HomePage';

const App: React.FC = () => (
  <Router>
    <Switch>
      <Route path="/:room">
        <div>Room page</div>
      </Route>
      <Route path="/">
        <HomePage />
      </Route>
    </Switch>
  </Router>
);

export default App;
