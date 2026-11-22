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
});