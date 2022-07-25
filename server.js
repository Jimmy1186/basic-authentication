const express = require('express')
const app = express()
const port = 3000
const path=require('path')
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use((req,res,next)=>{


    const auth ={login:"zz",password:'123'}

    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

    if(login && password && login===auth.login && password ==auth.password){
       console.log('access success')
        return next()
    }

  

  res.set('WWW-Authenticate', 'Basic realm="401"') // change this
  res.status(401).send('Authentication required.') // custom message

})

app.get('/secret',(req,res)=>{

    res.sendFile(path.join(__dirname,"/secret.html"))
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
