#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Configurando entorno de desarrollo...\n');

// Verificar si .env.local existe
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Copiando configuración de ambiente...');
  fs.copyFileSync('.env.example', '.env.local');
  console.log('✅ Archivo .env.local creado\n');
}

// Instalar husky si no existe
const huskyPath = path.join(process.cwd(), '.husky');
if (!fs.existsSync(huskyPath)) {
  console.log('🎣 Configurando Git hooks...');
  try {
    execSync('npm run prepare', { stdio: 'inherit' });
    console.log('✅ Husky configurado\n');
  } catch (error) {
    console.log('⚠️  Error configurando Husky (opcional)\n');
  }
}

// Verificar dependencias
console.log('📦 Verificando dependencias...');
try {
  execSync('npm run type-check', { stdio: 'pipe' });
  console.log('✅ TypeScript configurado correctamente');
} catch (error) {
  console.log('⚠️  Errores de TypeScript detectados');
}

try {
  execSync('npm run lint', { stdio: 'pipe' });
  console.log('✅ ESLint configurado correctamente');
} catch (error) {
  console.log('⚠️  Warnings de ESLint detectados (no críticos)');
}

console.log('\n🎉 Entorno de desarrollo configurado!');
console.log('\n📋 Próximos pasos:');
console.log('   1. Ejecutar: npm run dev');
console.log('   2. Abrir: http://localhost:3000');
console.log('   3. Editar: .env.local con tus configuraciones\n');

console.log('📚 Comandos útiles:');
console.log('   npm run dev        - Servidor de desarrollo');
console.log('   npm run build      - Build de producción'); 
console.log('   npm run type-check - Verificar TypeScript');
console.log('   npm run lint       - Verificar código');
console.log('   npm run format     - Formatear código\n');