import React, { useEffect, useState } from 'react'
import NavbarOwner from '../../components/owner/NavbarOwner'
import Sidebar from '../../components/owner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {
  const { isOwner, navigate } = useAppContext()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isOwner) {
      navigate('/')
    }
  }, [isOwner])

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarOwner setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1 relative">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main owner page content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
