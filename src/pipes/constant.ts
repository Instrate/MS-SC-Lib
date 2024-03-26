import { PreconditionFailedException } from "@nestjs/common";

export const ValidationException = new PreconditionFailedException({
	message: "validationError",
});
