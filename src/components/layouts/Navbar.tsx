import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const Navbar: React.FC = () => {
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
        <Link to="/nosotros" className="hover:text-primary">Nosotros</Link>
        <Link to="/productos" className="hover:text-primary">Productos</Link>
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
            <Link to="/nosotros" className="block text-gray-700 hover:text-primary">Nosotros</Link>
            <Link to="/productos" className="block text-gray-700 hover:text-primary">Productos</Link>
          </div>
        </nav>
      )}
    </div>
  )
}

export default Navbar
