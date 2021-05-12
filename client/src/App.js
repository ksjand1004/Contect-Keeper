import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Home from "./components/pages/Home";
import About from "./components/pages/About";

import ContactState from "./context/contact/ContactState";
import "./App.css";

const App = () => {
  return (
    <ContactState>
      <Router>
        <Fragment>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/about" component={About} />
            </Switch>
          </div>
        </Fragment>
      </Router>
    </ContactState>
  );
};

export default App;

/*
코딩 순서
1. 기본 구성
2. 필요한 components 생성 및 import
3. react-router-dom 생성
4. App.js에서 먼저 선언하고 해당 컴포넌트, Router을 제작
5. 하드코딩 -> API 리팩토링
*/
