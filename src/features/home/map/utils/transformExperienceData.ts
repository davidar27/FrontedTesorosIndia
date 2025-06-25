import { DEFAULT_POSITION } from "@/features/home/map/constans/TouristRouteConstants";
import { Experience } from "@/features/home/map/types/TouristRouteTypes";

export const transformExperienceData = (experience: Experience): Experience => {
    const { lat, lng, ...rest } = experience;
    return {
        ...rest,
        position: {
            lat: lat || DEFAULT_POSITION.lat,
            lng: lng || DEFAULT_POSITION.lng
        }
    };
};