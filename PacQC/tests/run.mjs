import { runTests } from './game.test.js';
import { runSessionTests } from './session.test.js';
import { runBonusTests } from './bonuses.test.js';
import { runFramingTests } from './framing.test.js';
import { runMapTests } from './maps.test.js';
const results = [...runTests(), ...runSessionTests(), ...runBonusTests(), ...runFramingTests(), ...runMapTests()];
for (const result of results.filter(item => !item.passed)) console.error(result.name + ': ' + result.error);
console.log(`${results.filter(item => item.passed).length}/${results.length} tests réussis`);
if (results.some(item => !item.passed)) process.exitCode = 1;
