import { UUID } from "crypto";
import { User } from "../models/user.domain";

export abstract class RefreshAccessUseCase {
    abstract execute(id: UUID, tokenId: string): Promise<User>;
}