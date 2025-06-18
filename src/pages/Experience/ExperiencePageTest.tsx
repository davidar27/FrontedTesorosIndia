import { ExperienceApi } from "@/services/experience/experience"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"


const ExperiencePageTest = () => {
    const { experience_id } = useParams()
    const [info, setInfo] = useState([])
    const [members, setMembers] = useState([])
    const [products, setProducts] = useState([])
    const [reviewsInfo, setReviewsInfo] = useState([])
    useEffect(() => {
        const fetchData = async () => {
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
        }
        fetchData()
    }, [])
    return (
        <></>
    )
}

export default ExperiencePageTest