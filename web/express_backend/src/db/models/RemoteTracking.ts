import { Model, Table, Column, AutoIncrement, PrimaryKey, Default, AllowNull, DataType, IsDate, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Anchor from './Anchor';
import Worker from './Worker';
import TrackingDevice from './TrackingDevice';
import Activity from './Activity';

@Table({ timestamps: false })
export default class RemoteTracking extends Model {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @IsDate
    @Column(DataType.DATE)
    timestamp!: Date;

    @AllowNull(false)
    @ForeignKey(() => Anchor)
    @Column(DataType.INTEGER)
    anchor_id!: number;

    @BelongsTo(() => Anchor, "anchor_id")
    anchor!: Anchor;

    @AllowNull(false)
    @ForeignKey(() => Worker)
    @Column(DataType.INTEGER)
    worker_id!: number;

    @BelongsTo(() => Worker, "worker_id")
    worker!: Worker;

    @AllowNull(false)
    @ForeignKey(() => TrackingDevice)
    @Column(DataType.INTEGER)
    device_id!: number;

    @BelongsTo(() => TrackingDevice, "device_id")
    device!: TrackingDevice;

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
}