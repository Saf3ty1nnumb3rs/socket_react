document.getElementById("room-name").addEventListener("focus", () => {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/rooms");
  xhr.setRequestHeader("Content-Type", "text/xml");
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var data = xhr.responseText;
        console.log(data);
        var jsonResponse = JSON.parse(data);
        let list = document.getElementById("room-list");
        jsonResponse.forEach(room => {
          console.log(room);
          let option = document.createElement("option");
          option.value = room;
          list.appendChild(option);
        });
        console.log(list)
        // document.getElementById('room-list').appendChild(list)
      }
    }
  };
  xhr.send();
  
});
