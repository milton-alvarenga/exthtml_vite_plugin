import { exthtmlCompile } from 'exthtml/src/compiler/compiler_exthtml.js';
import path from 'path';


function extHTMLPlugin() {
    return {
        name: 'vite-plugin-exthtml',
        enforce: 'pre',
        transform(src, id) {
            if (id.endsWith('.exthtml')) {
                this.currentFileName = path.basename(id, '.exthtml'); // store base name without extension
                //Call compiler
                const [_, __, style, code] = exthtmlCompile(src, this.currentFileName)
                this.styleContent = style?.value || ''
                return {
                    code,
                    map: null,
                }
            }
        },
        generateBundle(options, bundle) {
            if (this.styleContent && this.currentFileName) {
                // Emit CSS file with stored styleContent
                this.emitFile({
                    type: 'asset',
                    fileName: `${this.currentFileName}.css`, // fileName based on current file, with .css extension
                    source: this.styleContent,
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

export default {
    plugins: [extHTMLPlugin()]
}