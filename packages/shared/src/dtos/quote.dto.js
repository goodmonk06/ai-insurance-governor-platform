"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuoteStatusDtoSchema = exports.createQuoteDtoSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../types/enums");
exports.createQuoteDtoSchema = zod_1.z.object({
    insuredEntityId: zod_1.z.string().uuid(),
    answersJson: zod_1.z.record(zod_1.z.any()),
});
exports.updateQuoteStatusDtoSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(enums_1.QuoteStatus),
    quotedPremium: zod_1.z.number().positive().optional(),
    quotedCoverage: zod_1.z.record(zod_1.z.any()).optional(),
});
//# sourceMappingURL=quote.dto.js.map