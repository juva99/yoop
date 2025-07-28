import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as proj4 from 'proj4';

@Injectable()
export class convertXYService {
  private readonly WGS84 = 'EPSG:4326'; // Lat, Lng
  private readonly ITM =
    '+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +units=m +no_defs';

  convertXYtoLatLon(x: number, y: number): [number, number] {
    if (!isNaN(x) && !isNaN(y) && x != null && y != null) {
      const [lon, lat] = proj4(this.ITM, this.WGS84, [x, y]);
      return [lat, lon];
    } else throw new InternalServerErrorException(`${x}, ${y} not valid`);
  }
}
