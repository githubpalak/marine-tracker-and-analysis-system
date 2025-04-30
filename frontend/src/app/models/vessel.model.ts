export interface Position {
  id: number;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
  status: string;
  timestamp: string;
}

export interface Vessel {
  id: number;
  mmsi: string;
  name: string;
  vessel_type: string;
  flag: string;
  length: number;
  width: number;
  image_url: string;
  last_position: Position;
}