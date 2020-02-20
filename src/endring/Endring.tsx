import React, { FunctionComponent, useEffect, useState } from 'react';
import {
    ArbeidsmijøBehov,
    ArbeidstidBehov,
    Behov,
    FysiskBehov,
    GrunnleggendeBehov,
} from '../api/Behov';
import { RestKandidat, Status, ikkeLastet, lasterInn } from '../api/Rest';
import { navigerTilVisningsside } from '../utils/navigering';
import { Feilmelding, Ingress, Sidetittel } from 'nav-frontend-typografi';
import Alertstripe from 'nav-frontend-alertstriper';
import KategoriSpørsmål from '../registrering/kategori-spørsmål/KategoriSpørsmål';
import { Kandidat, KandidatDto } from '../api/Kandidat';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { endreKandidat } from '../api/api';
import SlettModal from './slett-modal/SlettModal';
import Tilbakeknapp from '../tilbakeknapp/Tilbakeknapp';
import './Endring.less';
import GiTilbakemelding from '../gi-tilbakemelding/GiTilbakemelding';

interface Props {
    kandidat: Kandidat;
}

const Endring: FunctionComponent<Props> = ({ kandidat }) => {
    const [arbeidstid, setArbeidstid] = useState<Behov[]>(kandidat.arbeidstidBehov);
    const [fysisk, setFysisk] = useState<Behov[]>(kandidat.fysiskeBehov);
    const [arbeidsmiljø, setArbeidsmiljø] = useState<Behov[]>(kandidat.arbeidsmiljøBehov);
    const [grunnleggende, setGrunnleggende] = useState<Behov[]>(kandidat.grunnleggendeBehov);

    const [respons, setRespons] = useState<RestKandidat>(ikkeLastet);
    const [visSlettModal, toggleSlettModal] = useState<boolean>(false);

    useEffect(() => {
        if (respons.status === Status.Suksess) {
            navigerTilVisningsside();
        }
    }, [respons]);

    const endreBehov = async () => {
        if (respons.status === Status.LasterInn) return;

        const endring: KandidatDto = {
            fnr: kandidat.fnr,
            arbeidstidBehov: arbeidstid as ArbeidstidBehov[],
            fysiskeBehov: fysisk as FysiskBehov[],
            arbeidsmiljøBehov: arbeidsmiljø as ArbeidsmijøBehov[],
            grunnleggendeBehov: grunnleggende as GrunnleggendeBehov[],
        };

        setRespons(lasterInn);
        const responsFraEndring: RestKandidat = await endreKandidat(endring);
        setRespons(responsFraEndring);
    };

    return (
        <div className="endring">
            <main className="endring__innhold">
                <div className="endring__tilbake-og-slett">
                    <Tilbakeknapp />
                    <Knapp onClick={() => toggleSlettModal(true)} mini={true}>
                        Slett
                    </Knapp>
                </div>
                <Sidetittel className="blokk-xxs">Endre behov for tilrettelegging</Sidetittel>
                <Ingress className="blokk-l">
                    Registrer bare brukere som har behov for tilrettelegging for å kunne jobbe. Du
                    skal ikke registrere brukere som har problemer med å få seg jobb av andre
                    årsaker (etnisitet, religion, hull i CV-en m.m.).
                </Ingress>
                <Alertstripe className="blokk-s" type="info">
                    Før du registrerer behovene, må du ha hatt en dialog med brukeren. Brukeren vil
                    kunne se det du registrerer under Personopplysninger på Ditt NAV.
                </Alertstripe>
                <form className="endring__form">
                    <KategoriSpørsmål
                        tittel="Arbeidstid"
                        beskrivelse="Behov for tilrettelegging av arbeidstiden"
                        valgteBehov={arbeidstid}
                        onChange={setArbeidstid}
                        kategori="arbeidstid"
                    />
                    <KategoriSpørsmål
                        tittel="Fysisk tilrettelegging"
                        beskrivelse="Behov for fysisk tilrettelegging på arbeidsplassen"
                        valgteBehov={fysisk}
                        onChange={setFysisk}
                        kategori="fysisk"
                    />
                    <KategoriSpørsmål
                        tittel="Arbeidsmiljø"
                        beskrivelse="Behov for tilpasning av arbeidsmiljøet"
                        valgteBehov={arbeidsmiljø}
                        onChange={setArbeidsmiljø}
                        kategori="arbeidsmiljø"
                    />
                    <KategoriSpørsmål
                        tittel="Grunnleggende ferdigheter"
                        beskrivelse="Har kandidaten utfordringer med noe av dette?"
                        valgteBehov={grunnleggende}
                        onChange={setGrunnleggende}
                        kategori="grunnleggende"
                    />
                    <GiTilbakemelding />
                    <Hovedknapp
                        onClick={endreBehov}
                        spinner={respons.status === Status.LasterInn}
                        htmlType="button"
                        className="endring__lagreknapp"
                    >
                        Lagre endringer
                    </Hovedknapp>
                    <Knapp onClick={navigerTilVisningsside}>Avbryt</Knapp>
                    {respons.status === Status.Feil ||
                        (respons.status === Status.UkjentFeil && (
                            <Feilmelding>Kunne ikke endre behov for tilrettelegging</Feilmelding>
                        ))}
                </form>
            </main>
            <SlettModal
                erÅpen={visSlettModal}
                fnr={kandidat.fnr}
                lukk={() => toggleSlettModal(false)}
            />
        </div>
    );
};

export default Endring;
