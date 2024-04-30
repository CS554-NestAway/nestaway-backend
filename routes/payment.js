import express from "express";
const router = express.Router();
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': '663007be25c8cb001c8e2958',
            'PLAID-SECRET': 'a71af2498cc789835ffb5f426001ac',
        },
    },
});
const plaidClient = new PlaidApi(configuration);

router
    .route('/create_link_token')
    .post(async (req, res) => {
        // Get the client_user_id by searching for the current user
        const request = {
            user: {
                // This should correspond to a unique id for the current user.
                client_user_id: 'user',
            },
            client_name: 'Plaid Test App',
            products: ['auth'],
            language: 'en',
            redirect_uri: 'http://localhost:5173/',
            country_codes: ['US'],
        };
        try {
            const createTokenResponse = await plaidClient.linkTokenCreate(request);
            res.json(createTokenResponse.data);
        } catch (e) {
            // handle error
            return res.status(500).json({ error: 'create link token failure' });
        }
    });

router
    .route('/exchange_public_token')
    .post(async (req, res, next) => {
        try {
            const publicToken = req.body.public_token;
            const response = await plaidClient.itemPublicTokenExchange({
                public_token: publicToken,
            });

            // These values should be saved to a persistent database and
            // associated with the currently signed-in user
            const accessToken = response.data.access_token;

            res.json({ accessToken });
        } catch (e) {
            return res.status(500).json({ error: 'exchange public token failure' });
        }
    });

router
    .route('/auth')
    .post(async (req, res) => {
        try {
            const access_token = req.body.access_token;
            const request = {
                access_token: access_token,
            };
            const response = await plaidClient.authGet(request);
            res.json(response.data);
        } catch (e) {
            return res.status(500).json({error: "auth failure"})
        }
    });
export default router;
