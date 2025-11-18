"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDtoSchema = exports.loginDtoSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../types/enums");
exports.loginDtoSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
exports.registerDtoSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    name: zod_1.z.string().min(1),
    tenantId: zod_1.z.string().uuid(),
    role: zod_1.z.nativeEnum(enums_1.UserRole),
});
//# sourceMappingURL=auth.dto.js.map