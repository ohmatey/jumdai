'use client'

import { useReducer } from 'react'

import type {
  ThaiAlphabet,
  GameState,
  GameSettings,
} from './types'
import gameReducer from './reducers/gameReducer'

import GameForm from './components/GameForm'

const insitialState: GameState = {
  started: false,
  step: null,
  steps: [],
  settings: {
    gameType: 'alphabet',
    gameMode: 'sequence',
    gameLevel: 'easy',
    languageMode: 'thai',
    numberOfOptions: 3
  }
}

const promptStyles = 'text-6xl font-bold'

const Home = () => {
  const [state, dispatch] = useReducer(gameReducer, insitialState)

  console.info(state, 'game state')

  const startGame = (newGameSettings: GameSettings) => {
    const { gameType, gameMode, gameLevel, languageMode } = newGameSettings

    const numberOfOptions = gameLevel === 'easy' ? 3 : gameLevel === 'medium' ? 4 : 5

    dispatch({
      type: 'start',
      payload: {
        gameType,
        gameMode,
        gameLevel,
        languageMode,
        numberOfOptions
      }
    })
  }

  const endGame = () => {
    dispatch({ type: 'end' })
  }

  const attemptAnswer = (attempted: ThaiAlphabet) => {
    dispatch({
      type: 'attempt',
      payload: {
        attempt: attempted
      }
    })
  }

  const nextStep = () => {
    dispatch({
      type: 'start',
      payload: state.settings
    })
  }

  return (
    <div>
      <div className='flex h-10 mb-4'>
        <div className='container mx-auto flex items-center'>
          <h1>JumD.ai</h1>
        </div>
      </div>

      <div>        
        {!state.started && (
          <div className='flex flex-col gap-4 items-center'>
            <h2 className='text-xl font-bold'>New Game</h2>

            <GameForm
              onSubmit={startGame}
              defaultValues={state.settings}
            />
          </div>
        )}
      </div>

      {state.started && (
        <div className='flex flex-col items-center container mx-auto'>
          {/* show the alphabet and romanization of the alphabet */}
          {state.step && (
            <div className='flex flex-col items-center'>
              <div className='my-10 p-10 border-4 border-white'>
                <p className={promptStyles}>{state.settings.languageMode === 'thai' ? state.step.prompt.alphabet : state.step.prompt.romanization}</p>
              </div>

              {/* display click next if its correct */}
              {state.step.correct && (
                <div className='flex flex-col items-center mb-4'>
                  <h2
                    className='text-4xl font-bold mb-2'
                  >Correct!</h2>

                  <button
                    onClick={nextStep}
                    className='p-4 border border-white font-bold text-2xl'
                  >Next</button>
                </div>
              )}

              {/* display options */}
              <div className='flex flex-wrap gap-4 justify-center'>
                {state.step.options?.map((option, index) => {
                  const isCorrect = state.step?.prompt.alphabet === option.alphabet
                  const isCorrectAnswer = state.step?.correct

                  return (
                    <button
                      key={index}
                      onClick={() => attemptAnswer(option)}
                      disabled={state.step?.correct}
                      className={`p-4 pb-8 border border-white font-bold text-8xl ${isCorrect && isCorrectAnswer ? 'border-green-500' : ''} ${!isCorrect && isCorrectAnswer ? 'border-red-500' : ''}`}
                    >
                      {state.settings.languageMode === 'thai' ? option.romanization : option.alphabet}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className='flex flex-col items-center my-10'>
            <p className='text-4xl font-bold mb-4'>{state.steps.reduce((acc, step) => acc + (step.correct ? 1 : 0), 0)} Points</p>
            <p className='text-2xl font-bold'>{state.steps.filter((step) => step.correct).length}/{state.steps.length} Correct Attempts</p>

            {/* settings */}
            <div className='flex flex-col gap-4'>
              <p>{state.settings.gameType} {state.settings.gameMode} {state.settings.gameLevel} {state.settings.languageMode}</p>
            </div>

            <button
              onClick={endGame}
              className='p-2 border border-white font-bold text-l mt-2'
            >End Game</button>
          </div>

          {/* horizontal overflow align to left, Apple style */}
          <div className='overflow-x auto'>
            <div className='flex flex-wrap gap-4'>
              {state.steps.map((step, index) => {
                return (
                  <div key={index} className={`p-4 border-2 border-white ${step.correct ? 'border-green-500' : ''}`}>
                    {state.settings.languageMode === 'thai' ? (
                      <div>
                        <p>{step.prompt.alphabet}</p>
                        <p>{step.attempt?.romanization}</p>
                      </div>
                    ) : (
                      <div>
                        <p>{step.prompt.romanization}</p>
                        <p>{step.attempt?.alphabet}</p>
                      </div>
                    )}

                    <div>
                      {step.rewards?.map((reward, index) => {
                        return (
                          <div key={index}>
                            <p>{reward.points}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home