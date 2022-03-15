import React from 'react';
import { EasybaseProvider } from 'easybase-react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import ebconfig from './ebconfig';
import Header from "./Components/Header";
import About from './Pages/About';
import AddNote from './Pages/AddNote';
import SignIn from './Pages/SignIn';
import Home from './Pages/Home';
import FullNote from './Pages/FullNote'

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <EasybaseProvider ebconfig={ebconfig}>
      <div className="pag">
        <Router>
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/search/:phrase" component={Home} />
            <Route exact path="/about" component={About} />
            <Route exact path="/addNote" component={AddNote} />
            <Route exact path="/fullNote/:id" component={FullNote} />
            <Route exact path="/signIn"><SignIn /></Route>
          </Switch>
        </Router>
      </div>
    </EasybaseProvider>
  );
}

export default App;
