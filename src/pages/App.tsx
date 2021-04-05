import { useState } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import { AuthContext, IAuth } from '../contexts/AuthContext';
import HomePage from './HomePage';
import RoomPage from './RoomPage';

const App: React.FC = () => {
  const [auth, setAuth] = useState<IAuth>({
    username: localStorage.username || '',
    room: localStorage.room || '',
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <Router basename="cookie">
        <Switch>
          <Route path="/:room">
            <RoomPage />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
