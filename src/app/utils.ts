import { $ } from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik/build";
import { RouteLocation } from "@builder.io/qwik-city";
import { GetLocaleFn, GetTranslationFn, GetUserLanguageFn, Locale, SetLocaleFn, TranslateFn, Translation } from "../library/types";

export const getTranslateFn = (loc: RouteLocation, doc: any): TranslateFn => {
    // Fetch translation data
    const getTranslation$: GetTranslationFn = $(async (language: string, asset: string | Translation) => {
        let url = '';
        // Absolute urls on server
        if (isServer) {
            url = new URL(loc.href).origin;
        }
        url += `${asset}-${language}.json`;
        const data = await fetch(url); // fetch requires at least nodejs 18
        return data.json();
    });

    // Get user language by accept-language header (on server)
    const getUserLanguage$: GetUserLanguageFn = $(() => {
        const headers = getSsrHeadersResponse(doc);

        if (!headers?.['acceptlanguage']) return null;
        return headers['acceptlanguage'].split(';')[0].split(',')[0];
    });

    // Store locale in cookie (on client)
    const setLocale$: SetLocaleFn = $((locale: Partial<Locale>) => {
        document.cookie = `locale=${JSON.stringify(locale)}`; // Session cookie
    });

    // Get locale from cookie (on server)
    const getLocale$: GetLocaleFn = $(() => {
        const headers = getSsrHeadersResponse(doc);

        if (!headers?.['cookie']) return null;
        const result = new RegExp('(?:^|; )' + encodeURIComponent('locale') + '=([^;]*)').exec(headers['cookie']);
        return result ? JSON.parse(result[1]) : null;
    });

    return {
        /* getTranslation$: getTranslation$, */
        getUserLanguage$: getUserLanguage$,
        setLocale$: setLocale$,
        getLocale$: getLocale$
    };
}

// Get the headers (that will return in endpointResponse)
export const getHeaders = (request: any) => {
    const cookie = request.headers?.get('cookie') ?? undefined;
    const acceptLanguage = request.headers?.get('accept-language') ?? undefined;

    return {
        status: 200,
        headers: {
            cookie: cookie,
            acceptLanguage: acceptLanguage
        }
    };
}

export const getSsrHeadersResponse = (doc: any) =>
    doc?._qwikUserCtx?.qcResponse?.headers || null;
