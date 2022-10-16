import "./App.css";
import React, { Component } from "react";
import { Octokit } from "octokit";
const octokit = new Octokit({
  auth: `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`,
});

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      responseData: [],
      perPage: 15,
      pageCount: 1,
      queryString: "react",
      sortString: "",
      sortOrder: "desc",
      urlParam: "",
    };
  }

  componentDidMount() {
    this._getData();
  }

  componentDidUpdate() {
    // this._displayData();
    // this._getData();
  }

  _getData = async () => {
    if (this.state.sortString !== "") {
      const querySet = `q=${this.state.queryString}&sort=${this.state.sortString}&order=${this.state.sortOrder}&page=${this.state.pageCount}&per_page=${this.state.perPage}`;
      this.setState({ urlParam: querySet }, () => {
        this._callApi();
      });
    } else {
      const querySet = `q=${this.state.queryString}&page=${this.state.pageCount}&per_page=${this.state.perPage}`;
      this.setState({ urlParam: querySet }, () => {
        this._callApi();
      });
    }
  };

  _callApi = async () => {
    const response = await octokit.request(
      `GET /search/repositories?${this.state.urlParam}`,
      {
        org: "octokit",
        type: "private",
      }
    );
    this.setState({ responseData: response.data.items }, () => {
      window.scrollTo(0, 0);
    });
  };

  // _displayData = () => {
  //   this.state.responseData.map((e) => {
  //     console.log(e.name);
  //   });
  // };

  _searchEvent = (event) => {
    this.setState({ queryString: event.target.value });

    if (this.state.queryString.length >= 2 && event.key === "Enter") {
      console.log(this.state.queryString);
      this._getData();
    }
  };

  _onSortChange = (event) => {
    var sortingData = event.target.value.split(" ");
    this.setState(
      {
        sortString: sortingData[0],
        sortOrder: sortingData[1],
      },
      () => {
        console.log(this.state.sortString);
        console.log(this.state.sortOrder);
        this._getData();
      }
    );
    // this.setState({ sortString: event.target.value }, () => {
    //   console.log(this.state.sortString);
    //   this._getData();
    // });
  };

  _nextPage = () => {
    this.setState({ pageCount: this.state.pageCount + 1 }, () => {
      this._getData();
      console.log(this.state.pageCount);
    });
  };

  _prevPage = () => {
    if (this.state.pageCount !== 1) {
      this.setState({ pageCount: this.state.pageCount - 1 }, () => {
        this._getData();
        console.log(this.state.pageCount);
      });
    }
  };

  render() {
    return (
      <div className="container">
        <header>
          <input
            type="text"
            className="form-input"
            value={this.state.queryString}
            placeholder="Please Enter Keywords"
            onChange={this._searchEvent}
            onKeyDown={this._searchEvent}
          />
        </header>
        {this.state.responseData.length === 0 ? (
          <h1 className="loading">Please Wait...</h1>
        ) : (
          <main>
            <div className="sorting">
              <select onChange={this._onSortChange}>
                <option>Select Sorting</option>
                <option value="name asc">Name A-Z</option>
                <option value="name desc">Name Z-A</option>
                <option value="stars desc">Stars High-Low</option>
                <option value="stars asc">Stars Low-High</option>
                <option value="updated asc">Updated Older</option>
                <option value="updated desc">Updated Newer</option>
                {/* <option value="created_at asc">Created Newer</option>
                <option value="created_at desc">Created Older</option>
                <option value="watchers asc">Watcher Low-High</option>
                <option value="watchers desc">Watcher High-Low</option> */}
              </select>
            </div>
            <div className="card-wrapper">
              {this.state.responseData.map((e) => (
                <div key={e.id} className="card">
                  <div className="card-inner">
                    <div className="header">
                      <div className="avatar">
                        <img src={e.owner.avatar_url} alt="" />
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="user-meta has-text-centered">
                        <h3 className="username">{e.name}</h3>
                      </div>
                      <div className="user-bio has-text-centered">
                        <p>
                          {e.description !== null &&
                            e.description.substring(0, 80)}
                        </p>
                      </div>
                      <div className="chips-container">
                        <span className="basic-chip outline">
                          Language: {e.language}
                        </span>
                        <span className="basic-chip outline">
                          {e.stargazers_count} Stars
                        </span>
                        <span className="basic-chip outline">
                          {e.watchers} Watchers
                        </span>
                        <span className="basic-chip outline">
                          Score: {e.score}
                        </span>
                        <br />
                        <hr />
                        <small>Created On: {e.created_at}</small>
                        <br />
                        <small>Updated On: {e.updated_at}</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* <div className="card">
                <div className="card-inner">
                  <div className="header">
                    <div className="avatar">
                      <img
                        src="https://randomuser.me/api/portraits/women/67.jpg"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="user-meta has-text-centered">
                      <h3 className="username">react-tetris</h3>
                    </div>
                    <div className="user-bio has-text-centered">
                      <p>
                        Use React, Redux, Immutable to code Tetris.
                      </p>
                    </div>
                    <div className="chips-container">
                      <span className="basic-chip outline">
                        Language: JavaScript
                      </span>
                      <span className="basic-chip outline">
                        300 Stars
                      </span>
                      <span className="basic-chip outline">
                        200 Watchers
                      </span>
                      <span className="basic-chip outline">
                        Score: 1
                      </span>
                      <br />
                      <hr />
                      <small>Created On: 20-12-2021</small>
                      <br />
                      <small>Updated On: 20-2-2021</small>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>

            <nav>
              <button
                className="prev"
                onClick={() => {
                  this._prevPage();
                }}
              >
                Prev
              </button>
              <button
                className="next"
                onClick={() => {
                  this._nextPage();
                }}
              >
                Next
              </button>
            </nav>
          </main>
        )}
      </div>
    );
  }
}

export default App;

// function App() {
//   useEffect(() => {
//     _getData();
//   });

//   const _getData = async () => {
//     const response = await octokit.request(
//       "GET /search/repositories?q=react",
//       {
//         org: "octokit",
//         type: "private",
//       }
//     );
//     console.table(response.data);
//   };
//   return (

//   );
// }

// export default App;
