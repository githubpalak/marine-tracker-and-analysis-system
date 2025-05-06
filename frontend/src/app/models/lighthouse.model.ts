// export interface Lighthouse {
//   id: number;
//   name: string;
//   country: string;
//   latitude: number;
//   longitude: number;
//   height: number | null;
//   year_built: number | null;
//   image_url: string | null;
// }

// src/app/models/lighthouse.model.ts
export interface Lighthouse {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  website?: string;
  // The following properties are in the database model but not currently returned from CSV
  country?: string;
  height?: number | null;
  year_built?: number | null;
  image_url?: string | null;
}