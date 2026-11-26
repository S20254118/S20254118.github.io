if (document.getElementById('manoForma')) {
const forma = document.getElementById('manoForma');
const mygtukas = document.getElementById('siustiBtn');
const isvalytiBtn = document.getElementById('isvalytiBtn');
const rezultatas = document.getElementById('rezultatas');
const telLaukas = document.getElementById('telefonas');

const tikRaides = /^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ]+$/;
const elPastoFormatas = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const telFormatas = /^\+370 6\d{2} \d{5}$/;

function tikrintiLauka(laukas) {
    const val = laukas.value.trim();
    const id = laukas.id;
    let zinute = '';

    if (val === '') {
        zinute = 'Laukas negali būti tuščias';
    } else if ((id === 'vardas' || id === 'pavarde') && !tikRaides.test(val)) {
        zinute = 'Galimos tik raidės';
    } else if (id === 'elPastas' && !elPastoFormatas.test(val)) {
        zinute = 'Neteisingas el. pašto formatas';
    } else if (id === 'telefonas' && !telFormatas.test(val)) {
        zinute = 'Formatas turi būti +370 6xx xxxxx';
    } else if ((id === 'kl1' || id === 'kl2' || id === 'kl3') && (Number(val) < 1 || Number(val) > 10)) {
        zinute = 'Įveskite skaičių nuo 1 iki 10';
    }

    return zinute;
}

function rodytiKlaida(laukas, zinute) {
    laukas.nextElementSibling.textContent = zinute;
    laukas.classList.toggle('klaida-laukas', zinute !== '');
}

telLaukas.addEventListener('input', function () {
    let sk = telLaukas.value.replace(/\D/g, '');
    if (sk.startsWith('370')) sk = sk.slice(3);
    else if (sk.startsWith('8')) sk = sk.slice(1);
    sk = sk.slice(0, 8);

    if (sk.length === 0) telLaukas.value = '';
    else if (sk.length <= 3) telLaukas.value = '+370 ' + sk;
    else telLaukas.value = '+370 ' + sk.slice(0, 3) + ' ' + sk.slice(3);
});

forma.addEventListener('input', function (event) {
    if (event.target.tagName === 'INPUT') {
        rodytiKlaida(event.target, tikrintiLauka(event.target));
    }

    let viskasGerai = true;
    forma.querySelectorAll('input').forEach(function (laukas) {
        if (tikrintiLauka(laukas) !== '') viskasGerai = false;
    });
    mygtukas.disabled = !viskasGerai;
});

forma.addEventListener('submit', function (event) {
    event.preventDefault();

    const duomenys = {
        vardas: document.getElementById('vardas').value.trim(),
        pavarde: document.getElementById('pavarde').value.trim(),
        elPastas: document.getElementById('elPastas').value.trim(),
        telefonas: telLaukas.value,
        adresas: document.getElementById('adresas').value.trim(),
        kl1: Number(document.getElementById('kl1').value),
        kl2: Number(document.getElementById('kl2').value),
        kl3: Number(document.getElementById('kl3').value)
    };

    console.log(duomenys);
    const vidurkis = ((duomenys.kl1 + duomenys.kl2 + duomenys.kl3) / 3).toFixed(2);

    rezultatas.innerHTML = `
        <p>Vardas: ${duomenys.vardas}</p>
        <p>Pavardė: ${duomenys.pavarde}</p>
        <p>El. paštas: ${duomenys.elPastas}</p>
        <p>Tel. Numeris: ${duomenys.telefonas}</p>
        <p>Adresas: ${duomenys.adresas}</p>
        <p><b>${duomenys.vardas} ${duomenys.pavarde}: ${vidurkis}</b></p>
    `;
});

isvalytiBtn.addEventListener('click', function () {
    forma.reset();
    rezultatas.innerHTML = '';
    forma.querySelectorAll('input').forEach(function (laukas) {
        rodytiKlaida(laukas, '');
    });
    mygtukas.disabled = true;
});}
if (document.getElementById('kompetencijos')) {
    const pradiniai = [
        { pavadinimas: 'PLC programavimas', busena: 'Planuojama', xp: 60 },
        { pavadinimas: 'FPGA pagrindai', busena: 'Planuojama', xp: 50 },
        { pavadinimas: 'C/C++ mikrovaldikliams', busena: 'Mokomasi', xp: 50 },
        { pavadinimas: 'Tinklų pagrindai', busena: 'Mokomasi', xp: 40 },
        { pavadinimas: 'KiCad projektavimas', busena: 'Atlikta', xp: 70 },
        { pavadinimas: 'MATLAB modeliavimas', busena: 'Atlikta', xp: 80 }
    ];

    const stulpeliai = {
        Planuojama: document.getElementById('col-plan'),
        Mokomasi: document.getElementById('col-learn'),
        Atlikta: document.getElementById('col-done')
    };

    const igudziai = JSON.parse(localStorage.getItem('manoIgudziai')) || pradiniai;

    function atvaizduotiKorteles() {
        Object.values(stulpeliai).forEach(stulpelis => stulpelis.innerHTML = '');

        igudziai.forEach((igudis, i) => {
            const kortele = document.createElement('div');
            kortele.className = 'kortele';
            kortele.innerHTML = `
                <b>${igudis.pavadinimas}</b>
                <p><span>XP: ${igudis.xp}</span></p>
                <select>
                    <option value="Planuojama">Planuojama</option>
                    <option value="Mokomasi">Mokomasi</option>
                    <option value="Atlikta">Atlikta</option>
                </select>
            `;

            const pasirinkimas = kortele.querySelector('select');
            pasirinkimas.value = igudis.busena;
            pasirinkimas.addEventListener('change', () => keistiBusena(i, pasirinkimas.value));

            stulpeliai[igudis.busena].appendChild(kortele);
        });
    }

    function gautiLygi(xp) {
        if (xp >= 300) return { lygis: 4, rangas: 'Profesionalas', proc: 100 };
        if (xp >= 150) return { lygis: 3, rangas: 'Specialistas', proc: Math.round(((xp - 150) / 150) * 100) };
        if (xp >= 50)  return { lygis: 2, rangas: 'Praktikantas', proc: Math.round(((xp - 50) / 100) * 100) };
        return { lygis: 1, rangas: 'Pradedantysis', proc: Math.round((xp / 50) * 100) };
    }

    function atnaujintiProgresa() {
        const atlikti = igudziai.filter(g => g.busena === 'Atlikta');
        const xp = atlikti.reduce((suma, g) => suma + g.xp, 0);
        const info = gautiLygi(xp);

        document.getElementById('bendrasXp').textContent = `${xp} XP`;
        document.getElementById('lygis').textContent = info.lygis;
        document.getElementById('rangas').textContent = info.rangas;

        const juosta = document.getElementById('progresoJuosta');
        juosta.style.width = `${info.proc}%`;
        juosta.textContent = `${info.proc}%`;

        document.getElementById('visiIgudziai').textContent = igudziai.length;
        document.getElementById('atliktaKiekis').textContent = atlikti.length;
        document.getElementById('atliktaProcentas').textContent = `${Math.round((atlikti.length / igudziai.length) * 100)}%`;
    }

    function keistiBusena(index, naujaBusena) {
        igudziai[index].busena = naujaBusena;
        localStorage.setItem('manoIgudziai', JSON.stringify(igudziai));
        atvaizduotiKorteles();
        atnaujintiProgresa();
    }

    atvaizduotiKorteles();
    atnaujintiProgresa();
}