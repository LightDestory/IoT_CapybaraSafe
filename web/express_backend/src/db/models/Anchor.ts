import {
  Model,
  Table,
  Column,
  AutoIncrement,
  PrimaryKey,
  AllowNull,
  DataType,
  HasMany,
  Default
} from "sequelize-typescript";
import RemoteTracking from "./RemoteTracking";

/**
 * Anchor model
 * @class Anchor
 * @extends Model
 */
@Table({ timestamps: false })
export default class Anchor extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING(17))
  mac_address!: string;

  @AllowNull(false)
  @Default("working")
  @Column(DataType.STRING(255))
  status!: string;

  @HasMany(() => RemoteTracking, "anchor_id")
  remote_trackings!: RemoteTracking[];
}
