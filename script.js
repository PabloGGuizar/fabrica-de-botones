// ==UserScript==
// @name         Canvas RCE - Fábrica de botones
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Añade un botón a la barra de herramientas del RCE de Canvas para crear botones con iconos PNG externos, tamaño de texto y bordes personalizables.
// @author       Gemini
// @match        https://*.instructure.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // --- ESTILOS CSS PARA LA VENTANA MODAL Y EL BOTÓN DE LA BARRA DE HERRAMIENTAS ---
    GM_addStyle(`
        /* Estilos para la ventana modal y sus componentes */
        #customButtonModal {
            display: none; position: fixed; z-index: 99999;
            left: 0; top: 0; width: 100%; height: 100%;
            overflow: auto; background-color: rgba(0,0,0,0.5);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .modal-content {
            background-color: #fefefe; margin: 5% auto; padding: 20px;
            border: 1px solid #888; width: 90%; max-width: 700px;
            border-radius: 8px; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
            display: grid; grid-template-columns: 1fr 1fr; grid-gap: 20px;
        }
        .modal-header {
            grid-column: 1 / -1; display: flex; justify-content: space-between;
            align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 10px;
        }
        .modal-header h2 { margin: 0; font-size: 1.5em; }
        .close-button { color: #aaa; font-size: 28px; font-weight: bold; cursor: pointer; }
        .close-button:hover, .close-button:focus { color: black; }
        .form-section, .preview-section { padding: 10px; grid-column: 1 / -1; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: bold; color: #333; }
        .form-group input[type="text"], .form-group input[type="url"] {
            width: 100%; padding: 8px; border: 1px solid #ccc;
            border-radius: 4px; box-sizing: border-box;
        }
        .color-inputs { display: flex; gap: 10px; }
        .color-inputs div { flex-grow: 1; }
        .color-inputs input[type="color"], #borderColor { width: 100%; height: 40px; border: 1px solid #ccc; padding: 0; cursor: pointer; border-radius: 4px; }
        #preview-area {
            border: 2px dashed #ccc; padding: 20px; min-height: 100px;
            display: flex; align-items: center; justify-content: center;
            border-radius: 8px; background-color: #f9f9f9;
        }
        .modal-footer {
            grid-column: 1 / -1; text-align: right;
            border-top: 1px solid #ddd; padding-top: 15px;
        }
        .modal-footer button {
            padding: 10px 20px; border: none; border-radius: 5px;
            cursor: pointer; font-size: 1em; margin-left: 10px;
        }
        #insertBtn { background-color: #007bff; color: white; }
        #insertBtn:hover { background-color: #0056b3; }
        #cancelBtn { background-color: #6c757d; color: white; }
        #cancelBtn:hover { background-color: #5a6268; }

        /* --- ESTILOS PARA SELECTORES VISUALES --- */
        .style-options-container { display: flex; gap: 10px; flex-wrap: wrap; }
        .style-option {
            border: 2px solid #ccc; background-color: #f8f8f8; border-radius: 4px;
            cursor: pointer; transition: all 0.2s ease-in-out; flex-grow: 1;
            display: flex; align-items: center; justify-content: center;
            text-align: center; padding: 5px; height: 40px;
        }
        .style-option:hover { border-color: #888; background-color: #e9e9e9; }
        .style-option.selected {
            border-color: #007bff; background-color: #e7f1ff;
            box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
        }
        #padding-options .style-option span { display: block; background: #a0c7ff; }
        #padding-options .style-option[data-value="5px 10px"] span { height: 10px; width: 20px; }
        #padding-options .style-option[data-value="10px 20px"] span { height: 14px; width: 28px; }
        #padding-options .style-option[data-value="15px 30px"] span { height: 18px; width: 36px; }
        #padding-options .style-option[data-value="20px 40px"] span { height: 22px; width: 44px; }
        #radius-options .style-option { min-width: 40px; }
        #radius-options .style-option[data-value="0px"] { border-radius: 0; }
        #radius-options .style-option[data-value="5px"] { border-radius: 5px; }
        #radius-options .style-option[data-value="15px"] { border-radius: 15px; }
        #radius-options .style-option[data-value="999px"] { border-radius: 999px; }
        #border-width-options .style-option div { width: 30px; height: 30px; border-style: solid; border-color: #888; }
        #border-width-options .style-option[data-value="0px"] div { border-width: 0; background-color: #ccc; }
        #border-width-options .style-option[data-value="1px"] div { border-width: 1px; }
        #border-width-options .style-option[data-value="2px"] div { border-width: 2px; }
        #border-width-options .style-option[data-value="4px"] div { border-width: 4px; }

        /* --- NUEVOS ESTILOS PARA ICONOS DE IMAGEN --- */
        .icon-selector-container {
            display: grid; grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
            gap: 8px; padding: 10px; border: 1px solid #ddd;
            border-radius: 5px; max-height: 150px; overflow-y: auto;
        }
        .icon-option { height: 45px; }
        .icon-option img { width: 28px; height: 28px; }
        #icon-position-selector label { margin-right: 15px; font-weight: normal; }
        #preview-area img { vertical-align: middle; width: 1.2em; height: 1.2em; }
    `);

    // --- LÓGICA DEL SCRIPT ---

    const SCRIPT_ID = 'custom-rce-button-script';

    const ICON_MAP = {
        'Enlace': 'link', 'Abrir en nueva pestaña': 'external-link', 'Descargar': 'download',
        'Flecha derecha': 'arrow-right', 'Flecha izquierda': 'arrow-left', 'Información': 'info',
        'Ayuda': 'help-circle', 'Completado': 'check-circle', 'Calendario': 'calendar',
        'Inicio': 'home', 'Documento': 'file-text', 'Video': 'video', 'Audio': 'mic',
        'Imagen': 'image', 'Editar': 'edit', 'Ver': 'eye', 'Añadir': 'plus-circle',
        'Advertencia': 'alert-triangle', 'Libro': 'book-open', 'Premio': 'award',
        'Discusión': 'message-square', 'Grupo': 'users', 'Portapapeles': 'clipboard'
    };

    function initialize() {
        createModal();
        const observer = new MutationObserver(checkForRCE);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function checkForRCE() {
        const rceToolbar = document.querySelector('.tox-toolbar__primary');
        if (rceToolbar && !document.getElementById(SCRIPT_ID)) {
            addCustomButtonToToolbar(rceToolbar);
        }
    }

    function addCustomButtonToToolbar(toolbar) {
        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'custom-rce-button-wrapper';
        const buttonContainer = document.createElement('div');
        buttonContainer.id = SCRIPT_ID;
        buttonContainer.className = 'tox-tbtn custom-rce-button';
        buttonContainer.title = 'Crear Botón Personalizado';
        buttonContainer.setAttribute('aria-label', 'Crear Botón Personalizado');
        buttonContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17,3H7A2,2 0 0,0 5,5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V5A2,2 0 0,0 17,3M17,19H7V5H17V19M13,11H15V13H13V15H11V13H9V11H11V9H13V11Z" /></svg>`;
        buttonWrapper.appendChild(buttonContainer);
        toolbar.appendChild(buttonWrapper);

        buttonContainer.addEventListener('click', () => {
            const editorFrame = document.querySelector('iframe.tox-edit-area__iframe');
            let selectedText = '', selectedHref = '';
            if (editorFrame) {
                const selection = editorFrame.contentWindow.getSelection();
                selectedText = selection.toString();
                let anchorNode = selection.anchorNode;
                if (anchorNode) {
                    let parentElement = (anchorNode.nodeType === 3 ? anchorNode.parentElement : anchorNode);
                    if (parentElement.tagName !== 'A') { parentElement = parentElement.closest('a'); }
                    if (parentElement && parentElement.tagName === 'A') { selectedHref = parentElement.href; }
                }
            }
            document.getElementById('btnText').value = selectedText || 'Haz Clic Aquí';
            document.getElementById('btnLink').value = selectedHref || '';
            document.getElementById('customButtonModal').style.display = 'block';
            updatePreview();
        });
    }

    function getIconUrl(iconKey, color) {
        const iconFileName = ICON_MAP[iconKey];
        if (!iconFileName) return '';
        return `https://api.iconify.design/feather/${iconFileName}.svg?color=${encodeURIComponent(color)}`;
    }

    function createModal() {
        if (document.getElementById('customButtonModal')) return;
        const modal = document.createElement('div');
        modal.id = 'customButtonModal';

        let iconOptionsHtml = '<div class="style-option icon-option selected" title="Ninguno" data-value="">-</div>';
        for (const key in ICON_MAP) {
            const iconUrl = getIconUrl(key, 'black');
            iconOptionsHtml += `<div class="style-option icon-option" title="${key}" data-value="${key}"><img src="${iconUrl}"></div>`;
        }

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header"><h2>Fábrica de botones</h2><span class="close-button">&times;</span></div>
                <div class="form-section">
                    <div class="form-group"><label for="btnText">1. Texto del botón:</label><input type="text" id="btnText" value="Haz Clic Aquí"></div>
                    <div class="form-group"><label for="btnLink">2. URL del enlace:</label><input type="url" id="btnLink" placeholder="https://ejemplo.com"></div>
                    <div class="form-group color-inputs">
                        <div><label>3. Colores</label><input type="color" id="bgColor" value="#007bff" title="Color de fondo"></div>
                        <div><label>&nbsp;</label><input type="color" id="textColor" value="#ffffff" title="Color de texto"></div>
                    </div>
                    <div class="form-group"><label>4. Tamaño (padding):</label><div id="padding-options" class="style-options-container">...</div></div>
                    <div class="form-group"><label>5. Borde Redondeado:</label><div id="radius-options" class="style-options-container">...</div></div>
                    <div class="form-group"><label>6. Tamaño de Texto:</label><div id="font-size-options" class="style-options-container">...</div></div>
                    <div class="form-group"><label>7. Grosor del Borde:</label><div id="border-width-options" class="style-options-container">...</div></div>
                    <div class="form-group"><label for="borderColor">8. Color del Borde:</label><input type="color" id="borderColor" value="#000000"></div>
                    <div class="form-group"><label>9. Icono (Opcional):</label><div id="icon-selector" class="icon-selector-container">${iconOptionsHtml}</div></div>
                    <div class="form-group"><label>Posición del Icono:</label><div id="icon-position-selector"><label><input type="radio" name="iconPos" value="left" checked> Izquierda</label><label><input type="radio" name="iconPos" value="right"> Derecha</label></div></div>
                </div>
                <div class="preview-section"><h3>Vista Previa</h3><div id="preview-area"><a id="previewButton" href="#" onclick="return false;"></a></div></div>
                <div class="modal-footer"><button id="cancelBtn">Cancelar</button><button id="insertBtn">Insertar Botón</button></div>
            </div>`;

        modal.querySelector('#padding-options').innerHTML = `<div class="style-option" title="Pequeño" data-value="5px 10px"><span></span></div><div class="style-option selected" title="Normal" data-value="10px 20px"><span></span></div><div class="style-option" title="Grande" data-value="15px 30px"><span></span></div><div class="style-option" title="Extra Grande" data-value="20px 40px"><span></span></div>`;
        modal.querySelector('#radius-options').innerHTML = `<div class="style-option" title="Recto" data-value="0px"></div><div class="style-option selected" title="Poco Redondeado" data-value="5px"></div><div class="style-option" title="Muy Redondeado" data-value="15px"></div><div class="style-option" title="Píldora" data-value="999px"></div>`;
        modal.querySelector('#font-size-options').innerHTML = `<div class="style-option" title="Pequeño" data-value="0.85em" style="font-size: 0.85em;">Aa</div><div class="style-option selected" title="Normal" data-value="1em" style="font-size: 1em;">Aa</div><div class="style-option" title="Grande" data-value="1.2em" style="font-size: 1.2em;">Aa</div>`;
        modal.querySelector('#border-width-options').innerHTML = `<div class="style-option selected" title="Ninguno" data-value="0px"><div></div></div><div class="style-option" title="Delgado" data-value="1px"><div></div></div><div class="style-option" title="Grueso" data-value="2px"><div></div></div><div class="style-option" title="Muy Grueso" data-value="4px"><div></div></div>`;

        document.body.appendChild(modal);

        modal.querySelector('.close-button').addEventListener('click', () => modal.style.display = 'none');
        modal.querySelector('#cancelBtn').addEventListener('click', () => modal.style.display = 'none');
        modal.querySelector('#insertBtn').addEventListener('click', insertButton);
        modal.querySelectorAll('#btnText, #bgColor, #textColor, #borderColor, input[name="iconPos"]').forEach(input => {
            input.addEventListener('input', updatePreview);
            input.addEventListener('change', updatePreview);
        });
        modal.querySelectorAll('.style-options-container, .icon-selector-container').forEach(container => {
            container.addEventListener('click', (e) => {
                const target = e.target.closest('.style-option');
                if (!target) return;
                container.querySelectorAll('.style-option').forEach(opt => opt.classList.remove('selected'));
                target.classList.add('selected');
                updatePreview();
            });
        });
    }

    function updatePreview() {
        const previewButton = document.getElementById('previewButton');
        const text = document.getElementById('btnText').value;
        const bgColor = document.getElementById('bgColor').value;
        const textColor = document.getElementById('textColor').value;
        const padding = document.querySelector('#padding-options .selected').dataset.value;
        const borderRadius = document.querySelector('#radius-options .selected').dataset.value;
        const fontSize = document.querySelector('#font-size-options .selected').dataset.value;
        const borderWidth = document.querySelector('#border-width-options .selected').dataset.value;
        const borderColor = document.getElementById('borderColor').value;
        const iconKey = document.querySelector('#icon-selector .selected').dataset.value;
        const iconPos = document.querySelector('input[name="iconPos"]:checked').value;

        const borderStyle = parseInt(borderWidth) > 0 ? `${borderWidth} solid ${borderColor}` : 'none';

        previewButton.style.cssText = `
            background-color: ${bgColor};
            color: ${textColor};
            padding: ${padding};
            border-radius: ${borderRadius};
            text-decoration: none !important;
            border: ${borderStyle};
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: ${fontSize};
            cursor: pointer;
        `;

        let iconHtml = '';
        if (iconKey) {
            const iconUrl = getIconUrl(iconKey, textColor);
            iconHtml = `<img src="${iconUrl}" style="width:1.2em; height:1.2em; vertical-align:middle; border:none;" alt="">`;
        }

        const textHtml = `<span>${text || "Botón"}</span>`;
        previewButton.innerHTML = (iconPos === 'left') ? (iconHtml + textHtml) : (textHtml + iconHtml);
    }

    function insertButton() {
        // 1. Encontrar el ID del editor activo
        const editorFrame = document.querySelector('iframe.tox-edit-area__iframe');
        if (!editorFrame || !editorFrame.id) {
            alert('No se pudo encontrar el editor de Canvas.');
            return;
        }
        const editorId = editorFrame.id.replace('_ifr', '');

        // 2. Obtener la instancia del editor desde la variable global `tinymce`
        const editor = tinymce.get(editorId);
        if (!editor) {
            alert('No se pudo obtener la instancia del editor de Canvas.');
            return;
        }

        // 3. Recolectar todos los valores
        const text = document.getElementById('btnText').value;
        const link = document.getElementById('btnLink').value;
        const bgColor = document.getElementById('bgColor').value;
        const textColor = document.getElementById('textColor').value;
        const padding = document.querySelector('#padding-options .selected').dataset.value;
        const borderRadius = document.querySelector('#radius-options .selected').dataset.value;
        const fontSize = document.querySelector('#font-size-options .selected').dataset.value;
        const borderWidth = document.querySelector('#border-width-options .selected').dataset.value;
        const borderColor = document.getElementById('borderColor').value;
        const iconKey = document.querySelector('#icon-selector .selected').dataset.value;
        const iconPos = document.querySelector('input[name="iconPos"]:checked').value;

        if (!text || !link) {
            alert('Por favor, ingresa el texto y la URL del botón.');
            return;
        }

        // 4. Construir el HTML limpio
        const styleProps = [
            `background-color: ${bgColor}`,
            `color: ${textColor}`,
            `padding: ${padding}`,
            `border-radius: ${borderRadius}`,
            `text-decoration: none !important`,
            `display: inline-flex`,
            `align-items: center`,
            `gap: 8px`,
            `cursor: pointer`,
            `font-size: ${fontSize}`
        ];

        if (parseInt(borderWidth) > 0) {
            styleProps.push(`border: ${borderWidth} solid ${borderColor}`);
        } else {
            styleProps.push(`border: none`);
        }

        const styles = styleProps.join('; ');

        let iconHtml = '';
        if (iconKey) {
            const iconUrl = getIconUrl(iconKey, textColor);
            iconHtml = `<img src="${iconUrl}" style="width:1.2em; height:1.2em; vertical-align:middle; border:none;" alt="${iconKey} icon">`;
        }

        const textHtml = `<span>${text}</span>`;
        const innerHtml = (iconPos === 'left') ? (iconHtml + textHtml) : (textHtml + iconHtml);
        const buttonHtml = `<a href="${link}" target="_blank" style="${styles}">${innerHtml}</a>`;

        // 5. Usar la API del editor para insertar el contenido
        editor.insertContent(buttonHtml + '&nbsp;');

        // 6. Cerrar la modal
        document.getElementById('customButtonModal').style.display = 'none';
    }

    initialize();

})();
