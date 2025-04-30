import { Vessel } from './vessel.model';

export interface Fleet {
  id: number;
  name: string;
  vessels: Vessel[];
}