import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <>

      <button onClick={toggleMenu} className="md:hidden text-gray-700">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {/* Desktop Menu */}
      <nav className="hidden md:flex space-x-8">
        <Link to="/" className="text-gray-700 hover:text-primary">Inicio</Link>
        <Link to="/experiencias" className="text-gray-700 hover:text-primary">Experiencias</Link>
        <Link to="/historia" className="text-gray-700 hover:text-primary">Historia</Link>
        <Link to="/contacto" className="text-gray-700 hover:text-primary">Contacto</Link>
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
    </>
  )
}

export default Navbar
