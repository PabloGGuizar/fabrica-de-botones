*Read this in [Español](README.md)*

# Custom Button Factory for Canvas LMS

This is a Tampermonkey userscript that enhances the Canvas LMS Rich Content Editor (RCE) by adding a powerful tool to create and customize Call-to-Action (CTA) buttons quickly and intuitively.

![App Icon](https://github.com/PabloGGuizar/fabrica-de-botones/blob/main/src/Icono-Fabrica-de-Botones.jpg)

![App Menu](https://github.com/PabloGGuizar/fabrica-de-botones/blob/main/src/Menu-Fabrica-de-Botones.jpg)

![Example Button](https://github.com/PabloGGuizar/fabrica-de-botones/blob/main/src/Boton.jpg)

## What problem does it solve?

The default Canvas editor doesn't offer an easy way to create stylized buttons. Educators and course designers often have to manually insert HTML code or rely on complex solutions to add attractive buttons that improve navigation and user experience. This script simplifies that process to just a few clicks.

## Main Features

* **Seamless Integration:** Adds a new icon directly to the Canvas editor toolbar for quick access.
* **Visual & Intuitive Interface:** All options are configured from a user-friendly popup with real-time preview.
* **Full Customization:**
    * **Text and Link:** Define the button text and destination URL.
    * **Colors:** Choose background, text, and border colors with color pickers.
    * **Size and Shape:** Adjust padding and border radius with visual options.
    * **Borders:** Define border thickness, from "none" to "very thick".
    * **Text Size:** Control the button's font size (small, normal, large).
* **Icon Library:**
    * Choose from a wide selection of professional icons from the Feather Icons library.
    * Select icon position (left or right of the text).
    * Icon color automatically adapts to text color for perfect contrast.
* **Smart Detection:** If you select an existing link in the editor before opening the tool, it will automatically fill in the text and URL, allowing you to convert any link into a button instantly.
* **Robust Insertion:** Uses the official Canvas editor API (TinyMCE) to insert the code, ensuring maximum compatibility and preventing Canvas from "breaking" the button style.

## Installation

To use this script, you need the Tampermonkey browser extension.

1.  **Install Tampermonkey:** If you don't have it yet, install the extension from your browser's official store:
    * [Tampermonkey for Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
    * [Tampermonkey for Firefox](https://addons.mozilla.org/es/firefox/addon/tampermonkey/)
    * [Tampermonkey for Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2.  **Create a New Script:**
    * Click the Tampermonkey icon in your browser and select "Dashboard".
    * Go to the tab with the `+` icon to create a new script.

3.  **Copy and Paste the Code:**
    * Delete any sample code that appears.
    * Copy the full content of the `fabrica-de-botones/script.user.js` file and paste it into the Tampermonkey editor.

4.  **Save the Script:**
    * Go to `File > Save` in the Tampermonkey editor or press `Ctrl + S`.

And that's it! The script will automatically activate the next time you load a Canvas page with the text editor.

## How to Use

1.  Go to any Canvas page, announcement, assignment, or forum where you can use the text editor.
2.  In the toolbar, look for the new icon of a square with a plus sign (`+`).
3.  Click the icon to open the "Custom Button Factory" window.
4.  **Customize your button:**
    * Modify text and URL.
    * Adjust colors, sizes, and borders.
    * Select an icon and its position if desired.
    * Watch the real-time preview to see how it looks.
5.  Click **"Insert Button"**. The button will be added at your cursor position.

**Tip:** To convert an existing link into a button, simply select the link text with your mouse *before* clicking the tool icon.

## Icon Customization

You can easily add more icons from the [Feather Icons](https://feathericons.com/) library.

1.  Find the icon you want on the Feather Icons website and copy its name (e.g., `award`).
2.  Open the script in the Tampermonkey dashboard.
3.  Find the `ICON_MAP` constant.
4.  Add a new line using the format `'Display Name': 'icon-name'`.

    ```javascript
    const ICON_MAP = {
        // ... (existing icons) ...
        'Award': 'award',
        'Camera': 'camera'
    };
    ```
5.  Save the script. The new icons will appear in the selector.

## License

This script is distributed under the [Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/) license.

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a>

**Attribution:** This script was generated in a collaborative environment with assistance from Gemini, a Google LLM.
