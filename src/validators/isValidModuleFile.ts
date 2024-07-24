import { moduleDataName } from "@/constants";
import path from "path";

export default function (file: string) {
    return file !== moduleDataName && (path.extname(file) === '.ts' || path.extname(file) === '.js');
};
