import { ServiceApiResponse } from "@/common/domain/types/api-response.dto";
import { AuthResult } from "../models/authResult.model";

export abstract class IdentityService {
  abstract signin(email: string, password: string, domain: string | undefined):  ServiceApiResponse<AuthResult>;
  abstract signup(
    email: string,
    password: string | undefined,
    name: string,
    lastname: string,
    domain: string | undefined,
  ): ServiceApiResponse<unknown>;
  abstract refreshTokenAccess(refreshToken: string, domain: string | undefined): ServiceApiResponse<AuthResult>;
  abstract logout(refreshToken: string): ServiceApiResponse<undefined>;
  abstract confirmEmail(confirmationToken: string, domain: string | undefined): ServiceApiResponse<AuthResult>;
}
