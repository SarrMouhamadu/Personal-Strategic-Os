const http = require('http');

function makeRequest(method, path, data, token) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function testAPI() {
    try {
        console.log('=== Testing Login ===');
        const login = await makeRequest('POST', '/api/auth/login', {
            email: 'test@example.com',
            password: 'password123'
        });

        if (login.status !== 200) {
            console.error('❌ Login failed:', login.status, login.data);
            return;
        }

        console.log('✓ Login successful');
        console.log('User ID:', login.data.user.id);
        console.log('User Email:', login.data.user.email);

        const token = login.data.token;

        console.log('\n=== Testing GET Projects ===');
        const projects = await makeRequest('GET', '/api/projects', null, token);
        console.log('Status:', projects.status);
        console.log(`Found ${projects.data.length} projects`);
        projects.data.forEach(p => console.log(`  - ${p.name} (userId: ${p.userId})`));

        console.log('\n=== Testing CREATE Project ===');
        const newProject = {
            name: 'Test CRUD Project',
            tagline: 'Testing CRUD',
            description: 'Test description',
            status: 'IDEATION',
            accessLevel: 'PRIVATE',
            techStack: ['Node.js']
        };

        const create = await makeRequest('POST', '/api/projects', newProject, token);
        console.log('Status:', create.status);
        if (create.status === 201) {
            console.log('✓ Project created');
            console.log('New project ID:', create.data.id);
            console.log('New project userId:', create.data.userId);
        } else {
            console.error('❌ Create failed:', create.data);
        }

        console.log('\n=== Testing GET Projects Again ===');
        const updated = await makeRequest('GET', '/api/projects', null, token);
        console.log(`Now have ${updated.data.length} projects`);

        console.log('\n✅ TESTS COMPLETE');

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
    }
}

testAPI();
