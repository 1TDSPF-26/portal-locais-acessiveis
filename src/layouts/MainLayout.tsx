import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div>
      <header>
        {/* o menu vai ficar aqui */}
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        {/* o rodape vai ficar aqui depois */}
      </footer>
    </div>
  )
}

export default MainLayout