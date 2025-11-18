"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assessRiskDtoSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../types/enums");
exports.assessRiskDtoSchema = zod_1.z.object({
    insuredEntityId: zod_1.z.string().uuid(),
    scenarioType: zod_1.z.nativeEnum(enums_1.ScenarioType),
    parameters: zod_1.z.record(zod_1.z.any()).optional().default({}),
});
//# sourceMappingURL=risk.dto.js.map