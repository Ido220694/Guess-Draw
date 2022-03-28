import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import queryString from 'query-string';
import GuessForm from './GuessForm';
import './App.css'
import Container from './Container';
import Waiting from './WaitingView';
import getWord from '../utils/randWords';

let socket
// const ENDPOINT = 'http://localhost:5000'
const ENDPOINT ='https://react-draw-guess.herokuapp.com/'

const Game = (props) => {

    const data = queryString.parse(props.location.search)

    //initialize socket state
    const [room, setRoom] = useState(data.roomCode)
    const [roomFull, setRoomFull] = useState(false)
    const [users, setUsers] = useState([])
    const [currentUser, setCurrentUser] = useState('')

    useEffect(() => {
        const connectionOptions =  {
            "forceNew" : true,
            "reconnectionAttempts": "Infinity", 
            "timeout" : 10000,                  
            "transports" : ["websocket"]
        }
        socket = io.connect(ENDPOINT, connectionOptions)

        socket.emit('join', {room: room}, (error) => {
            if(error)
                setRoomFull(true)
        })

        //cleanup on component unmount
        return function cleanup() {
            socket.emit('disconnect')
            //shut down connnection instance
            socket.off()
        }
    }, [])

    
    const [didChoseL, setDidChoseL] = useState(true)
    const [didChoseWord, setDidChoseWord] = useState(true)
    const [finishDrawing, setFinishDrawing] = useState(true)
    const [chosenWord, setChosenWord] = useState('')
    const [draw, setDraw] = useState(null)
    const [word1, setWord1] = useState('')
    const [word2, setWord2] = useState('')
    const [word3, setWord3] = useState('')
    const [level, setLevel] = useState('')
    const [points, setPoints] = useState(0)
    const [gameOver, setGameOver] = useState(true)

    //runs once on component mount
    useEffect(() => {
        //send initial state to server
        socket.emit('initGameState', {
            gameOver: false,
            didChoseL:false,
            didChoseWord:false,
            finishDrawing:false,
            points:0
        })
    }, [])


    useEffect(() => {
        socket.on('initGameState', ({ gameOver, didChoseL, didChoseWord ,finishDrawing, points}) => {
            setGameOver(gameOver)
            setDidChoseL(didChoseL)
            setDidChoseWord(didChoseWord)
            setFinishDrawing(finishDrawing)
            setPoints(points)
        })
        
        socket.on('updateGameState', ({ gameOver, chosenWord, level , didChoseL, didChoseWord, finishDrawing, points, draw}) => {
            gameOver && setGameOver(gameOver)
            chosenWord && setChosenWord(chosenWord)
            level && setLevel(level)
            didChoseL && setDidChoseL(didChoseL)
            didChoseWord && setDidChoseWord(didChoseWord)
            finishDrawing && setFinishDrawing(finishDrawing)
            points && setPoints(points)
            setDraw(draw)
        })

        socket.on('switchPositions', ({ user }) => {

            if(currentUser === user){
                setCurrentUser('Player 2')
            }
            else{
                setCurrentUser('Player 1')
            }
        })

        socket.on('drawing', ({ draw }) => {
            draw && setDraw(draw)
        })


        socket.on("roomData", ({ users }) => {
            setUsers(users)
        })

        socket.on('currentUserData', ({ name }) => {
            setCurrentUser(name)
        })

    }, [])


    const Canva = () => {
        return(
            <div>
            <Container onSubmit={onSendingDraw}/> 
            </div>
        );
    }

    const ChoosingLevel = () =>{
        return(
        <div className='choosingLevel'>
            <div className='headerChoosing'>
                <h1>Select Your Level</h1>
            </div>
            <button className="ui button orange" onClick={() => onChoosingLevel("Hard")}>Hard</button>
            <button className="ui button yellow" onClick={() => onChoosingLevel("Medium")}>Medium</button>
            <button className="ui button olive" onClick={() => onChoosingLevel("Easy")}>Easy</button>
        </div>
        );
    }

    const ChoosingWord = () =>{
        return(
        <div className='choosingLevel'>
            <div className='headerChoosing'>
                <h1>Select Your Word</h1>
            </div>
            <div className='button-option'>
                <button className="ui button primary" onClick={() => onChoosingWord(word1, level)}>{word1}</button>
            </div>
            <div className='button-option'>
                <button className="ui button primary" onClick={() => onChoosingWord(word2, level)}>{word2}</button>
            </div>
            <div className='button-option'>
                <button className="ui button primary" onClick={() => onChoosingWord(word3, level)}>{word3}</button>
            </div>

        </div>

        );
    }

    const onChoosingLevel = (lev) => {
        setLevel(lev)
        var w1 ;
        var w2 ;
        var w3 ;

        if (lev =='Easy'){
            w1 = getWord(1);
            w2 = getWord(1);
            while(w2==w1){
                w2 = getWord(1);
            }
            w3 = getWord(1);
            while(w1 == w3 || w2==w3){
                w3 = getWord(1);
            }
    
        }
        else if (lev == 'Medium'){
            w1 = getWord(2);
            w2 = getWord(2);
            while(w2==w1){
                w2 = getWord(2);
            }
            w3 = getWord(2);
            while(w1 == w3 || w2==w3){
                w3 = getWord(2);
            }
    
        }
        else{
            w1 = getWord(3);
            w2 = getWord(3);
            while(w2==w1){
                w2 = getWord(3);
            }
            w3 = getWord(3);
            while(w1 == w3 || w2==w3){
                w3 = getWord(3);
            }
        }
        setWord1(w1);
        setWord2(w2);
        setWord3(w3);
        socket.emit('updateGameState', {
            gameOver: checkGameOver(false),
            chosenWord: '',
            level:lev,
            didChoseL: true,
            didChoseWord: false,
            finishDrawing: false,
            points:points,
            draw:null
        })
    }

    const onChoosingWord = (word, level) => {
        socket.emit('updateGameState', {
            gameOver: checkGameOver(false),
            chosenWord: word,
            level:level,
            didChoseL:true,
            didChoseWord:true,
            finishDrawing:false,
            points:points,
            draw:null
        })
    }


    const onSendingDraw = (canvasRef) => {
        var canvas1 = canvasRef;
        socket.emit('updateGameState', {
            gameOver: checkGameOver(false),
            chosenWord: chosenWord,
            level:level,
            didChoseL:true,
            didChoseWord:true,
            finishDrawing:true,
            points:points,
            draw:canvas1
        })
    }

    const checkGameOver = (ans) => {
        return ans
    }

    const onGameOver = () => {
        if(currentUser === 'Player 2'){
            setCurrentUser('Player 1')
        }
        else{
            setCurrentUser('Player 2')
        }
        setGameOver(false)
    }
    
    const onSuccess = () =>{

        var new_points;
        console.log(points)
        console.log(currentUser)

        if(level == "Easy"){
            new_points = points + 1;
        }
        else if(level == "Medium"){
            new_points = points + 3;
        }
        else{
            new_points = points + 5;
        }
        setPoints(new_points);

        socket.emit('initGameState', {
            gameOver: checkGameOver(true),
            didChoseL:false,
            didChoseWord:false,
            finishDrawing:false,
            points:new_points
        })
        console.log("Checking")

    }

    return(
        <div className='main-game'>
        {(!roomFull)? <>
        <div className="top-data">
            <div className='top-data-head'>
                <h2>Guess and Draw</h2>
            </div>
            <h3>Game Code: {room}</h3>
            <div className='score'>
                <h3>Score: {points}</h3>
            </div>
        </div>
        {users.length===1 && currentUser === 'Player 2' && <h1 className='topInfoText'>Player 1 has left the game.</h1> }
        {users.length===1 && currentUser === 'Player 1' && <h1 className='topInfoText'>Waiting for Player 2 to join the game.</h1> }
        {users.length===2 &&   <>
        { gameOver? onGameOver():
            !didChoseL ? 
                <div>   
                    {/* PLAYER 1 VIEW*/}
                    {currentUser === 'Player 1' && <>
                    <ChoosingLevel/>
                    </>}
                    {/* PLAYER 2 VIEW */}
                    {currentUser === 'Player 2' && <>
                    <Waiting/>
                    </>}
                </div>
            : !didChoseWord?
                <div>
                    {/* PLAYER 1 VIEW */}
                    {currentUser === 'Player 1' && <>
                    <ChoosingWord/>
                    </>}
                    {/* PLAYER 2 VIEW  */}
                    {currentUser === 'Player 2' && <>
                    <Waiting/>
                    </>}
                </div>
            : !finishDrawing?
                <div>
                    {/* PLAYER 1 VIEW */}
                    {currentUser === 'Player 1' && <>
                    <div className='canva'>
                        <Canva />
                    </div>
                    </>}
                    {/* PLAYER 2 VIEW  */}
                    {currentUser === 'Player 2' && <>
                    <Waiting/>
                    </>}
                </div>
            :
                <div>
                    {/* PLAYER 1 VIEW */}
                    {currentUser === 'Player 1' && <>
                    <Waiting/>
                    </>}
                    {/* PLAYER 2 VIEW  */}
                    {currentUser === 'Player 2' && <>
                    <div>
                        <div className='submit-guess'>
                            <GuessForm onSubmit={onSuccess} word={chosenWord}/>
                        </div>
                        <div className='image-show'>
                            <img src ={draw}/>
                        </div>
                    </div>
                    </>}
                </div>
                }
                </> }
            </> : <h1>Room full</h1>}
        <br />
        <div className="game-button red">
            <a href='/'><button className="ui button negative">QUIT</button></a>
        </div>
    </div>
 );
}



export default Game;
