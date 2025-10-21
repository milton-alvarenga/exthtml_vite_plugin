import { exthtmlCompile } from 'exthtml/src/compiler/compiler_exthtml.js';
import { ast2strCss } from "exthtml/src/parse/css/parser_css.js"
import path from 'path';


export function extHTMLPlugin() {
    const cssMap = new Map();

    return {
        name: 'vite-plugin-exthtml',
        enforce: 'pre',
        transform(src, id) {
            if (id.endsWith('.exthtml')) {
                let currentFileName = path.basename(id, '.exthtml'); // store base name without extension
                //No cache
                currentFileName += `.${Date.now()}`
                //Call compiler
                const [_, __, styles, code] = exthtmlCompile(src, currentFileName)
 
                let styleContent = (styles && styles[0] && styles[0].value) && ast2strCss(styles[0].children) || '';
                cssMap.set(`virtual:${currentFileName}.css`, styleContent);

                return {
                    code,
                    map: null,
                }
            }
        },
        resolveId(id) {
            if (id.startsWith('virtual')) {
                return id // mark this id as virtual module
            }
        },
        load(id) {
            if (id.startsWith('virtual')) {
                return cssMap.get(id) || '';
            }
        },
        generateBundle(options, bundle) {
            /*
            if (this.styleContent && this.currentFileName) {
                // Emit CSS file with stored styleContent
                this.emitFile({
                    type: 'asset',
                    fileName: `${this.currentFileName}.css`, // fileName based on current file, with .css extension
                    source: this.styleContent,
                });
            }
            */
            for (const [virtualId, css] of cssMap.entries()) {
                const filename = virtualId.replace(/^virtual:/, '');
                this.emitFile({
                    type: 'asset',
                    fileName: filename,
                    source: css,
                });
            }
        },
        handleHotUpdate({ file, server, modules }) {
            if (file.endsWith('.exthtml')) {
                //Invalidate the module graph so Vite knows to reload
                const mod = server.moduleGraph.getModuleById(file);
                if (mod) {
                    server.moduleGraph.invalidateModule(mod);
                }
                server.ws.send({
                    type: 'full-reload',
                    path: '*',
                })
                //Return affected modules to do partial HMR
                return modules;
            }
        }
    }
}