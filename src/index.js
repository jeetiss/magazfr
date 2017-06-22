import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import createStore from './createStore'

const mountPoint = document.getElementById('root')
const store = createStore()

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  mountPoint
)
