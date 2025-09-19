import { Entity } from '@models/entity.model';

export interface User extends Entity {
  name: string;
  surname: string;
  picture: string;
}
