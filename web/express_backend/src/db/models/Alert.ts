import Activity from "./Activity";
import {
  Model,
  Table,
  Column,
  AutoIncrement,
  PrimaryKey,
  AllowNull,
  DataType,
  Default,
  IsDate,
  ForeignKey,
  BelongsTo,
  Sequelize
} from "sequelize-typescript";

/**
 * Alert model
 * @class Alert
 * @extends Model
 */
@Table({ timestamps: false })
export default class Alert extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  text_description!: string;

  @AllowNull(true)
  @ForeignKey(() => Activity)
  @Column(DataType.INTEGER)
  activity_id!: number;

  @BelongsTo(() => Activity, "activity_id")
  activity!: Activity;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  is_broadcast!: boolean;

  @AllowNull(false)
  @IsDate
  @Default(Sequelize.literal("CURRENT_TIMESTAMP"))
  @Column(DataType.DATE)
  send_date!: Date;
}
