import { Search } from "lucide-react";
import { motion } from "framer-motion";

const SearchBar = () => (
    <motion.div
        className="relative w-40 sm:w-45 md:w-80 lg:w-100  !text-black"
        whileFocus={{ scale: 1.02 }}
    >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 " size={20} />
        <motion.input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 py-0.5 md:py-1.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white/90"
            whileHover={{
                backgroundColor: "rgba(255, 255, 255, 1)",
                transition: { duration: 0.2 }
            }}
        />

    </motion.div >

);

export default SearchBar;