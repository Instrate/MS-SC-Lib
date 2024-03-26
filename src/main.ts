import { AppBuilder } from "./app.builder";

new AppBuilder().Create().then((builder) => builder.Listen());
