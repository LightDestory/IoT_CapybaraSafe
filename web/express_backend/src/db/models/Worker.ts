import {
  Model,
  Table,
  Column,
  AutoIncrement,
  PrimaryKey,
  AllowNull,
  DataType,
  HasMany,
  BelongsToMany
} from "sequelize-typescript";
import Assignment from "./Assignment";
import RemoteTracking from "./RemoteTracking";
import Activity from "./Activity";

/**
 * Worker model
 * @class Worker
 * @extends Model
 */
@Table({ timestamps: false })
export default class Worker extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  first_name!: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  last_name!: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  profession!: string;

  @BelongsToMany(() => Activity, () => Assignment, "worker_id")
  activities!: Activity[];

  @HasMany(() => RemoteTracking, "worker_id")
  remote_trackings!: RemoteTracking[];
}
