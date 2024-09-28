export default function(arg: string) {
    const str = JSON.stringify(arg);
    try {
        return !!JSON.parse(str);
    } catch(e) {
        return false;
    };
};
