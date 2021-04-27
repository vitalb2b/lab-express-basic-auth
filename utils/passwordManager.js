const bcrypt = require('bcrypt');

//vezes que hash é utilizado para encriptar
const saltRounds = 10;

const encryptPass = async password => {
    const salt = await bcrypt.genSalt(saltRounds);

    const encryptPass = bcrypt.hashSync(password, salt);
    return encryptPass;
};

const checkPass = (password, encryptPass) =>{

    console.log(bcrypt.compareSync(password, encryptPass))
    return bcrypt.compareSync(password, encryptPass);

}


//IMPORTAR OBJETO
module.exports = {
    encryptPass,
    checkPass,
};