import {
  Model,
  Table,
  Column,
  AutoIncrement,
  PrimaryKey,
  AllowNull,
  DataType,
  IsDate,
  HasMany,
} from "sequelize-typescript";
import RemoteTracking from "./RemoteTracking";
@Table({ timestamps: false })
export default class TrackingDevice extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING(17))
  mac_address!: string;

  @AllowNull(false)
  @IsDate
  @Column(DataType.DATE)
  last_maintenance!: Date;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  firmware_version!: string;

  @HasMany(() => RemoteTracking, "device_id")
  remote_trackings!: RemoteTracking[];
}
