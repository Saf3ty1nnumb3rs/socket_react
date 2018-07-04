document.getElementById('room-name').addEventListener('focus', () => {
    var httpRequest = new XMLHttpRequest()
    httpRequest.open('GET', '/rooms')
    
    httpRequest.onreadystatechange =() => {
       console.log(httpRequest)
}
    httpRequest.send()
})