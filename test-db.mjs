import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://wxjxqmsxhfwdwpueejpo.supabase.co',
    'sb_publishable_wIm2CbfefWRzD0bc2x8tpQ_MMkSIR6j'
);

async function test() {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'azmat.siddqiue.98@gmail.com',
        password: 'Azmat@123'
    });

    if (authError) {
        console.error('Login Failed:', authError.message);
        return;
    }

    console.log('Logged in as:', authData.user.id);

    const { data, error } = await supabase.from('schedules').select('*');
    if (error) {
        console.error('Select Failed:', error.message);
    } else {
        console.log('Total schedules:', data.length);
        if (data.length > 0) {
            console.log('Sample date:', data[0].date);
            console.log('Sample task:', data[0].task);
        }
    }
}

test();
