export interface Lighthouse {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  height: number | null;
  year_built: number | null;
  image_url: string | null;
}