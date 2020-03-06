import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jokes: JSON.parse(localStorage.getItem("jokes")) ? JSON.parse(localStorage.getItem("jokes")) : [], 
    };

    this.vote = this.vote.bind(this);
    this.generateNewJokes = this.generateNewJokes.bind(this);
    this.sortJokes = this.sortJokes.bind(this);
    this.getJokes = this.getJokes.bind(this);
  }

  async componentDidMount() {
    if (!this.state.jokes[0]) {
      await this.getJokes();
    }
  }

 getJokes = async (isReset = false) => {
    let j = isReset ? [] : [...this.state.jokes];
    
    let seenJokes = new Set();
    try {
      while (j.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }
      console.log({ j })
      this.setState({ jokes: j });
      localStorage.setItem("jokes", JSON.stringify(j));
    } catch (e) {
      console.log(e);
    }
  }

  generateNewJokes() {
    const resetJokes = async () => { 
      await this.getJokes(true);
    }
    resetJokes();
  }

  vote(id, delta) {
    this.setState(prevState => ({
      jokes: (prevState.jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j)))
    }))
    localStorage.setItem("jokes", JSON.stringify([...this.state.jokes]));
  }

  sortJokes() {
    return [...this.state.jokes].sort((a, b) => b.votes - a.votes);
  }

  render() {
    return this.state.jokes.length === 0 ?
      <div>
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading...</p>
      </div>
      :
      <div className="JokeList">
        <button className="JokeList-getmore" onClick={this.generateNewJokes}>
          Get New Jokes
        </button>

        {this.sortJokes().map(j => (
          <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
        ))}
      </div>
  }

}

export default JokeList;
