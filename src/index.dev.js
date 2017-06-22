// import 'react-hot-loader/patch'
import { AppContainer } from 'react-hot-loader'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import createStore from './createStore'

const mountPoint = document.getElementById('root')
const store = createStore()

const getApp = App => (
  <AppContainer>
    <Provider store={store}>
      <App />
    </Provider>
  </AppContainer>
)

// store.subscribe(() => console.log(store.getState()))

ReactDOM.render(getApp(App), mountPoint)

if (module.hot) {
  module.hot.accept('./App', () => {
    const NewApp = require('./App').default

    ReactDOM.render(getApp(NewApp), mountPoint)
  })
}
