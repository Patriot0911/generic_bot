import path from 'path';

export default function (file: string) {
    return (path.extname(file) === '.ts' || path.extname(file) === '.js');
};
