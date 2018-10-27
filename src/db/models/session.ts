import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt
} from "sequelize-typescript"
import User from "./user"

@Table
export default class Session extends Model<Session> {
  @AllowNull(false)
  @Column
  public issuedAt: number

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  public userId: number

  @BelongsTo(() => User)
  public user: User

  @CreatedAt
  public createdAt: Date

  @UpdatedAt
  public updatedAt: Date
}
