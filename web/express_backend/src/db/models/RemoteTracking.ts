import {
  Model,
  Table,
  Column,
  PrimaryKey,
  Default,
  AllowNull,
  DataType,
  IsDate,
  ForeignKey,
  BelongsTo
} from "sequelize-typescript";

import Activity from "./Activity";
import Anchor from "./Anchor";
import TrackingDevice from "./TrackingDevice";
import Worker from "./Worker";

/**
 * RemoteTracking model
 * @class RemoteTracking
 * @extends Model
 */
@Table({ timestamps: false })
export default class RemoteTracking extends Model {
  @AllowNull(false)
  @IsDate
  @Column(DataType.DATE)
  timestamp!: Date;

  @AllowNull(false)
  @Default(1)
  @Column(DataType.INTEGER)
  communication_progressive!: number;

  @AllowNull(false)
  @ForeignKey(() => Anchor)
  @Column(DataType.INTEGER)
  anchor_id!: number;

  @BelongsTo(() => Anchor, "anchor_id")
  anchor!: Anchor;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  anchor_signal_strength!: number;

  @PrimaryKey
  @AllowNull(false)
  @ForeignKey(() => Worker)
  @Column(DataType.INTEGER)
  worker_id!: number;

  @BelongsTo(() => Worker, "worker_id")
  worker!: Worker;

  @PrimaryKey
  @AllowNull(false)
  @ForeignKey(() => TrackingDevice)
  @Column(DataType.INTEGER)
  device_id!: number;

  @BelongsTo(() => TrackingDevice, "device_id")
  device!: TrackingDevice;

  @PrimaryKey
  @AllowNull(false)
  @ForeignKey(() => Activity)
  @Column(DataType.INTEGER)
  activity_id!: number;

  @BelongsTo(() => Activity, "activity_id")
  activity!: Activity;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  emergency!: boolean;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  heart_rate!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  saturation!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  temperature!: number;
}
