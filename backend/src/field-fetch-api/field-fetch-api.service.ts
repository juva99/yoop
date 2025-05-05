import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateFieldDto } from 'src/fields/dto/create-field.dto';
import { convertXYService } from './convertXY.service';
import { GameType } from 'src/enums/game-type.enum';
import { City } from 'src/enums/cities.enum';
import { FieldsService } from 'src/fields/fields.service';

@Injectable()
export class FieldFetchApiService {
        constructor(private readonly httpService: HttpService,
            private readonly convertXYService: convertXYService,
            private readonly fieldService: FieldsService,
        ) {}

        async getFields(): Promise<void> {
            let lat;
            let lon;
            const gameTypes: GameType[] = [];
            const createFieldDtos: CreateFieldDto[] = [];
            const openingHours = [ `מבוקר ועד לילה`,
              `פתוח ללא הגבלה`,
              `בוקר בלבד`,
              `כניסה בתשלום במקום`,
              `אחה"צ ולילה`,
              `אחה"צ בלבד`];

            const basketballTypes = [   `אולם ספורט קטן – 15x24 מ'`,
              `אולם ספורט בינוני – 32x19 מ'`,
              `מגרש כדורסל – 19X32 מ'`,
              `מגרש ספורט משולב – 43X32 מ'`,
             `מגרש ספורט במידות אחרות – לא תקני"`];
            
             const footballTypes = [`מגרש ספורט משולב – 43X32 מ'`,
 `מגרש כדורגל – 45X90 מ'`,
 `מגרש שחבק דשא סינטטי`,
  'מגרש כדורגל - לא תקני',
`אצטדיון כדורגל – 105X70 מ'`,
`מגרש ספורט במידות אחרות – לא תקני`];

           const response = await firstValueFrom(
                     this.httpService.get(`https://data.gov.il/api/3/action/datastore_search`, {
                       params: {
                        resource_id: '2304b5de-c720-4b5c-bbc7-4cbab85e0ae8',
                       },
                     }),
                   );

                   const records = response.data.result.records;
                   records.forEach(record => {
                     if (openingHours.some((openingHours => openingHours === record['פנוי לפעילות']))) {
                      console.log('ציר X:', record['ציר X'], 'ציר Y:', record['ציר Y']);
                      const cityKey = record['רשות מקומית']?.trim(); 
                      if(record['ציר X'] && record['ציר X'] && !Number.isNaN(Number(record['ציר X'])) && !Number.isNaN(Number(record['ציר Y']))){
                      [lat, lon] = this.convertXYService.convertXYtoLatLon(parseFloat(record['ציר X']), parseFloat(record['ציר Y']));
                      
                      // Check if the type is in basketballTypes
                      if (basketballTypes.some(type => type === record['סוג מתקן'])) {
                        gameTypes.push(GameType.BasketBall);
                      }

                      // Check if the type is in footballTypes
                      if (footballTypes.some(type => type === record['סוג מתקן'])) {
                        gameTypes.push(GameType.FootBall);
                      }

                      if(gameTypes.length > 0){
                        createFieldDtos.push({
                          gameTypes: [...gameTypes],
                          fieldName: record['שם המתקן'],
                          isManaged: false,
                          fieldLat: lat,
                          fieldLng: lon,
                          city: record['רשות מקומית'],
                          fieldAddress: `${record['רחוב']} ${record['מספר בית']}`
                        })
                        gameTypes.length = 0;
                      }
                     }
                    }
                   });

                   this.fieldService.createMany(createFieldDtos);
        }

        async getCities(): Promise<any>{
          const uniqueValues = new Set();
          const yishuvMap = new Map();
          const response = await firstValueFrom(
            this.httpService.get(`https://data.gov.il/api/3/action/datastore_search`, {
              params: {
               resource_id: '2304b5de-c720-4b5c-bbc7-4cbab85e0ae8',
              },
            }),
          );

          const records = response.data.result.records;
      
          for (const record of records) {
            const yishuv = record['ישוב'];
            const authority = record['רשות מקומית'];
      
            if (yishuv && authority && !yishuvMap.has(yishuv)) {
              yishuvMap.set(yishuv, authority);
            }
          }
          const result = Array.from(yishuvMap.entries()).map(([yishuv, authority]) => ({
            yishuv,
            authority
          }));

          for(const record of records) {
            const yishuv = record['ישוב'];
            const authority = record['רשות מקומית'];
            if(yishuv)
              uniqueValues.add(yishuv);
            else
              uniqueValues.add(authority);
          }
          return [...uniqueValues];
        }
}
