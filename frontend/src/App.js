import React,{Component} from 'react';
import {Route, Redirect, Router} from 'react-router-dom'
import Signup from './component/signup'
import Login from './component/userlogin'
import Home from './component/home'
import Details from './component/details'
import Showbookings from './component/showbooking'
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  render(){
    return (
      <div>
        <Route path="/" exact component={Login}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/home" component={Home}/>
        <Route path="/details/:car_id" render={(props) => <Details {...props}/>}/>
        <Route path="/cart" component={Showbookings}/>
      </div>
    );
  }
}

export default App