import { Injectable } from '@nestjs/common';

@Injectable()
export class FieldManagersService {
    private fieldManagers = [];

    getAllFieldManagers() {
        return this.fieldManagers;
    }
    
}
