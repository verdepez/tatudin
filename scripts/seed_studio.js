import { seedStudioData } from '../src/seed_studio.js';

export { seedStudioData };

if (process.argv[1] && process.argv[1].endsWith('seed_studio.js')) {
  seedStudioData()
    .then(() => {
      console.log('✅ Seeding finalizado con éxito.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Error ejecutando seed:', err);
      process.exit(1);
    });
}
