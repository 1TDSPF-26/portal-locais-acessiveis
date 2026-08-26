//mapa de navegação do nosso site
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home/Home'
import Locais from '../pages/Locais/Locais'
import Cadastro from '../pages/Cadastro/Cadastro'
import Sobre from '../pages/Sobre/Sobre'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>   {/*faz com que o header e o footer fiquem em todas as paginas que for criar*/}
        <Route path="/" element={<Home />} />  {/*esse "/" faz com que a pagina home abra automaticamente quando entrar no site*/}
        <Route path="/locais" element={<Locais />} />
        <Route path="/cadastrar" element={<Cadastro />} />
        <Route path="/sobre" element={<Sobre />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes