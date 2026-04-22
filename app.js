const GITHUB_DATA = { user: 'rjespinozaro-cloud', repo: 'Cyber-Portfolio-API' };

async function start() {
    const engine = document.getElementById('portfolio-engine');
    try {
        const res = await fetch(`https://api.github.com/repos/${GITHUB_DATA.user}/${GITHUB_DATA.repo}/contents/`);
        const items = await res.json();
        engine.innerHTML = ''; 

        // Filtramos carpetas que empiecen con números (01, 02...)
        items.filter(i => i.type === 'dir' && /^\d/.test(i.name))
             .sort((a,b) => a.name.localeCompare(b.name))
             .forEach(item => {
                const catDiv = document.createElement('div');
                catDiv.className = 'category';
                // El ID se limpia de caracteres especiales para evitar errores en el DOM
                const safeId = item.name.replace(/[^a-zA-Z0-9]/g, '');
                catDiv.innerHTML = `
                    <div class="category-header" onclick="toggleCat(this)">
                        <h2>${item.name.replace(/-/g, ' ')}</h2>
                        <span>[ + ]</span>
                    </div>
                    <div class="content" id="box-${safeId}">
                        <div class="loader">Sincronizando subtemas...</div>
                    </div>
                `;
                engine.appendChild(catDiv);
                fetchFiles(item.path, safeId);
             });
    } catch (e) { engine.innerHTML = "Error de enlace con API."; }
}

async function fetchFiles(path, targetId) {
    const box = document.getElementById(`box-${targetId}`);
    try {
        const res = await fetch(`https://api.github.com/repos/${GITHUB_DATA.user}/${GITHUB_DATA.repo}/contents/${path}`);
        const items = await res.json();
        box.innerHTML = '';

        const validItems = items.filter(i => i.name !== '.gitkeep');

        if (validItems.length === 0) {
            box.innerHTML = '<p style="color:#555; padding:15px; font-size:0.8rem;">Módulo en desarrollo.</p>';
            return;
        }

        validItems.forEach(item => {
            const row = document.createElement('a');
            row.className = 'file-row';
            row.target = "_blank";
            
            if (item.type === 'dir') {
                // CAMBIO AQUÍ: Estructura mejorada con clases de CSS
                row.href = `https://github.com/${GITHUB_DATA.user}/${GITHUB_DATA.repo}/tree/main/${encodeURIComponent(item.path)}`;
                row.innerHTML = `
                    <span style="margin-right:15px">📂</span> 
                    <span class="explore-badge">EXPLORAR</span> 
                    <span>${item.name.replace(/-/g, ' ')}</span>
                `;
            } else {
                let url = item.html_url;
                // Detectar iconos por extensión
                let icon = item.name.match(/\.(docx|doc)$/i) ? "📘" : (item.name.endsWith('.pdf') ? "📕" : "📄");
                
                // Si es Word, usar el visor oficial de Office
                if (icon === "📘") {
                    url = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(item.download_url)}`;
                }
                
                row.href = url;
                row.innerHTML = `<span style="margin-right:15px">${icon}</span> <span>${item.name}</span>`;
            }
            box.appendChild(row);
        });
    } catch (e) { box.innerHTML = 'Error de carga.'; }
}

function toggleCat(el) {
    const content = el.nextElementSibling;
    content.classList.toggle('active');
    el.querySelector('span').innerText = content.classList.contains('active') ? '[ - ]' : '[ + ]';
}

start();
