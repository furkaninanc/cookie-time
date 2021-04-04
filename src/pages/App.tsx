import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

const App: React.FC = () => (
  <Router>
    <Switch>
      <Route path="/:room">
        <div>Room page</div>
      </Route>
      <Route path="/">
        <div>Home page</div>
      </Route>
    </Switch>
  </Router>
);

export default App;
