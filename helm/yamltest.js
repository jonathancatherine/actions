export const setValueInObject = (object, path, value) => eval(`object.${path} = "${value}"`);