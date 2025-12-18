require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function confirmUser(email) {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) return console.error('Error listing users:', error);

    const user = users.find(u => u.email === email);
    if (!user) return console.error('User not found:', email);

    console.log('Verifying user:', user.id);
    const { data, error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { email_confirm: true }
    );

    if (updateError) console.error('Error confirming user:', updateError);
    else console.log('User confirmed successfully:', data.user.email);
}

confirmUser('bawejavichal@gmail.com');
