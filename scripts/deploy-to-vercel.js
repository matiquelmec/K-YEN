#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 KÜYEN - Deploy to Vercel Setup');
console.log('=====================================\n');

// Check if vercel CLI is installed
function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    console.log('✅ Vercel CLI encontrado');
    return true;
  } catch (error) {
    console.log('❌ Vercel CLI no encontrado');
    console.log('📦 Instalando Vercel CLI...');
    try {
      execSync('npm install -g vercel', { stdio: 'inherit' });
      console.log('✅ Vercel CLI instalado exitosamente');
      return true;
    } catch (installError) {
      console.log('❌ Error instalando Vercel CLI');
      console.log('💡 Por favor instala manualmente: npm install -g vercel');
      return false;
    }
  }
}

// Create vercel.json configuration
function createVercelConfig() {
  const vercelConfig = {
    "version": 2,
    "name": "kuyen-tienda-vestidos",
    "builds": [
      {
        "src": "package.json",
        "use": "@vercel/next"
      }
    ],
    "env": {
      "NEXT_PUBLIC_SUPABASE_URL": process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      "NEXT_PUBLIC_APP_NAME": "KÜYEN"
    },
    "build": {
      "env": {
        "NODE_ENV": "production"
      }
    },
    "functions": {
      "app/api/**/*.js": {
        "runtime": "@vercel/node"
      }
    },
    "routes": [
      {
        "src": "/",
        "dest": "/index.html"
      },
      {
        "src": "/catalogo",
        "dest": "/catalogo/index.html"
      },
      {
        "src": "/auth",
        "dest": "/auth/index.html"
      }
    ]
  };

  const configPath = path.join(process.cwd(), 'vercel.json');
  fs.writeFileSync(configPath, JSON.stringify(vercelConfig, null, 2));
  console.log('✅ vercel.json creado');
}

// Create environment variables setup
function createEnvSetup() {
  const envContent = `# KÜYEN - Vercel Environment Variables
# Copy these to your Vercel Dashboard -> Project Settings -> Environment Variables

NEXT_PUBLIC_SUPABASE_URL=${process.env.NEXT_PUBLIC_SUPABASE_URL || 'TU_URL_DE_SUPABASE'}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'TU_ANON_KEY'}
SUPABASE_SERVICE_ROLE_KEY=${process.env.SUPABASE_SERVICE_ROLE_KEY || 'TU_SERVICE_ROLE_KEY'}
DATABASE_URL=${process.env.DATABASE_URL || 'TU_DATABASE_URL'}

# App Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=KÜYEN

# Social Media (opcional)
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/kuyen_oficial
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/kuyen.oficial
NEXT_PUBLIC_WHATSAPP_NUMBER=+56912345678
`;

  fs.writeFileSync('.env.production', envContent);
  console.log('✅ .env.production creado');
}

// Test database connection
async function testConnection() {
  console.log('🔍 Verificando conexión a base de datos...');
  try {
    const testScript = path.join(__dirname, 'check-and-populate.js');
    execSync(`node "${testScript}"`, { stdio: 'inherit' });
    console.log('✅ Base de datos conectada y funcionando');
  } catch (error) {
    console.log('⚠️  Advertencia: No se pudo verificar la base de datos');
    console.log('💡 Asegúrate de que Supabase esté funcionando');
  }
}

// Main deployment process
async function deployToVercel() {
  console.log('📋 Pasos para Deploy en Vercel:');
  console.log('================================\n');

  console.log('1. 🔧 Preparando archivos de configuración...');
  createVercelConfig();
  createEnvSetup();

  console.log('\n2. 🔍 Verificando dependencias...');
  if (!checkVercelCLI()) {
    return;
  }

  console.log('\n3. 🗄️ Verificando base de datos...');
  await testConnection();

  console.log('\n4. 🚀 Comandos para ejecutar:');
  console.log('================================');
  console.log('# Login en Vercel (si no lo has hecho)');
  console.log('vercel login');
  console.log('');
  console.log('# Deploy del proyecto');
  console.log('vercel');
  console.log('');
  console.log('# Deploy de producción');
  console.log('vercel --prod');
  console.log('');

  console.log('5. 🔐 Configurar Variables de Entorno:');
  console.log('=====================================');
  console.log('Ve a https://vercel.com/dashboard');
  console.log('-> Tu proyecto -> Settings -> Environment Variables');
  console.log('-> Copia las variables de .env.production');
  console.log('');

  console.log('6. 🌐 URLs importantes:');
  console.log('======================');
  console.log('• Dashboard: https://vercel.com/dashboard');
  console.log('• Supabase: https://supabase.com/dashboard');
  console.log('• Tu app: https://[tu-proyecto].vercel.app');
  console.log('');

  console.log('✅ Configuración completada!');
  console.log('💡 Sigue los comandos arriba para hacer el deploy');
}

// Run the script
if (require.main === module) {
  deployToVercel().catch(console.error);
}

module.exports = { deployToVercel };