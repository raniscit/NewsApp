import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


export class News extends Component {
  static defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general'
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }
  capitalizeLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  constructor(props) {
    super(props);
    console.log("Hello I am a constructor");
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0
    }
    document.title = `${this.capitalizeLetter(this.props.category)}- NewsMonkey`;
  }

  async updateNews(append = false) {
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });

    let data = await fetch(url);
    let parsedData = await data.json();

    this.setState(prevState =>({
      articles: append ? prevState.articles.concat(parsedData.articles) : parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false
    }));

  }

  // async componentDidMount() {
    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=1&pageSize=${this.props.pageSize}`;
    // this.setState({loading:true});
    // let data = await fetch(url);
    // let parsedData = await data.json();
    // this.setState(prevState =>({
    //   articles: parsedData.articles,
    //   totalResults: parsedData.totalResults,
    //   loading: false
    // }));
  //   this.props.setProgress(10);
  //   await this.updateNews();
  //   this.props.setProgress(100);
  // }


  // handlePrevClick = async () => {
  //   let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
  //   this.setState({loading:true});
  //   let data = await fetch(url);
  //   let parsedData = await data.json();
  //   this.setState(prevState =>({
  //     loading: false,
  //     page:this.state.page-1,
  //     articles: parsedData.articles
  //   }));
  // }

  // handleNextClick = async () => {
  //   let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
  //   this.setState({loading:true});
  //   let data = await fetch(url);
  //   let parsedData = await data.json();

  //   this.setState(prevState =>({
  //     loading: false,
  //     page:this.state.page+1,
  //     articles: parsedData.articles
  //   }));
  // }

  async componentDidMount() {
    this.props.setProgress(10);
    await this.updateNews();
    this.props.setProgress(100);
  }


  handlePrevClick = () => {
    this.setState(prevState => ({
      page: prevState.page - 1
    }), this.updateNews);
  }

  handleNextClick = () => {
    this.setState(prevState => ({
      page: prevState.page + 1
    }), this.updateNews);
  }

  fetchMoreData = () => {
    this.setState(prevState => ({
      page: prevState.page + 1
    }), () => this.updateNews(true));

    console.log(this.state.articles.length);
    console.log(this.state.totalResults);
    
  };

  render() {
    return (
      // <div className='container my-3'>
      //   <h1 className="text-center my-5"><b>NewsMonkey</b> - Top {this.capitalizeLetter(this.props.category)} Headlines</h1>

      //   {this.state.loading && <Spinner />}
      //   <div className="row">
      //     {!this.state.loading && this.state.articles.map((element) => {
      //       return <div className="col-md-4" key={element.url}>
      //         <NewsItem title={element.title ? element.title.slice(0, 45) : ""} description={element.description ? element.description.slice(0, 88) : ""}
      //           imageUrl={element.urlToImage}
      //           newsUrl={element.url} author={element.author ? element.author : "Unknown"} date={element.publishedAt} source={element.source.name} />
      //       </div>
      //     })}
      //   </div>

      //   <div className="container d-flex justify-content-between">
      //     <button disabled={this.state.page <= 1} type="button" className="btn btn-dark" onClick={this.handlePrevClick} > &larr; Prev</button>
      //     <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr; </button>
      //   </div>
      // </div>


      <>
        <h1 className="text-center" style={{margin: '90px 0 35px 0'}}><b>NewsMonkey</b> - Top {this.capitalizeLetter(this.props.category)} Headlines</h1>
        {this.state.loading && <Spinner />}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row">
              {this.state.articles.map((element) => {
                return <div className="col-md-4" key={element.url}>
                  <NewsItem title={element.title ? element.title.slice(0, 45) : ""} description={element.description ? element.description.slice(0, 88) : ""}
                    imageUrl={element.urlToImage}
                    newsUrl={element.url} author={element.author ? element.author : "Unknown"} date={element.publishedAt} source={element.source.name} />
                </div>
              })}
            </div>
          </div>
        </InfiniteScroll>
      </>
    )
  }
}

export default News