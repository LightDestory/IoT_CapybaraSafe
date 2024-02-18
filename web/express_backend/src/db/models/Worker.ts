import {
  Model,
  Table,
  Column,
  AutoIncrement,
  PrimaryKey,
  AllowNull,
  DataType,
  HasMany
} from "sequelize-typescript";
import Assignment from "./Assignment";
import RemoteTracking from "./RemoteTracking";

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

  @HasMany(() => Assignment, "worker_id")
  assignments!: Assignment[];

  @HasMany(() => RemoteTracking, "worker_id")
  remote_trackings!: RemoteTracking[];
}
