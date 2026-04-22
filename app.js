const GITHUB_DATA = { user: 'rjespinozaro-cloud', repo: 'Cyber-Portfolio-API' };

async function start() {
    const engine = document.getElementById('portfolio-engine');
    try {
        const res = await fetch(`https://api.github.com/repos/${GITHUB_DATA.user}/${GITHUB_DATA.repo}/contents/`);
        const items = await res.json();
        engine.innerHTML = ''; 

        items.filter(i => i.type === 'dir' && /^\d/.test(i.name))
             .sort((a,b) => a.name.localeCompare(b.name))
             .forEach(item => {
                const catDiv = document.createElement('div');
                catDiv.className = 'category';
                catDiv.innerHTML = `
                    <div class="category-header" onclick="toggleCat(this)">
                        <h2>${item.name.replace(/-/g, ' ')}</h2>
                        <span>[ + ]</span>
                    </div>
                    <div class="content" id="box-${item.name.replace(/[^a-zA-Z0-9]/g, '')}">
                        <div class="loader" style="padding:10px; font-size:0.7rem;">Sincronizando subtemas...</div>
                    </div>
                `;
                engine.appendChild(catDiv);
                fetchFiles(item.path, item.name.replace(/[^a-zA-Z0-9]/g, ''));
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
                // Link a la subcarpeta en GitHub
                row.href = `https://github.com/${GITHUB_DATA.user}/${GITHUB_DATA.repo}/tree/main/${encodeURIComponent(item.path)}`;
                row.innerHTML = `<span style="margin-right:10px">📁</span> <strong style="color:var(--cyan)">[EXPLORAR]</strong> ${item.name.replace(/-/g, ' ')}`;
            } else {
                let url = item.html_url;
                let icon = item.name.match(/\.(docx|doc)$/i) ? "📘" : (item.name.endsWith('.pdf') ? "📕" : "📄");
                if (icon === "📘") url = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(item.download_url)}`;
                row.href = url;
                row.innerHTML = `<span style="margin-right:10px">${icon}</span> ${item.name}`;
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
