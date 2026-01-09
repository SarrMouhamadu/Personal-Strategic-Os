const db = require('./models');
const User = db.users;

async function promote() {
    try {
        const result = await User.update(
            { role: 'ADMIN' },
            { where: { email: 'mouhamadou.sarr4@unchk.edu.sn' } }
        );
        if (result[0] > 0) {
            console.log('SUCCESS: User muhamadusarr9@gmail.com promoted to ADMIN.');
        } else {
            console.log('NOTICE: User not found or already ADMIN.');
        }
        process.exit(0);
    } catch (error) {
        console.error('ERROR: Promotion failed:', error);
        process.exit(1);
    }
}

promote();
