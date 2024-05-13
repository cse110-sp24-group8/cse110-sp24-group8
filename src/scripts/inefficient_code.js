export function complexFunction(num) {
    if (num > 10) {
        if (num < 20) {
            return num * 2;
        } else {
            return num - 2;
        }
    } else if (num > 5) {
        return num + 2;
    } else {
        if (num > 0) {
            return num;
        } else {
            return -num;
        }
    }
}
