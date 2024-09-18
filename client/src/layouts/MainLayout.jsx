
import { Outlet, } from 'react-router-dom'
import Sidebar from '../components/sidebar/Sidebar'
import Navbar from '../components/navbar/Navbar'


const MainLayout = () => {
  


  return (
    
    <div>
      <Navbar />
      <div className="container">
        <Sidebar />
        <div className="content">
          <Outlet />
        </div>
      </div>     
    </div>
    
  )
}

export default MainLayout
