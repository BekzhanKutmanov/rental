import './styles/App.css';
import ProductManager from '../pages/productManager/ProductManager';
import { withProviders } from './providers';

function App() {
  return (
    <ProductManager />
  )
}

export default withProviders(App);
