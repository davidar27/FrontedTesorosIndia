import LoadingSpinner from "@/components/layouts/LoadingSpinner"
import { ExperienceApi } from "@/services/experience/experience"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const ExperiencePageTest = () => {
    const { experience_id } = useParams()
    const [info, setInfo] = useState([])
    const [members, setMembers] = useState([])
    const [products, setProducts] = useState([])
    const [reviewsInfo, setReviewsInfo] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const infoData = await ExperienceApi.getInfo(Number(experience_id));
                setInfo(infoData);
                const reviewsData = await ExperienceApi.getReviews(Number(experience_id));
                setReviewsInfo(reviewsData);
                const productsData = await ExperienceApi.getProducts(Number(experience_id));
                setReviewsInfo(productsData);
                const membersData = await ExperienceApi.getMembers(Number(experience_id));
                setReviewsInfo(reviewsData);
                console.log("info: ", infoData);
                console.log("members: ", membersData);
                console.log("products: ", productsData);
                console.log("reviews: ", reviewsData);
                setIsLoading(false)
            }
            catch {
                setError(true)
            }
        }
        fetchData()
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner message="Cargando información de la experiencia..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-600 text-lg">Error al cargar la información de la experiencia</p>
                <p className="text-gray-500 mt-2">Por favor, intente más tarde</p>
            </div>
        );
    }

    return (
        <></>
    )
}

export default ExperiencePageTest