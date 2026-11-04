import { Routes, Route } from 'react-router-dom'

import { MainLayout } from '../layouts/MainLayout'

import { PageContainer } from '../layouts/PageContainer'

import  Home  from '../pages/Home/Home';

import Locais from '../pages/Locais/Locais'

import Cadastro from '../pages/Cadastro/Cadastro'

import Sobre from '../pages/Sobre/Sobre'

import NotFound from '../pages/NotFound/NotFound'

import DetalhesLocal from '../pages/DetalhesLocal/DetalhesLocal'

import Acessibilidade from '../pages/Acessibilidade/Acessibilidade'

import Favoritos from '../pages/Favoritos/Favoritos'

import ComoContribuir from '../pages/ComoContribuir/ComoContribuir'

function AppRoutes() {

  return (

    <MainLayout>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route element={<PageContainer />}>

          <Route path="/locais" element={<Locais />} />

          <Route path="/locais/:id" element={<DetalhesLocal />} />

          <Route path="/cadastrar" element={<Cadastro />} />

          <Route path="/como-contribuir" element={<ComoContribuir />} />

          <Route path="/sobre" element={<Sobre />} />

          <Route path="/acessibilidade" element={<Acessibilidade />} />

          <Route path="/favoritos" element={<Favoritos/>}/>

          <Route path="*" element={<NotFound />} />

        </Route>

      </Routes>

    </MainLayout>

  )

}

export default AppRoutes