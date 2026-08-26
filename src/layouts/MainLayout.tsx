import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div>
      <header>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
      </footer>
    </div>
  )
}

export default MainLayout