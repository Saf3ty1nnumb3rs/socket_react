document.getElementById('room-name').addEventListener('focus', () => {
    // var httpRequest = new XMLHttpRequest()
    httpRequest.onreadystatechange = (data) => {
        const list = "";
        console.log(data.target.response)
        const listData = data.target.response
        listData.forEach((room) => {
            list += "<option value ='" + room + "'>";
        })
        document.getElementById('room-list').innerHTML += list
  
}
httpRequest.open('GET', '/rooms')
httpRequest.send()
})