// COUNTDOWN
const target = new Date("Dec 31, 2026 00:00:00").getTime();
function timer() {
    const now = new Date().getTime();
    const d = target - now;
    if (d > 0) {
        document.getElementById('days').innerText = Math.floor(d / (1000 * 60 * 60 * 24));
        document.getElementById('hours').innerText = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        document.getElementById('minutes').innerText = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
        document.getElementById('seconds').innerText = Math.floor((d % (1000 * 60)) / 1000);
    }
}
setInterval(timer, 1000);

// DYNAMICKÝ GRID Z PHP/CSV
async function loadExhibitions() {
    const grid = document.getElementById('exhibition-grid');
    try {
        const res = await fetch('php/data.php');
        const data = await res.json();
        grid.innerHTML = data.map(item => `
            <div class="col-md-6 col-lg-4">
                <div class="ex-card h-100 shadow-lg">
                    <div class="ex-img" style="background-image:url('${item.img}')"></div>
                    <div class="p-4">
                        <span class="text-danger fw-bold small uppercase ls-5">${item.kat}</span>
                        <h3 class="fw-900 mt-2">${item.nazev}</h3>
                        <p class="text-secondary small fw-light">${item.desc}</p>
                    </div>
                </div>
            </div>`).join('');
    } catch (e) {
        console.error("Data Load Error: Run via XAMPP/LocalServer");
    }
}

// INTERAKTIVITA REZERVACE
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('select-ticket')) {
        const type = e.target.getAttribute('data-type');
        const form = document.getElementById('checkout-form');
        document.getElementById('selected-type-text').innerText = type;
        form.classList.remove('d-none');
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

document.getElementById('booking-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Zabrání klasickému odeslání a obnovení stránky

    const form = this;
    const resultDiv = document.getElementById('form-result');
    const formData = new FormData(form);

    // Změna tlačítka na "Odesílám..."
    const btn = form.querySelector('button');
    const originalBtnText = btn.innerText;
    btn.innerText = "ODESÍLÁM...";
    btn.disabled = true;

    fetch('rezervace.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        resultDiv.style.display = 'block';
        if (data.includes("OK")) {
            resultDiv.innerHTML = '<span class="text-success">Vase rezervace proběhla úspěšně!</span>';
            form.reset(); // Vymaže formulář
        } else {
            resultDiv.innerHTML = '<span class="text-warning">Chyba: ' + data + '</span>';
        }
    })
    .catch(error => {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = '<span class="text-danger">Došlo k chybě při spojení se serverem.</span>';
    })
    .finally(() => {
        btn.innerText = originalBtnText;
        btn.disabled = false;
    });
});

window.onload = loadExhibitions;