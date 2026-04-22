const GITHUB_DATA = {
    user: 'rjespinozaro-cloud',
    repo: 'Cyber-Portfolio-API'
};

async function start() {
    const engine = document.getElementById('portfolio-engine');
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_DATA.user}/${GITHUB_DATA.repo}/contents/`);
        const items = await response.json();

        if (!Array.isArray(items)) throw new Error("No se pudo obtener la lista de archivos");

        engine.innerHTML = ''; // Limpiar loader

        // Filtrar y ordenar carpetas numéricas
        const folders = items
            .filter(item => item.type === 'dir' && /^\d/.test(item.name))
            .sort((a, b) => a.name.localeCompare(b.name));

        for (const item of folders) {
            const catDiv = document.createElement('div');
            catDiv.className = 'category';
            catDiv.innerHTML = `
                <div class="category-header" onclick="toggleCat(this)">
                    <h2>${item.name.replace(/-/g, ' ')}</h2>
                    <span>[ + ]</span>
                </div>
                <div class="content" id="box-${item.name}">
                    <small style="color:#444; padding:10px; display:block;">Listando archivos de seguridad...</small>
                </div>
            `;
            engine.appendChild(catDiv);
            fetchFiles(item.name);
        }
    } catch (e) { 
        engine.innerHTML = `<div style="color:red; text-align:center;">ERROR DE ENLACE: Verifique conexión con API.</div>`;
        console.error(e);
    }
}

async function fetchFiles(dir) {
    const box = document.getElementById(`box-${dir}`);
    try {
        const res = await fetch(`https://api.github.com/repos/${GITHUB_DATA.user}/${GITHUB_DATA.repo}/contents/${dir}`);
        const files = await res.json();
        
        box.innerHTML = ''; // Limpiar cargando

        const validFiles = files.filter(f => f.name !== '.gitkeep');

        if (validFiles.length === 0) {
            box.innerHTML = '<p style="color:#444; font-size:0.8rem; padding:10px;">Directorio vacío. Pendiente de auditoría.</p>';
            return;
        }

        validFiles.forEach(f => {
            let url = f.html_url;
            let icon = "📄";
            
            if (f.name.match(/\.(docx|doc)$/i)) {
                url = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(f.download_url)}`;
                icon = "📘";
            } else if (f.name.endsWith('.pdf')) {
                icon = "📕";
                url = f.download_url;
            } else if (f.name.endsWith('.md')) {
                icon = "📝";
            }

            const row = document.createElement('a');
            row.className = 'file-row';
            row.href = url;
            row.target = "_blank";
            row.innerHTML = `<span style="margin-right:12px">${icon}</span> ${f.name}`;
            box.appendChild(row);
        });
    } catch (e) { box.innerHTML = 'Error al cargar.'; }
}

function toggleCat(el) {
    const content = el.nextElementSibling;
    content.classList.toggle('active');
    el.querySelector('span').innerText = content.classList.contains('active') ? '[ - ]' : '[ + ]';
}

start();
