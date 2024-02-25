import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AllowNull,
  DataType,
  ForeignKey,
  BelongsTo
} from "sequelize-typescript";

import Activity from "./Activity";
import Worker from "./Worker";

/**
 * Assignment model
 * @class Assignment
 * @extends Model
 */
@Table({ timestamps: false })
export default class Assignment extends Model {
  @PrimaryKey
  @AllowNull(false)
  @ForeignKey(() => Worker)
  @Column(DataType.INTEGER)
  worker_id!: number;

  @BelongsTo(() => Worker, "worker_id")
  worker!: Worker;

  @PrimaryKey
  @AllowNull(false)
  @ForeignKey(() => Activity)
  @Column(DataType.INTEGER)
  activity_id!: number;

  @BelongsTo(() => Activity, "activity_id")
  activity!: Activity;
}
