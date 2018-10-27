import {
  AllowNull,
  Column,
  CreatedAt,
  HasMany,
  Model,
  Table,
  Unique,
  UpdatedAt
} from "sequelize-typescript"
import Session from "./session"

@Table
export default class User extends Model<User> {
  @AllowNull(false)
  @Column
  public firstName: string

  @AllowNull(false)
  @Column
  public lastName: string

  @AllowNull(false)
  @Unique
  @Column
  public email: string

  @AllowNull(false)
  @Column
  public password: string

  @HasMany(() => Session, "userId")
  public sessions: Session[]

  @CreatedAt
  public createdAt: Date

  @UpdatedAt
  public updatedAt: Date

  public toJSON() {
    const clone = { ...(this.dataValues as any) }
    delete clone.password

    return clone
  }
}
