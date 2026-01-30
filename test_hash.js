const bcrypt = require('bcryptjs');

async function testPasswordHash() {
    const password = 'Luna@2026!Admin';
    const hash = '$2b$10$u.LViwn/8UV4NKxKOIoyqO5iM8RvRM..LywsNqLa/FBINXf7ZNPHm';

    console.log('🔐 Testando hash de senha...\n');
    console.log('Senha:', password);
    console.log('Hash do DB:', hash);

    const isValid = await bcrypt.compare(password, hash);
    console.log('\n✅ Senha válida?', isValid);

    // Test with trimmed version
    const trimmedPassword = password.trim();
    const isValidTrimmed = await bcrypt.compare(trimmedPassword, hash);
    console.log('✅ Senha trimmed válida?', isValidTrimmed);
}

testPasswordHash();
