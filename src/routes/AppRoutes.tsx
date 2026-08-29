import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import Home from '../pages/Home/Home'
import Locais from '../pages/Locais/Locais'
import Cadastro from '../pages/Cadastro/Cadastro'
import Sobre from '../pages/Sobre/Sobre'
import NotFound from '../pages/NotFound/NotFound'


function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/locais" element={<Locais />} />
        <Route path="/cadastrar" element={<Cadastro />} />
        <Route path="/sobre" element={<Sobre />} />

        <Route path='*' element={<NotFound/>} />
      </Routes>
    </MainLayout>
  )
}

export default AppRoutes