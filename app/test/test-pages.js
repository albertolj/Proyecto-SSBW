import { describe, it } from "mocha";
import { expect } from "chai";

const servidor = 'http://localhost:3000/'

describe('Test de app.js',() => {

    it('Servidor funcionando', (done) => {
        fetch(servidor)

            .then(res => {
                expect(res.status).to.equal(200)
                done()
            })

            .catch(err => {
                console.log(err)
                done(err)
            })
    });

    it('Saluda ?', (done) => {
        fetch(servidor)

            .then(res => {
                res.text()
                
            })
            .then( res => {
                console.log(res)
                done(res)
            })

            .catch(err => {
                console.log(err)
                done(err)
            })
    });

});