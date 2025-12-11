const express = require('express');
const SupabaseClient = require('@supabase/supabase-js');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { configDotenv } = require('dotenv');

configDotenv('.env');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const supabaseUrl = 'https://kpyutxcwpbccyhggsfdq.supabase.co';

const supabase = SupabaseClient.createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_KEY 
);


// UPLOAD FILE ENDPOINT
app.post('/uploadFile', async (req, res) => {
    try {
        const { filename, fileBase64 } = req.body;

        if ( !filename || !fileBase64)
            return res.status(400).send({ error: 'Missing fields' });

        const buffer = Buffer.from(fileBase64, 'base64');

        const { data, error } = await supabase.storage
            .from('case_files')
            .upload(`${filename}`, buffer, {
                contentType: 'application/octet-stream',
                upsert: true
            });

        if (error) return res.status(500).send({ error });

        const publicURL = supabase.storage
            .from('case_files')
            .getPublicUrl(`${filename}`).data.publicUrl;

        await supabase.from('Files').insert({
            filename,
            url: publicURL
        });

        res.send({ success: true, url: publicURL });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});


// SAVE CASE ENDPOINT
app.post('/saveCase', async (req, res) => {
    try {
        const {  user_notes, category, pdf_url } = req.body;

        if (!timestamp || !category)
            return res.status(400).send({ error: 'Missing fields' });

        const { data, error } = await supabase
            .from('Cases')
            .insert({
                user_notes,
                category,
                pdf_url
            })
            .select()
            .single();

        if (error) return res.status(500).send({ error });

        res.send({ success: true, case: data });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});


// GET CASE BY ID (WITH FILES)


app.get('/getCases/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const { data: caseData, error: caseErr } = await supabase
            .from('Cases')
            .select('*')
            .eq('id', id)
            .single();

        if (caseErr) return res.status(404).send({ error: 'Case not found' });

        const { data: files, error: fileErr } = await supabase
            .from('Files')
            .select('*')
            .eq('id', id);

        if (fileErr) return res.status(500).send({ error: fileErr });

        res.send({
            ...caseData,
            files: files || []
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});


app.listen(3000, () => console.log('Server running on port 3000'));
