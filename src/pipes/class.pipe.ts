import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
import { ValidationHandler } from "./helper";
import { ClassConstructor } from "class-transformer";
import { ValidationException } from "./constant";
import { TypeOptionalValue } from "./pipes.type";

export class ClassValidationPipe<T extends object> implements PipeTransform<T> {
	constructor(
		private schema: ClassConstructor<T>,
		private logError: boolean = false,
		private isOptional: boolean = false,
		private route?: string,
		private readonly handler = new ValidationHandler(),
	) {}

	transform(value: TypeOptionalValue<T>, metadata: ArgumentMetadata) {
		if (!value) {
			if (!this.isOptional) {
				throw ValidationException;
			}
			return value;
		}
		if (typeof value === "object") {
			if (!Object.keys(value)?.length) {
				throw ValidationException;
			}
		}
		return ValidationHandler.ProceedValue<T>(
			value,
			this.schema,
			metadata,
			this.logError,
			this.route,
		);
	}
}
