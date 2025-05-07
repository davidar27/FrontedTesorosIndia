import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <div className="flex items-center justify-between">

      <button onClick={toggleMenu} className="md:hidden">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {/* Desktop Menu */}
      <nav className="hidden md:flex space-x-8">
        <Link to="/" className="hover:text-primary">Inicio</Link>
        <Link to="/experiencias" className="hover:text-primary">Nosotros</Link>
        <Link to="/historia" className="hover:text-primary">Productos</Link>
        <Link to="/contacto" className="hover:text-primary">Paquetes</Link>
      </nav>

      {/* Mobile Menu Button */}
      <button onClick={toggleMenu} className="md:hidden text-gray-700">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-2">
            <Link to="/" className="block text-gray-700 hover:text-primary">Inicio</Link>
            <Link to="/experiencias" className="block text-gray-700 hover:text-primary">Experiencias</Link>
            <Link to="/historia" className="block text-gray-700 hover:text-primary">Historia</Link>
            <Link to="/contacto" className="block text-gray-700 hover:text-primary">Contacto</Link>
          </div>
        </nav>
      )}
    </div>
  )
}

export default Navbar
