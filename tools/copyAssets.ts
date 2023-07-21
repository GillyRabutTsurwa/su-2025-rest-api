import * as shell from "shelljs";
// NOTE: copier les template ejs vers le dossier que genere TypeScript
shell.cp("-r", "src/views", "dist/");
// je fais le meme chose pour les fichier d'images, css et le client side JavaScript
shell.cp("-r", "src/public", "dist/");
