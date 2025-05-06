// export interface Port {
//   id: number;
//   name: string;
//   country: string;
//   latitude: number;
//   longitude: number;
//   size: string;
//   un_locode: string;
//   image_url: string;
// }

export interface Port {
  Country: string;
  Port_Name: string;
  UN_Code: string;
  Vessels_in_Port: number;
  Departures_Last_24_Hours: number;
  Arrivals_Last_24_Hours: number;
  Expected_Arrivals: number;
  Type: string;
  Area_Local: string;
  Area_Global: string;
  Also_known_as: string;
  
  // Properties needed for map functionality
  id?: number; // Optional, as it might not be in the backend
  latitude?: number;
  longitude?: number;
  name?: string;
  country?: string;
  un_locode?: string;
  area_local?: string;
  image_url?: string;
}