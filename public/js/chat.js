const socket = io();

const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');

const $sendLocation = document.querySelector('#send-location');

socket.on('message', (wellcome) => {
    console.log(wellcome);
});

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //disable sending message till its sent
    $messageFormButton.setAttribute('disabled', 'disabled');

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
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

    $sendLocation.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location shared!');

            $sendLocation.removeAttribute('disabled');
        })
    })
})