async function fetchFiles(dir) {
    const box = document.getElementById(`box-${dir}`);
    try {
        const res = await fetch(`https://api.github.com/repos/${GITHUB_DATA.user}/${GITHUB_DATA.repo}/contents/${dir}`);
        const files = await res.json();
        
        box.innerHTML = ''; // Limpiar el "cargando"

        files.forEach(f => {
            if (f.name === '.gitkeep') return;

            let url = f.html_url;
            let icon = "📄"; // Icono por defecto (Texto)
            
            // Lógica de iconos profesional
            if (f.name.match(/\.(docx|doc)$/i)) {
                url = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(f.download_url)}`;
                icon = "📘"; // Azul para Word
            } else if (f.name.endsWith('.pdf')) {
                icon = "📕"; // Rojo para PDF
                url = f.download_url;
            } else if (f.name.endsWith('.md')) {
                icon = "📝"; // Nota para Markdown
            }

            const row = document.createElement('a');
            row.className = 'file-row';
            row.href = url;
            row.target = "_blank";
            // Eliminamos el tag <img> que está fallando y usamos el emoji directo
            row.innerHTML = `<span style="margin-right:10px">${icon}</span> ${f.name}`;
            box.appendChild(row);
        });
    } catch (e) {
        box.innerHTML = '<p style="color:red; padding:10px;">Error al listar archivos.</p>';
    }
}
