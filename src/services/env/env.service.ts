import { ClassConstructor } from "class-transformer";
import { ValidationHandler } from "../../pipes/helper";
import { RuntimeException } from "@nestjs/core/errors/exceptions";
import { config } from "dotenv";
import { ConfigEnv } from "../../config/config";
import { LoggerSchema } from "../logger/logger.schema";

config();

export class EnvService<EnvSchema extends LoggerSchema = LoggerSchema> {
	static Ref: EnvService;

	readonly properties: EnvSchema;

	constructor(
		private schema: ClassConstructor<EnvSchema>,
		default_data: Partial<EnvSchema>,
	) {
		this.properties = this.LoadConfiguration(schema, default_data);
		EnvService.Ref ??= this;
	}

	static LoadBaseConfiguration<TypeSchema>(
		env_data: ClassConstructor<TypeSchema>,
		default_data: Partial<TypeSchema>,
	): TypeSchema {
		const res = default_data as {
			[key: string]: string;
		};
		const plain_data = env_data as unknown as {
			USERDOMAIN: string;
			USERPROFILE: string;
		} & TypeSchema;
		const restriction_list = [
			...ConfigEnv.IgnoreInIncludeList,
			plain_data?.USERDOMAIN,
			...(plain_data?.USERPROFILE
				? plain_data?.USERPROFILE.split("\\") || []
				: []),
		].filter((val) => !!val);
		for (const [key, value] of Object.entries(env_data)) {
			if (key.toUpperCase() !== key) {
				continue;
			}
			if (
				!ConfigEnv.PassIncludeValues.some((val: string) => key.includes(val))
			) {
				if (
					restriction_list.some(
						(val) =>
							(value as string)
								.toLowerCase()
								.includes(val.toString().toLowerCase()) ||
							key.includes(val) ||
							ConfigEnv.IgnoreInIncludeList.includes(key),
					)
				) {
					continue;
				}
			}
			res[key] = value;
		}
		return res as TypeSchema;
	}

	LoadConfiguration(
		schema: ClassConstructor<EnvSchema>,
		default_data: Partial<EnvSchema>,
	) {
		const env_data = EnvService.LoadBaseConfiguration(
			process.env as unknown as typeof schema,
			default_data,
		);
		const errors = ValidationHandler.ValidateValue(env_data, schema);
		if (errors?.length) {
			console.dir(
				errors.map(({ value, property, constraints }) => ({
					value,
					property,
					constraints,
				})),
			);
			throw new RuntimeException("environmental data error");
		}
		return env_data;
	}
}
