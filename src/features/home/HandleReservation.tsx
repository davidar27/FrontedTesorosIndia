// // import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import Button from "@/components/ui/buttons/Button";
// import SelectInput from "@/components/ui/inputs/SelectInput";
// import DateInput from "@/components/ui/inputs/DateInput";
// import { PackagesApi } from "@/services/home/packages";
// import Input from "@/components/ui/inputs/Input"

// interface Detail {
//   detail_id?: number;
//   detail?: string;
// }

// interface Package {
//   package_id?: number;
//   name?: string;
//   description?: string;
//   image?: string;
//   price?: string;
//   capacity?: number;
//   details?: Detail[];
// }

// export default function QuickReservation() {
//   const [date, setDate] = useState("");
//   const [touched, setTouched] = useState(false);

//   const [packages, setPackages] = useState<Package[]>([])
//   const [packageSelected, setPackageSelected] = useState<Package>({})
//   const [maxPeopleSelected, setMaxPeopleSelected] = useState(0);
//   const [people, setPeople] = useState(0);

//   const handlePackageSelected = (package_id: number) => {
//     const packageFinded: any = packages.find((p) => p.package_id == package_id)
//     setPackageSelected(packageFinded)
//   }

//   const handleReservation = () => {
//     setTouched(true);
//     // manejar reserva
//   };

//   useEffect(() => {
//     const fecthData = async () => {
//       const packagesData: Package[] = await PackagesApi.getPackages()
//       setPackages([...packagesData])
//       setPackageSelected(packagesData[0])
//       setMaxPeopleSelected(packagesData[0].capacity as any)
//     }
//     fecthData()
//   }, [])

//   useEffect(() => {
//     setMaxPeopleSelected(packageSelected.capacity as number)
//   }, [packageSelected])


//   return (
//     <div className="bg-primary rounded-xl shadow-lg overflow-hidden ">
//       <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div className="space-y-1">
//           <label>
//             Maxima
//           </label>
//           <Input value={people} onChange={(e: any) => setPeople(e.target.value)}></Input>
//           maximo: {maxPeopleSelected}
//         </div>

//         {/* Input de fecha personalizado */}
//         <DateInput
//           date={date}
//           setDate={setDate}
//           touched={touched}
//         />

//         {/* Select de paquetes */}
//         <SelectInput
//           id="package"
//           label="Paquete"
//           value={packageSelected.package_id as number}
//           options={packages.map((p: Package) => ({ value: (p.package_id as number), label: (p.name as string) }))}
//           onChange={(package_id: any) => handlePackageSelected(package_id)}
//         />

//         {/* Botón de reserva */}
//         <div className="flex items-end">
//           <Button
//             onClick={handleReservation}
//             className="bg-white !text-primary py-3 px-10 rounded-xl  !border-white hover:!bg-primary  hover:!text-white"
//             type="submit"
//           >
//             Reservar ahora
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }