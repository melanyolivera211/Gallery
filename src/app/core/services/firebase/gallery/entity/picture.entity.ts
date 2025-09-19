import { Entity } from '@models/entity.model';
import { BucketFile } from '@models/bucket-file.model';

export interface Picture extends Entity, BucketFile { };