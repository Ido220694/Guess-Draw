import React from 'react';
import {Router, Route} from 'react-router-dom';
import history from './history';
import WelcomeView from './components/WelcomeView';
import Game from './components/Game';
import './components/App.css'
const App = () =>{
    return (<div className='App'>
        <Router history={history}>
            <Route path="/" exact component={WelcomeView}/>
            <Route path="/play" exact component={Game}/>
        </Router>
    </div>
    );
};

export default App;