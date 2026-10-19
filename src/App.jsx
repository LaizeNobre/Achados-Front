import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ItemDetail from "./pages/ItemDetail";
import ItemForm from "./pages/ItemForm";
import './App.css';

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/item/:id" element={<ItemDetail/>}/>
        <Route path="/novo" element={<ItemForm/>}/>
        <Route path="/editar/:id" element={<ItemForm/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
