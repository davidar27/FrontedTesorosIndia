import React from 'react';

interface Finca {
  id: number;
  nombre: string;
  emprendedor: string;
  descripcion: string;
}

const AdminPage: React.FC = () => {
  const fincas: Finca[] = [
    {
      id: 1,
      nombre: 'Puerto Arturo',
      emprendedor: 'Arturo Ocampo',
      descripcion: 'La finca Brisa del Gualdual, se halla ubicada...',
    },
    {
      id: 2,
      nombre: 'La Elisa',
      emprendedor: 'Marcela Rivera',
      descripcion: 'La finca Brisa del Gualdual, se halla ubicada...',
    },
    {
      id: 3,
      nombre: 'Brisas del Gualdual',
      emprendedor: 'Jose Ovidio',
      descripcion: 'La finca Brisa del Gualdual, se halla ubicada...',
    },
    {
      id: 4,
      nombre: 'La India',
      emprendedor: 'Diana Osorio',
      descripcion: 'La finca Brisa del Gualdual, se halla ubicada...',
    },
    {
      id: 5,
      nombre: 'La Estrella',
      emprendedor: 'Ossa Estrada',
      descripcion: 'La finca Brisa del Gualdual, se halla ubicada...',
    },
    {
      id: 6,
      nombre: 'El Hedon',
      emprendedor: 'Diana Orihales',
      descripcion: 'La finca Brisa del Gualdual, se halla ubicada...',
    },
  ];

  const handleEdit = (id: number) => {
    console.log('Edit finca with id:', id);
    // In a real app, this would open a modal or navigate to an edit page
  };

  const handleDelete = (id: number) => {
    console.log('Delete finca with id:', id);
    // In a real app, this would show a confirmation dialog and then delete
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Fincas</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Nombre Finca</h2>
        <div className="flex items-center space-x-4 mb-4">
          <span className="font-medium text-gray-600">Empendedor</span>
          <span className="font-medium text-gray-600">Descripción</span>
          <span className="font-medium text-gray-600">Acciones</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre Finca
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empendedor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fincas.map((finca) => (
              <tr key={finca.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {finca.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {finca.emprendedor}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {finca.descripcion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(finca.id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(finca.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;