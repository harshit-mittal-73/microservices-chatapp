import type { NextFunction, Response } from 'express';
import type { Request } from 'express';
import type { IUser } from "../model/User.js";
export interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}
export declare const isAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=isAuth.d.ts.map