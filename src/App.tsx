import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ToolPage from './pages/ToolPage'
import CategoryPage from './pages/CategoryPage'
import InfoPage from './pages/InfoPage'

export default function App() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/:slug" element={<ToolPage/>}/>
    <Route path="/pdf-tools" element={<CategoryPage/>}/>
    <Route path="/image-tools" element={<CategoryPage/>}/>
    <Route path="/text-tools" element={<CategoryPage/>}/>
    <Route path="/calculators" element={<CategoryPage/>}/>
    <Route path="/generators" element={<CategoryPage/>}/>
    <Route path="/about" element={<InfoPage/>}/>
    <Route path="/contact" element={<InfoPage/>}/>
    <Route path="/privacy-policy" element={<InfoPage/>}/>
    <Route path="/terms" element={<InfoPage/>}/>
  </Routes></BrowserRouter>
}
