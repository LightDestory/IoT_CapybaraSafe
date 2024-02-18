import {
  Model,
  Table,
  Column,
  AutoIncrement,
  PrimaryKey,
  AllowNull,
  DataType,
  Min,
  Max,
  Default,
  IsIn,
  IsDate,
  HasMany,
  Sequelize
} from "sequelize-typescript";
import Alert from "./Alert";
import Assignment from "./Assignment";
import RemoteTracking from "./RemoteTracking";

@Table({ timestamps: false })
export default class Activity extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  text_description!: string;

  @AllowNull(false)
  @Min(0)
  @Max(120)
  @Column(DataType.INTEGER)
  duration_minute!: number;

  @AllowNull(false)
  @IsDate
  @Default(Sequelize.literal("CURRENT_TIMESTAMP"))
  @Column(DataType.DATE)
  scheduled_date!: Date;

  @AllowNull(false)
  @IsIn([["in progress", "to be completed", "scheduled", "completed"]])
  @Column(DataType.STRING(50))
  status!: string;

  @HasMany(() => Alert, "activity_id")
  alerts!: Alert[];

  @HasMany(() => Assignment, "activity_id")
  assignments!: Assignment[];

  @HasMany(() => RemoteTracking, "activity_id")
  remote_trackings!: RemoteTracking[];
}
