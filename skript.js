//-------------------------1. osa Ostukorv ------------------------suurendaArtikkel

"use strict";
//toote pealt vajaliku info kogumine ja lisamine ostukorvi
let korv = [];
const korviSisu = document.querySelector(".korv");
const lisaKorviNupud = document.querySelectorAll('[data-action="lisa_korvi"]');
lisaKorviNupud.forEach(lisaKorviNupp => {
    lisaKorviNupp.addEventListener('click', () => {
        const toodeInfo = lisaKorviNupp.parentNode;
        const toode = {
            nimi: toodeInfo.querySelector(".toode_nimi").innerText,
            hind: toodeInfo.querySelector(".toode_hind").innerText,
            kogus: 1
        };
        const onKorvis = (korv.filter(korvArtikkel => (korvArtikkel.nimi === toode.nimi)).length > 0);
        if (!onKorvis) {
            lisaArtikkel(toode); // selle funktsiooni loome allpool
            korv.push(toode);
            nupuOhjamine(lisaKorviNupp, toode); // selle funktsiooni loome allpool
        }
        arvutaKogusumma()
    });
});

//funktsioon toote lisamiseks
function lisaArtikkel(toode) {
    korviSisu.insertAdjacentHTML('beforeend', `
    <div class="korv_artikkel">
      <h3 class="korv_artikkel_nimi">${toode.nimi}</h3>
      <h3 class="korv_artikkel_hind">${toode.hind}</h3>    
      <div class="korv_artikkel_buttons">  
      <button class="btn-small" data-action="vahenda_artikkel">&minus;</button>
      <h3 class="korv_artikkel_kogus">${toode.kogus}</h3>
      <button class="btn btn-small" data-action="suurenda_artikkel">&plus;</button>
      <button class="btn btn-small" data-action="eemalda_artikkel">&times;</button>
      </div>
    </div>
  `);

    lisaKorviJalus(); // selle funktsiooni lisame allpool
}

//funktsioon nupu sündmusekuulutaja jaoks
function nupuOhjamine(lisaKorviNupp, toode) {
    lisaKorviNupp.innerText = 'Ostukorvis';
    lisaKorviNupp.disabled = true;

    const korvArtiklidD = korviSisu.querySelectorAll('.korv_artikkel');
    korvArtiklidD.forEach(korvArtikkelD => {
        if (korvArtikkelD.querySelector('.korv_artikkel_nimi').innerText === toode.nimi) {
            korvArtikkelD.querySelector('[data-action="suurenda_artikkel"]').addEventListener('click', () => suurendaArtikkel(toode, korvArtikkelD));
            korvArtikkelD.querySelector('[data-action="vahenda_artikkel"]').addEventListener('click', () => decreaseItem(toode, korvArtikkelD, lisaKorviNupp));
            korvArtikkelD.querySelector('[data-action="eemalda_artikkel"]').addEventListener('click', () => eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp));
        }
    });
}

//toodete arvu suurendamine
function suurendaArtikkel(toode, korvArtikkelD) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi) {
            korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = ++korvArtikkel.kogus;

        }
    });
    arvutaKogusumma()
}

//Ülesanne 5.1: lisa funktsioon toodete hulga vähendamiseks.
function decreaseItem(toode, korvArtikkelD) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi) {
            if (toode.kogus > 1) {
                korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = --korvArtikkel.kogus;
            }

        }
    });
    arvutaKogusumma()
}

//toodete eemaldamine ostukorvist
function eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp) {
    korvArtikkelD.remove();
    korv = korv.filter(korvArtikkel => korvArtikkel.nimi !== toode.nimi);
    lisaKorviNupp.innerText = 'Lisa ostukorvi';
    lisaKorviNupp.disabled = false;
    if (korv.length < 1) {
        document.querySelector('.korv-jalus').remove();
    }
    arvutaKogusumma()
}

//ostukorvi jaluse ehk alumiste nuppude lisamine
function lisaKorviJalus() {
    if (document.querySelector('.korv-jalus') === null) {
        korviSisu.insertAdjacentHTML('afterend', `
      <div class="korv-jalus">
        <button class="btn" data-action="tyhjenda_korv">Tühjenda ostukorv</button>
        <h3 class="korv_summa">Kogusumma: <span id="totalSum">0</span> €</h3>
        <button class="btn" data-action="kassa">Maksma</button>
      </div>
    `);
        document.querySelector('[data-action="tyhjenda_korv"]').addEventListener('click', () => tuhjendaKorv());
        document.querySelector('[data-action="kassa"]').addEventListener('click', () => {
            let taimeriAeg = 60 * 2; // Taimeri kestvus 2 minutit
            let kuva = document.getElementById("time");
            alustaTaimer(taimeriAeg, kuva);
            kassa();
        });
    }
}

// ostukorvi tühjendamine
function tuhjendaKorv() {
    korviSisu.querySelectorAll('.korv_artikkel').forEach(korvArtikkelD => {
        korvArtikkelD.remove();
    });

    lisaKorviNupud.forEach(lisaKorviNupp => {
        lisaKorviNupp.disabled = false;
        lisaKorviNupp.innerText = 'Lisa ostukorvi';
    });

    korv = [];
    document.querySelector('.korv-jalus').remove();
    arvutaKogusumma()
}


//Ülesanne 5.2: lisa funktsioon, mis arvutab ostukorvi summa kokku.
function arvutaKogusumma() {
    let kogusumma = 0;

    // Läbime kõik korvis olevad tooted ja summeerime hinnad koguse järgi
    korv.forEach(toode => {
        kogusumma += toode.hind * toode.kogus;
    });

    // Uuendame jaluses oleva summa näitaja
    document.getElementById('totalSum').innerText = kogusumma.toFixed(2);
}

//-------------------------2. osa Taimer ------------------------

//taimer
function alustaTaimer(kestvus, kuva) {
    let start = Date.now(),
        vahe,
        minutid,
        sekundid;

    function taimer() {
        let vahe = kestvus - Math.floor((Date.now() - start) / 1000);

        let minutid = Math.floor(vahe / 60);
        let sekundid = Math.floor(vahe % 60);

        if (minutid < 10) {
            minutid = "0" + minutid;
        }
        if (sekundid < 10) {
            sekundid = "0" + sekundid;
        }

        kuva.textContent = minutid + ":" + sekundid;

        if (vahe < 0) {
            clearInterval(vahe);
            document.getElementById("time").innerHTML = "alusta uuesti";
        };
    };
    taimer();
    setInterval(taimer, 1000);

};


//-------------------------3. osa Tarne vorm ------------------------

const form = document.querySelector("form");
const eesnimi = document.getElementById("eesnimi");
const perenimi = document.getElementById("perenimi");
const kinnitus = document.getElementById("kinnitus");

const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errors = [];

    // 1. Eesnime kontroll (ei tohi sisaldada numbreid ja ei tohi olla tühi)
    if (eesnimi.value.trim() === "") {
        errors.push("Sisesta eesnimi");
    } else if (/\d/.test(eesnimi.value)) { // Kontrollime, kas eesnimes on numbreid
        errors.push("Eesnimi ei tohi sisaldada numbreid");
    }

    // 2. Perenime kontroll (ei tohi sisaldada numbreid ja ei tohi olla tühi)
    if (perenimi.value.trim() === "") {
        errors.push("Sisesta perenimi");
    } else if (/\d/.test(perenimi.value)) { // Kontrollime, kas perenimes on numbreid
        errors.push("Perenimi ei tohi sisaldada numbreid");
    }

    // 3. Telefoni numbri kontroll (ainult numbrid ja vähemalt 6 sümbolit pikk)
    if (telefon.value.trim() === "") {
        errors.push("Sisesta telefoninumber");
    } else if (!/^\d+$/.test(telefon.value)) { // Kontrollime, kas telefon sisaldab ainult numbreid
        errors.push("Telefon võib sisaldada ainult numbreid");
    } else if (telefon.value.length < 6) { // Kontrollime, kas pikkus on vähemalt 6 sümbolit
        errors.push("Telefoninumber peab olema vähemalt 6 sümbolit pikk");
    }

    // 4. MINU KOOD
    const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com)$/;
    if (epost.value.trim() === "") {
        errors.push("Sisesta e-posti aadress");
    } else if (!emailPattern.test(epost.value)) { // Kontrollime, kas e-mail on õiges formaadis ja lõppeb kindla domeeniga
        errors.push("E-posti aadress peab lõppema @gmail.com, @hotmail.com, @outlook.com või @yahoo.com");
    }

    // 5. Kontroll, et vähemalt üks raadionupp oleks valitud (Tarneviis)
    if ((tarne1.checked && tarne2.checked) || (!tarne1.checked && !tarne2.checked)) {
        errors.push("Palun vali 1 tarneviis");
    }

    // 6. Kontroll, et tingimustega nõustumise ruut oleks märgitud
    if (!kinnitus.checked) {
        errors.push("Palun nõustu tingimustega");
    }

    if (errors.length > 0) {
        e.preventDefault();
        errorMessage.innerHTML = errors.join(', ');
    }
    else {
        errorMessage.innerHTML = "";
    }

})

/* Ülesanne 5.3: täienda vormi sisendi kontrolli:
- eesnime ja perenime väljal ei tohi olla numbreid;
- telefoni väli ei tohi olla lühem kui 6 sümbolit ning peab sisaldama ainult numbreid;
- üks raadionuppudest peab olema valitud;
- lisa oma valikul üks lisaväli ning sellele kontroll. Märgi see nii HTML kui JavaScripti
  koodis "minu kood" kommentaariga. */



