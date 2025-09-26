import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
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
    category: PropTypes.string,
    apiKey: PropTypes.string.isRequired,
    setProgress: PropTypes.func.isRequired
  }

  capitalizeLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0
    }
    document.title = `${this.capitalizeLetter(this.props.category)} - NewsMonkey`;
  }

  async updateNews(append = false) {
    try {
      this.setState({ loading: true });
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      
      let data = await fetch(url);
      let parsedData = await data.json();

      // Ensure articles is always an array
      const articlesArray = Array.isArray(parsedData.articles) ? parsedData.articles : [];

      this.setState(prevState => ({
        articles: append ? prevState.articles.concat(articlesArray) : articlesArray,
        totalResults: parsedData.totalResults || 0,
        loading: false
      }));
    } catch (error) {
      console.error("Error fetching news:", error);
      this.setState({ loading: false });
    }
  }

  async componentDidMount() {
    this.props.setProgress(10);
    await this.updateNews();
    this.props.setProgress(100);
  }

  handlePrevClick = () => {
    if (this.state.page > 1) {
      this.setState(prevState => ({
        page: prevState.page - 1
      }), this.updateNews);
    }
  }

  handleNextClick = () => {
    if (this.state.page + 1 <= Math.ceil(this.state.totalResults / this.props.pageSize)) {
      this.setState(prevState => ({
        page: prevState.page + 1
      }), this.updateNews);
    }
  }

  fetchMoreData = () => {
    if (this.state.articles.length < this.state.totalResults) {
      this.setState(prevState => ({
        page: prevState.page + 1
      }), () => this.updateNews(true));
    }
  };

  render() {
    const { articles, loading, totalResults } = this.state;

    return (
      <>
        <h1 className="text-center" style={{ margin: '90px 0 35px 0' }}>
          <b>NewsMonkey</b> - Top {this.capitalizeLetter(this.props.category)} Headlines
        </h1>

        {loading && articles.length === 0 && <Spinner />}

        <InfiniteScroll
          dataLength={articles ? articles.length : 0}
          next={this.fetchMoreData}
          hasMore={articles.length < totalResults}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row">
              {articles.map((element) => (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title.slice(0, 45) : ""}
                    description={element.description ? element.description.slice(0, 88) : ""}
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author ? element.author : "Unknown"}
                    date={element.publishedAt}
                    source={element.source?.name || "Unknown"}
                  />
                </div>
              ))}
            </div>
          </div>
        </InfiniteScroll>
      </>
    )
  }
}

export default News;
