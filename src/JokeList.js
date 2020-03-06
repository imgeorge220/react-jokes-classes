import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jokes: [],
    };
    this.numJokesToGet = this.props.numJokesToGet;
    this.vote = this.vote.bind(this);
    this.generateNewJokes = this.generateNewJokes.bind(this);
    this.sortJokes = this.sortJokes.bind(this);
  }

  componentDidMount() {
    const getJokes = async () => {
      let j = [...this.state.jokes];
      let seenJokes = new Set();
      try {
        console.log(this.numJokesToGet, "p")
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
        console.log({j})
        this.setState({ jokes: j });
      } catch (e) {
        console.log(e);
      }
    }
    getJokes();
  }


  generateNewJokes() {
    this.setState({ jokes: [] });
  }

  vote(id, delta) {
    this.setState({
      jokes: (this.state.jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j)))
    })
  }

  sortJokes() {
    return [...this.state.jokes].sort((a, b) => b.votes - a.votes);
  }

  render() {
    return this.state.jokes.length === 0 ? <p>Loading...</p> :
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
