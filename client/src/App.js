import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Welcome from './components/welcome/Welcome';
import Login from './components/login/Login';
import Register from './components/register/Register';

function App() {
  return (
    <div className="App">
        <Router>
          <div className="header">
              <ul>
                  <li><Link to="/">Home</Link></li>
                 
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/register">Register</Link></li>
              </ul>
          </div>
          <div className="showComponent">
              <Switch>
                <Route path="/" exact component={Welcome} />
                <Route path="/welcome:token?" component={Welcome} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
              </Switch>
          </div>
      </Router>
    </div>
  );
}

export default App;
