const socket = io();

const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');

const $sendLocation = document.querySelector('#send-location');

const $messages = document.querySelector('#messages');

const messageTemplate =document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (url) => {
    console.log(url);
    const html = Mustache.render(locationTemplate, {
        url
    });
    $messages.insertAdjacentHTML('beforeend', html);
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