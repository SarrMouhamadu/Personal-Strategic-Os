const db = require('./models');
const User = db.users;
const bcrypt = require('bcryptjs');

async function reset() {
    try {
        const hashedPassword = await bcrypt.hash('Admin123!', 10);
        const result = await User.update(
            { password: hashedPassword },
            { where: { email: 'mouhamadou.sarr4@unchk.edu.sn' } }
        );
        if (result[0] > 0) {
            console.log('SUCCESS: Password reset for mouhamadou.sarr4@unchk.edu.sn to Admin123!');
        } else {
            console.log('ERROR: User not found.');
        }
        process.exit(0);
    } catch (error) {
        console.error('ERROR:', error);
        process.exit(1);
    }
}

reset();
