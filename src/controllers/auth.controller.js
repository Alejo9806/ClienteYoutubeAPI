//environment variables
require('dotenv').config({ path: '.env' });
'use strict';

//requires 
const { ipcMain } = require('electron');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT} = process.env;
const ElectronGoogleOAuth2 = require('@getstation/electron-google-oauth2').default;
let account = new ElectronGoogleOAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, [GOOGLE_REDIRECT]);
const User = require('../model/user');
const Axios = require('axios');

//Google search and make request to get user data
ipcMain.on('login', (e) => {
    account.openAuthWindowAndGetTokens()
        .then(token => {
            if (token) {
                let userToken = token;
                Axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + userToken.access_token)
                    .then( async (res) => {
                        let user = new User();    
                        let userInfo = res.data;
                        const succes = "Te has logeado correctamente amor <3";
                        console.log(userInfo);
                        const users = await User.findOne({ email: userInfo.email });
                        if(users){
                            console.log('usuario ya Guardado');
                            console.log(users);
                        } else{
                            user.email = userInfo.email;
                            user.name = userInfo.name;
                            user.verified_email = userInfo.verified_email;
                            user = await user.save();
                        }
                        e.reply('logged', userInfo, succes,userToken);
                        return {userInfo,userToken}
                    })
            } else {
                const succes = "Hay un error no te pudiste logear"
                console.log(succes);
                e.reply('isNotLogged', succes);
            }
        });
});
