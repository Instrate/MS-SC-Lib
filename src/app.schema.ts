import { LoggerSchema } from "./services/logger/logger.schema";
import { LoggedUnit } from "./services/logger/logger.unit";
import { ClassConstructor } from "class-transformer";
import { EnvService } from "./services/env/env.service";
import { Highlight } from "./functions/text";
import { EnumTextModifiers } from "./constants/text";
import { AppName } from "./constants/app";

export class AppSchema<TypeEnvSchema extends LoggerSchema> extends LoggedUnit {
	public readonly env: TypeEnvSchema;

	constructor(
		schema: ClassConstructor<TypeEnvSchema>,
		env_data_default: Partial<TypeEnvSchema>,
	) {
		super();
		this.env = new EnvService(schema, env_data_default).properties;
		this.LogInformation(
			`Starting ${Highlight(
				AppName,
				EnumTextModifiers.BgYellow,
				EnumTextModifiers.Underscore,
			)} service`,
		);
	}
}
