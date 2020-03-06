import React from "react";
import JokeList from "./JokeList";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <JokeList numJokesToGet={10} />
      </div>
    );
  }
}

export default App;
