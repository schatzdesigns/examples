import React from "react";
import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      page: 0,
      loading: false,
      prevY: 0
    };
  }

  componentDidMount() {
    this.getUsers(this.state.page);
    // Options
    var options = {
      root: null, // Page as root
      rootMargin: "0px",
      threshold: 1.0
    };
    // Create an observer
    this.observer = new IntersectionObserver(
      this.handleObserver, //callback
      options
    );
    //Observ the `loadingRef`
    this.observer.observe(this.loadingRef);
  }

  handleObserver = (entities, observer) => {
    const y = entities[0].boundingClientRect.y;
    if (this.state.prevY > y) {
      const lastUser = this.state.users[this.state.users.length - 1];
      const curPage = lastUser.id;
      this.getUsers(curPage);
      this.setState({ page: curPage });
    }
    this.setState({ prevY: y });
  };

  getUsers = () => {
    this.setState({ loading: true });
    axios
      .get(`https://api.github.com/users?since=${this.state.page}&per_page=100`)
      .then(res => {
        this.setState({ users: [...this.state.users, ...res.data] });
        this.setState({ loading: false });
      });
  };

  render() {
    const loadingCSS = {
      height: "100px",
      margin: "30px"
    };
    const loadingTextCSS = { display: this.state.loading ? "block" : "none" };
    return (
      <div className="container">
        <div style={{ minHeight: "800px" }}>
          <ul>
            {this.state.users.map((user, index) => (
              <li key={index}>{user.login}</li>
            ))}
          </ul>
        </div>
        <div
          ref={loadingRef => (this.loadingRef = loadingRef)}
          style={loadingCSS}
        >
          <span style={loadingTextCSS}>Loading...</span>
        </div>
      </div>
    );
  }
}

export default App;
