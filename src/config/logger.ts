import { config } from "dotenv";
import * as defaultConfiguration from "./logger.json";

config();

export const LoggerConfiguration = defaultConfiguration;
