"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePolicyDtoSchema = exports.createPolicyDtoSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../types/enums");
exports.createPolicyDtoSchema = zod_1.z.object({
    insuredEntityId: zod_1.z.string().uuid(),
    policyNumber: zod_1.z.string().min(1),
    productName: zod_1.z.string().min(1),
    premium: zod_1.z.number().positive(),
    coverageJson: zod_1.z.record(zod_1.z.any()).default({}),
    startDate: zod_1.z.string().datetime(),
    endDate: zod_1.z.string().datetime(),
});
exports.updatePolicyDtoSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(enums_1.PolicyStatus).optional(),
    premium: zod_1.z.number().positive().optional(),
    coverageJson: zod_1.z.record(zod_1.z.any()).optional(),
    endDate: zod_1.z.string().datetime().optional(),
});
//# sourceMappingURL=policy.dto.js.map