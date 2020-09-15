const socket = io();

socket.on('message', (wellcome) => {
    console.log(wellcome);
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        if(error) {
            return console.log(error);
        }

        console.log('message deliverd!');
    });
});


document.querySelector('#send-location').addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('GEOLOCATION IS NOT SUPPORTED BY YOUR BROWSER!!');
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location shared!');
        })
    })
})