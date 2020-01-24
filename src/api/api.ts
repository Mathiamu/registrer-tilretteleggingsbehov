import { RestKandidat, Status } from './RestKandidat';

export const hentKandidat = async (fnr: string): Promise<RestKandidat> => {
    try {
        const response = await fetch('/finn-kandidat-api/kandidater/fnr/' + fnr, medCookies);
        const kandidat = await response.json();
        return Promise.resolve({
            status: Status.Suksess,
            data: kandidat,
        });
    } catch (error) {
        return Promise.resolve({
            status: Status.Feil,
            error: 'Kunne ikke hente kandidater',
        });
    }
};

const medCookies: RequestInit = {
    credentials: 'same-origin',
};
