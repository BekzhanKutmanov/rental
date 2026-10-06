import './styles/App.css';
import ProductManager from '../pages/productManager/ProductManager';
import ProductList from '../pages/productList/ProductList';
import { withProviders } from './providers';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path='/' element={<ProductManager />} />
      <Route path='/products' element={<ProductList />} />
    </Routes>
  )
}

export default withProviders(App);
