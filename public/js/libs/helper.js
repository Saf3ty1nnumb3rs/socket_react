

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

module.exports = { scrollToBottom }