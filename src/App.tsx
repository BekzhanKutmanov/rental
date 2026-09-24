import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import ProductManager from './pages/ProductManager'

import { withQuery } from './app/providers/with-query';

function App() {

  return (
    <>
      <ProductManager />
    </>
  )
}

export default withQuery(App);