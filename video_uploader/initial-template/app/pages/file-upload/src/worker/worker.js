onmessage = ({ data }) => {
    console.log('recebido')
    self.postMessage({
        status: 'done'
    })
}
