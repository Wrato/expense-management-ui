import type { LoginRequest } from "../models/LoginRequest";
import type { User } from "../models/User";

import { users } from "../mocks/users";

export async function login(
    request: LoginRequest
): Promise<User | null> {

    const user = users.find(
        u =>  u.username === request.username &&
              u.password === request.password
    );

    return user ?? null;
}