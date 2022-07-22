import { env } from '../../env/mod.ts';
import '../load.ts';

console.log(env.get('GREETING'));
