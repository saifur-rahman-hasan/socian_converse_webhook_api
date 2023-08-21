export function throwIf(condition, error) {
    if (condition) {
        throw error;
    }

    return false
}