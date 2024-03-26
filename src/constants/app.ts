const split = __filename.split(/[\/\\]/gs);

const DistIndex = split.indexOf("dist");

export const AppName = split[DistIndex - 1];

export const AppFolder = split.slice(0, DistIndex).join("/");
