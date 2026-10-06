import './styles/App.css';
import ProductManager from '../pages/productManager/ProductManager';
import { withProviders } from './providers';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path='/' element={<ProductManager />} />
      
    </Routes>
  )
}

export default withProviders(App);