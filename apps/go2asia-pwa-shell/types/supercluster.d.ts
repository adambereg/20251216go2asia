declare module 'supercluster' {
  export type BBox = [west: number, south: number, east: number, north: number];

  export interface SuperclusterOptions {
    radius?: number;
    maxZoom?: number;
    minZoom?: number;
    extent?: number;
    nodeSize?: number;
    map?: (props: any) => any;
    reduce?: (accumulated: any, props: any) => void;
  }

  export default class Supercluster<P = any, C = any> {
    constructor(options?: SuperclusterOptions);
    load(points: Array<GeoJSON.Feature<GeoJSON.Point, P>>): this;
    getClusters(bbox: BBox, zoom: number): Array<GeoJSON.Feature<GeoJSON.Point, any>>;
    getClusterExpansionZoom(clusterId: number): number;
  }
}

