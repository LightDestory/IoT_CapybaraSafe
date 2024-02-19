import {
  Model,
  Table,
  Column,
  AutoIncrement,
  PrimaryKey,
  AllowNull,
  DataType,
  ForeignKey,
  BelongsTo
} from "sequelize-typescript";
import Worker from "./Worker";
import Activity from "./Activity";

/**
 * Assignment model
 * @class Assignment
 * @extends Model
 */
@Table({ timestamps: false })
export default class Assignment extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @ForeignKey(() => Worker)
  @Column(DataType.INTEGER)
  worker_id!: number;

  @BelongsTo(() => Worker, "worker_id")
  worker!: Worker;

  @AllowNull(false)
  @ForeignKey(() => Activity)
  @Column(DataType.INTEGER)
  activity_id!: number;

  @BelongsTo(() => Activity, "activity_id")
  activity!: Activity;
}
