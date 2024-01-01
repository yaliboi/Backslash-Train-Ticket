import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from './pages/Login';

function App() {

    return (
      <BrowserRouter>
          <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<div >oh man</div>} />
          </Routes>
      </BrowserRouter>
    )
}

export default App
