import { Sensor } from './sensor';

export interface SensorData {
  id: string;
  sensor: Sensor;
  latitude: string;
  longitude: string;
  depth: number;
  energy: number;
}
