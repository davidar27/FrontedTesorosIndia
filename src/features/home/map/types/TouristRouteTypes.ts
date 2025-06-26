export interface Position {
  lat: number;
  lng: number;
}

export interface Experience {
  id: number;
  name: string;
  description: string;
  location: string;
  type?: string;
  position: Position;
  lat?: number;
  lng?: number;
}

export interface LocationCardProps {
  location: Experience;
  index: number;
  onClick?: () => void;
}

export interface ActivityTagProps {
  activity: string;
}

export interface RecommendationProps {
  text: string;
}

export interface SidePanelProps {
  locations: Experience[];
  onLocationClick?: (location: Experience) => void;
}

export interface MapSectionProps {
  locations: Experience[];
}

export interface RouteDescriptionProps {
  locations: Experience[];
}

export interface ExperienceCardProps {
  location: Experience ;
}
