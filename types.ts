// types.ts
export type Marker = {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  address: string;
  color: string;
  photos: Array<{ uri: string }>;
  isNew?: boolean;
};