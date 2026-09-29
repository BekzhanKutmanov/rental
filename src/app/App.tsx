import { useState } from 'react';
import './styles/App.css';
import ProductManager from '../pages/ProductManager';

function App() {
  const [count, setCount] = useState(0);

  // count - переменная
  // setCount - функция которая меняет переменную
   
  return (
    <ProductManager />
  )
}

export default App;