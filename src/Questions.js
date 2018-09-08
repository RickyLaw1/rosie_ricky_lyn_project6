import React, { Component } from 'react';
import {Link} from "react-router-dom"; 
import './questions.css'

const choice = ["A", "B", "C", "D"]

class Questions extends Component {
    constructor(){
        super();
        this.state = {
            questionNumber: 0,
            chosenAnswer: "",
            position: [0, 100, 200, 300],
        }
    }

    checkAnswer = (e, i) => {
        e.preventDefault();
        const answer = this.props.questions[this.props.questionProgress].correct_answer;
        console.log(e.target.id);

        if (this.state.chosenAnswer === answer) {
            console.log("Correct");
            this.props.scoreCount(e.target.id, i);
            
        } else {
            console.log(`Wrong the answer is: ${answer}`);
        }

        // array clone that goes into playersArray
        const arrayClone = Array.from(this.props.players);
        arrayClone[i].answerSubmitted = true
        this.setState({
            players: arrayClone
        }, () => {
            this.setState({
                allAnswersSubmitted: this.state.players.every(this.allAnswersSubmitted)
            })
        })
    }

    allAnswersSubmitted = (players) => {
        return players.answerSubmitted
    }

    handleChange = (e) => {
        this.setState({
            chosenAnswer: e.target.value
        })
    }

    // clong the array of players 
    // going through each player and setting answerSubmitted to false 
    resetSubmit = () => {
        const arrayClone = Array.from(this.props.players);
        arrayClone.forEach((player) => {
            player.answerSubmitted = false
        })
        this.setState({
            allAnswersSubmitted: false,
            playerArray: arrayClone
        })
    }

    nextPlayer = (player) => {
        const arrayClone = Array.from(this.state.position);
        arrayClone[player] = -100;
        arrayClone[player + 1] = 0;

        this.setState({
            position: arrayClone
        })
    }

    render() {
        return (
            <div>
                {/* first question is the first question in the array with [0] index */}
                {/* keeping track of which questionw we're on */}
                {/* checking if there are questions in array then display question if there are */}
                
                <h1>Questions</h1>
                {this.props.questions[0]
                    ? <p>
                        {this.props.questions[this.props.questionProgress].question}
                    </p>
                : null}
                
                {/* getting the array with the players that have username, score and other properties  */}
                {/* i is to keep track of the answer each player gave  */}
                {/* mapping through the players and then mapping through all the possible answers for each player. it's a loop inside a loop */}
                {/* mapping through the possible answers: if answer isn't undefined then you can show an answer */}
                {/* undefined error if you don't check to see if we have the answer bc the answer will render first if we don't have the actual.*/}
                {/* making sure we have all the info the the API before it's rendered on the page  */}

                <div className="players">
                    {this.props.players.map((player, i) => {
                        return(
                            
                            <form key={player.username} 
                                className={`player player${i + 1}`}
                                style={{left: `${this.state.position[i]}%`}}
                                >
                                <img src={`https://robohash.org/${player.username}.png`} alt=""/>
                                <h2>{player.username}</h2>

                                {this.props.questions[0]
                                    ? this.props.questions[this.props.questionProgress].allChoices.map((answer, j) => { 
                                        return(answer && (
                                            <div className="choice">
                                                <label htmlFor={`${player.username}${j}`} key={j}> {choice[j]}: {answer} </label>
                                                <input 
                                                    id={`${player.username}${j}`} 
                                                    type="radio" 
                                                    name={`multipleChoice${i}`}
                                                    onChange={this.handleChange}
                                                    value={answer}
                                                />
                                            </div>
                                        )) 
                                    })
                                : null}

                                <button id={player.username} onClick={(e) => {
                                    this.checkAnswer(e, i);
                                    this.nextPlayer(i);
                                }}>Submit</button>
                            </form>
                        )
                    })}
                </div>

            {this.state.allAnswersSubmitted 
                ? <Link to="/results" >
                    <button onClick={() => {this.resetSubmit()}}>Submit All</button>
                </Link>
                : null
            }
            </div>
        );
    }
};

export default Questions;