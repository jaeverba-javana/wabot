export interface CookieManagerOptions {
    key: string,
    value: string,
    path?: string,
    domain?: string,
    max_age?: string,
    expires?: string,
    secure?: string,
    samesite?: string
}

export const cookieManager = {
    add: (values: CookieManagerOptions) => {
        let key_value;
        // noinspection ExceptionCaughtLocallyJS
        try {
            if ((values.key && values.value) || values.value === "") key_value = values.key + "=" + values.value;
            else if (!values.key && !values.value) { // noinspection ExceptionCaughtLocallyJS
                throw new Error("Propiedades 'key' y 'valor' no detectadas");
            } else { // noinspection ExceptionCaughtLocallyJS
                if (!values.key) { // noinspection ExceptionCaughtLocallyJS
                    throw new Error("Propiedad 'key' no detectada")
                } else { // noinspection ExceptionCaughtLocallyJS
                    throw new Error("Propiedad 'valor' no detectada");
                }
            }
            let path = values.path ? ";path=" + values.path : "";
            let domain = values.domain ? ";domain=" + values.domain : "";
            let max_age = values.max_age ? ";max-age=" + values.max_age : "";
            let expires = values.expires ? ";expires=" + values.expires : "";
            let secure = values.secure ? ";secure" : "";
            let samesite = values.samesite === "strict" ? ";samesite=strict" : values.samesite === "lax" ? ";samesite=lax" : "";
            document.cookie = key_value + path + domain + max_age + expires + secure + samesite;
        } catch (msg) {
            console.error("Ha ocurrido un error con la creación de la cookie \nEspecificación del error: " + msg);
        }
    },

    get: (key:string): string | null => {
        try {
            return new RegExp('\\b(?<=' + key + '\\=)(?:\\w|\\s)*\\b').exec(document.cookie)[0];
        } catch {
            return '';
        }
    },

    exist: (key:string):boolean => {
        return new RegExp('\\b' + key + '\\b').test(document.cookie);
    },

    samesite: {STRICT: "strict", LAX: "lax"}
};