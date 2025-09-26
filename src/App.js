import './App.css';
import React, { Component } from 'react'
import Navbar from './component/Navbar';
import News from './component/News';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingBar from "react-top-loading-bar";

export default class App extends Component {
  pageSize = 8
  apiKey = process.env.REACT_APP_NEWS_API

  state={
    progress: 0
  }
  setProgress = (progress) => {
    this.setState({progress: progress})
  }
  render() {
    return (
      <div>
        <Router>
          <Navbar />
          <LoadingBar
            color="#f11946"
            height={3}
            progress={this.state.progress}
          />
          <Routes>
            <Route exact path='/' element={<News key="home" setProgress={this.setProgress} apiKey={this.apiKey} pageSize={this.pageSize} country="us" category='General' />} />
            <Route exact path='/business' element={<News key="business" setProgress={this.setProgress} apiKey={this.apiKey} pageSize={this.pageSize} country="us" category="Business" />} />
            <Route exact path='/entertainment' element={<News key="entertainment" setProgress={this.setProgress} apiKey={this.apiKey} pageSize={this.pageSize} country="us" category="Entertainment" />} />
            <Route exact path='/general' element={<News key="general" setProgress={this.setProgress} apiKey={this.apiKey} pageSize={this.pageSize} country="us" category="General" />} />
            <Route exact path='/health' element={<News key="health" setProgress={this.setProgress} apiKey={this.apiKey} pageSize={this.pageSize} country="us" category="Health" />} />
            <Route exact path='/science' element={<News key="science" setProgress={this.setProgress} apiKey={this.apiKey} pageSize={this.pageSize} country="us" category="Science" />} />
            <Route exact path='/technology' element={<News key="technology" setProgress={this.setProgress} apiKey={this.apiKey} pageSize={this.pageSize} country="us" category="Technology" />} />
            <Route exact path='/sports' element={<News key="sports" setProgress={this.setProgress} apiKey={this.apiKey} pageSize={this.pageSize} country="us" category='sports' />} />
          </Routes>
        </Router>
      </div>
    )
  }
}
