import React, { FunctionComponent, useEffect, useState } from 'react';
import Registrering from './registrering/Registrering';
import Visning from './visning/Visning';
import { Normaltekst } from 'nav-frontend-typografi';
import { ikkeLastet, lasterInn, RestKandidat, Status } from './api/RestKandidat';
import { hentKandidat } from './api/api';
import Endring from './endring/Endring';

export enum Visningstype {
    VisTilretteleggingsbehov = 'VIS_TILRETTELEGGINGSBEHOV',
    RegistrerTilretteleggingsbehov = 'REGISTRER_TILRETTELEGGINGSBEHOV',
}

interface Props {
    viewType: Visningstype;
    fnr: string;
}

const App: FunctionComponent<Props> = ({ viewType, fnr }) => {
    const [kandidat, setKandidat] = useState<RestKandidat>(ikkeLastet);

    useEffect(() => {
        const hent = async () => {
            setKandidat(lasterInn);
            setKandidat(await hentKandidat(fnr));
        };
        hent();
    }, [fnr]);

    let side;
    if (viewType === Visningstype.RegistrerTilretteleggingsbehov) {
        if (kandidat.status === Status.Suksess) {
            side = <Endring kandidat={kandidat.data} />;
        }
        if (kandidat.status === Status.Feil && kandidat.statusKode === 404) {
            side = <Registrering fnr={fnr} />;
        }
    } else if (viewType === Visningstype.VisTilretteleggingsbehov) {
        side = <Visning fnr={fnr} />;
    } else {
        return null;
    }

    return <Normaltekst tag="div">{side}</Normaltekst>;
};

export default App;
