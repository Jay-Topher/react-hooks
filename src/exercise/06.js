// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React, {useEffect, useState} from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'
import {ErrorFallback} from './ErrorBoundary'
import {ErrorBoundary} from 'react-error-boundary'

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const statuses = {
    idle: 'idle',
    pending: 'pending',
    resolved: 'resolved',
    rejected: 'rejected',
  }
  const initialState = {
    pokemonData: null,
    status: statuses.idle,
    error: null,
  }

  const [state, setState] = useState(initialState)

  useEffect(() => {
    if (!pokemonName) return
    setState({...state, status: statuses.pending})
    fetchPokemon(pokemonName)
      .then(result => {
        setState({...state, pokemonData: result, status: statuses.resolved})
      })
      .catch(e => {
        setState({...state, error: e, status: statuses.rejected})
      })
    //eslint-disable-next-line
  }, [pokemonName])

  if (state.status === statuses.rejected) {
    throw state.error
  }
  if (state.status === statuses.idle) {
    return <p>Submit a pokemon</p>
  } else if (state.status === statuses.pending) {
    return <PokemonInfoFallback name={pokemonName} />
  } else {
    return <PokemonDataView pokemon={state.pokemonData} />
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
