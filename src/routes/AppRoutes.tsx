import { useEffect, useRef } from 'react'

import { Routes, Route, useLocation } from 'react-router-dom'

import { MainLayout } from '../layouts/MainLayout'

import Home from '../pages/Home/Home'

import Locais from '../pages/Locais/Locais'

import Cadastro from '../pages/Cadastro/Cadastro'

import Sobre from '../pages/Sobre/Sobre'

import NotFound from '../pages/NotFound/NotFound'

import DetalhesLocal from '../pages/DetalhesLocal/DetalhesLocal'

function AppRoutes() {
  const location = useLocation()
  const primeiraRenderizacao = useRef(true)

  useEffect(() => {
    if (primeiraRenderizacao.current) {
      primeiraRenderizacao.current = false
      return
    }

    document.getElementById('inicio-pagina')?.focus()
  }, [location.pathname])

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/locais" element={<Locais />} />
        <Route path="/locais/:id" element={<DetalhesLocal />} />
        <Route path="/cadastrar" element={<Cadastro />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  )
}

export default AppRoutes