import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as proj4 from 'proj4';

@Injectable()
export class convertXYService {
  private readonly fromProjection = 'EPSG:3857';
  private readonly toProjection = 'WGS84';

  convertXYtoLatLon(x: number, y: number): [number, number] {
    if(!isNaN(x) && !isNaN(y)){
    const [lon, lat] = proj4(this.fromProjection, this.toProjection, [x, y]);
    console.log(`Converted [${x}, ${y}] → [${lat}, ${lon}]`);
    return [lat, lon];
    }
    else throw new InternalServerErrorException(`${x}, ${y} not valid`);
  }
}