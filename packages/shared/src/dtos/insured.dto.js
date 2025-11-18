"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInsuredDtoSchema = exports.createInsuredDtoSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../types/enums");
exports.createInsuredDtoSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(enums_1.InsuredEntityType),
    name: zod_1.z.string().min(1),
    taxId: zod_1.z.string().optional(),
    address: zod_1.z.string().min(1),
    phoneNumber: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional().default({}),
});
exports.updateInsuredDtoSchema = exports.createInsuredDtoSchema.partial();
//# sourceMappingURL=insured.dto.js.map