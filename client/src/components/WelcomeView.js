import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import randomCodeGenerator from '../utils/randomCodeGenerator'
const WelcomeView = () => {
    const [roomCode, setRoomCode] = useState('')

    return (
        <div className='Homepage'>
            <div className='homepage-menu'>
                <div className='homepage-form'>
                    <h1>Guess and Draw</h1>
                    <div className='homepage-join'>
                        <input type='text' placeholder='Game Code' onChange={(event) => setRoomCode(event.target.value)} />
                        <div className='game-button'>
                        <Link to={`/play?roomCode=${roomCode}`}><button className="ui button primary">JOIN GAME</button></Link>
                        </div>
                    </div>
                    <h3>OR</h3>
                    <div className='homepage-create'>
                        <Link to={`/play?roomCode=${randomCodeGenerator(5)}`}><button className="ui button primary">CREATE GAME</button></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WelcomeView
