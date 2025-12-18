require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkUser() {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) {
        console.error('Error fetching users:', error);
    } else {
        console.log('Users found:', users.map(u => ({ email: u.email, id: u.id, confirmed: !!u.email_confirmed_at })));
        const newUser = users.find(u => u.email === 'newuser@example.com');
        if (newUser) {
            console.log('SUCCESS: newuser@example.com exists!');
        } else {
            console.log('FAILURE: newuser@example.com NOT found.');
        }
    }
}

checkUser();
