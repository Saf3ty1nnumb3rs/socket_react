

const scrollToBottom = () => {
    //Selectors
    let newMessageHeight = 0;
    let messages = document.getElementById('messages')
    let newMessage = messages.lastElementChild;
    //Heights
    let { clientHeight } = messages
    let { scrollTop } = messages
    let { scrollHeight } = messages
    let previousMessageHeight = newMessageHeight
    newMessageHeight = parseInt(
        window.getComputedStyle(newMessage).getPropertyValue("height")
    );
    //Height is stored as a property in the style object
    if(clientHeight + scrollTop + newMessageHeight + previousMessageHeight >= scrollHeight ) {
        console.log('Should scroll')
        messages.scrollTo(0, scrollHeight);
    }
}


getQuery = (query) => {
    if(query === undefined){
        query = window.location.search
    }
    console.log(window.location.search)
    var queryString = {};
    query.replace(new RegExp(
        "([^?=&]+)(=([^&#]*))?", "g"), 
        ($0, $1, $2, $3) => {
      queryString[$1] = $3;
    });
    console.log(queryString)
    return queryString;
  }

// getQuery = (variable) => {
//        var query = window.location.search.substring(1);
//        var vars = query.split("&");
//        for (var i=0;i<vars.length;i++) {
//                var pair = vars[i].split("=");
//                if(pair[0] == variable){return pair[1];}
//        }
//        return(false);
// }

