import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import HomePage from './HomePage';
import RoomPage from './RoomPage';

const App: React.FC = () => (
  <Router>
    <Switch>
      <Route path="/:room">
        <RoomPage />
      </Route>
      <Route path="/">
        <HomePage />
      </Route>
    </Switch>
  </Router>
);

export default App;
