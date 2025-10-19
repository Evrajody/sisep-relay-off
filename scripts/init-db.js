#!/usr/bin/env node

/**
 * Script d'initialisation de la base de données Better Auth
 * Exécuter avec: node scripts/init-db.js
 */

import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Chemin vers la base de données
const dbPath = join(__dirname, '..', 'auth.db');

// Chemin vers le script SQL
const sqlPath = join(__dirname, 'init-db.sql');

console.log('🔧 Initialisation de la base de données Better Auth...');
console.log(`📂 Base de données: ${dbPath}`);

try {
    // Créer/Ouvrir la base de données
    const db = new Database(dbPath);

    // Lire le script SQL
    const sql = readFileSync(sqlPath, 'utf8');

    // Exécuter le script
    db.exec(sql);

    console.log('✅ Base de données initialisée avec succès!');
    console.log('📊 Tables créées:');
    console.log('   - user');
    console.log('   - session');
    console.log('   - account');
    console.log('   - verification');

    // Fermer la connexion
    db.close();

} catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error.message);
    process.exit(1);
}
