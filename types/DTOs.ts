import { User } from "@prisma/client";

export type UserDto = Pick<User, 'banner' | 'id' | 'image' | 'joinDate' | 'status' | 'username'>