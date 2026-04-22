const GITHUB_DATA = {
    user: 'rjespinozaro-cloud',
    repo: 'Cyber-Portfolio-API'
};

async function start() {
    const engine = document.getElementById('portfolio-engine');
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_DATA.user}/${GITHUB_DATA.repo}/contents/`);
        const items = await response.json();

        if (!Array.isArray(items)) throw new Error("API Connection Failed");

        engine.innerHTML = ''; 

        // Filtrar solo carpetas raíz (01, 02, 03, 04, 05)
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
                    <div class="loader" style="font-size:0.7rem; padding:10px;">Escaneando subtemas en tiempo real...</div>
                </div>
            `;
            engine.appendChild(catDiv);
            fetchFiles(item.name);
        }
    } catch (e) { 
        engine.innerHTML = `<div style="color:red; text-align:center; padding:20px;">ERROR: Acceso denegado o repositorio no encontrado.</div>`;
    }
}

async function fetchFiles(dirPath) {
    const boxId = `box-${dirPath}`;
    const box = document.getElementById(boxId);
    
    try {
        const res = await fetch(`https://api.github.com/repos/${GITHUB_DATA.user}/${GITHUB_DATA.repo}/contents/${dirPath}`);
        const items = await res.json();
        
        box.innerHTML = ''; 

        // Ignorar el archivo de sistema .gitkeep
        const validItems = items.filter(i => i.name !== '.gitkeep');

        if (validItems.length === 0) {
            box.innerHTML = '<p style="color:#444; font-size:0.75rem; padding:15px;">Directorio listo para recibir evidencias.</p>';
            return;
        }

        validItems.forEach(item => {
            const row = document.createElement('a');
            row.className = 'file-row';
            row.target = "_blank";

            if (item.type === 'dir') {
                // SI ES SUB-CARPETA (SUBTEMA)
                row.href = `https://github.com/${GITHUB_DATA.user}/${GITHUB_DATA.repo}/tree/main/${item.path}`;
                row.innerHTML = `<span style="margin-right:12px">📁</span> <strong style="color:var(--cyan)">SUBTEMA:</strong> ${item.name.toUpperCase().replace(/-/g, ' ')}`;
            } else {
                // SI ES ARCHIVO (REPORTE)
                let url = item.html_url;
                let icon = "📄";
                
                if (item.name.match(/\.(docx|doc)$/i)) {
                    url = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(item.download_url)}`;
                    icon = "📘";
                } else if (item.name.endsWith('.pdf')) {
                    icon = "📕";
                    url = item.download_url;
                } else if (item.name.endsWith('.md')) {
                    icon = "📝";
                }
                
                row.href = url;
                row.innerHTML = `<span style="margin-right:12px">${icon}</span> ${item.name}`;
            }
            box.appendChild(row);
        });
    } catch (e) { 
        box.innerHTML = '<div style="color:#666; font-size:0.7rem; padding:10px;">Error al indexar sub-niveles.</div>';
    }
}

function toggleCat(el) {
    const content = el.nextElementSibling;
    content.classList.toggle('active');
    el.querySelector('span').innerText = content.classList.contains('active') ? '[ - ]' : '[ + ]';
}

start();
