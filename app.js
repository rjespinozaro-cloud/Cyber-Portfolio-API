const GITHUB_DATA = {
    user: 'rjespinozaro-cloud',
    repo: 'Cyber-Portfolio-API'
};

async function start() {
    const engine = document.getElementById('portfolio-engine');
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_DATA.user}/${GITHUB_DATA.repo}/contents/`);
        const items = await response.json();

        for (const item of items) {
            // Filtra solo carpetas que empiecen con número (01, 02...)
            if (item.type === 'dir' && /^\d/.test(item.name)) {
                const catDiv = document.createElement('div');
                catDiv.className = 'category';
                catDiv.innerHTML = `
                    <div class="category-header" onclick="toggleCat(this)">
                        <h2>${item.name.toUpperCase().replace(/-/g, ' ')}</h2>
                        <span>📂</span>
                    </div>
                    <div class="content" id="box-${item.name}">
                        <small style="color:#555; padding:10px; display:block;">Sincronizando archivos...</small>
                    </div>
                `;
                engine.appendChild(catDiv);
                fetchFiles(item.name);
            }
        }
    } catch (e) { engine.innerHTML = "Error de enlace con el servidor de GitHub."; }
}

async function fetchFiles(dir) {
    const box = document.getElementById(`box-${dir}`);
    const res = await fetch(`https://api.github.com/repos/${GITHUB_DATA.user}/${GITHUB_DATA.repo}/contents/${dir}`);
    const files = await res.json();
    
    box.innerHTML = ''; // Limpiar

    files.forEach(f => {
        if (f.name === '.gitkeep') return;

        let url = f.html_url;
        let icon = "📄";
        
        // REGLA DE ORO: Si es Word, usar visor de Microsoft
        if (f.name.match(/\.(docx|doc)$/i)) {
            url = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(f.download_url)}`;
            icon = "📘";
        } else if (f.name.endsWith('.pdf')) {
            icon = "📕";
            url = f.download_url;
        }

        const row = document.createElement('a');
        row.className = 'file-row';
        row.href = url;
        row.target = "_blank";
        row.innerHTML = `<span>${icon}</span> ${f.name}`;
        box.appendChild(row);
    });
}

function toggleCat(el) {
    el.nextElementSibling.classList.toggle('active');
}

start();
