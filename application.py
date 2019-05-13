from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "dinis xyu"



import socketio

# standard Python
sio = socketio.Client()
sio.connect('wss://socket.donationalerts.ru:443')
@sio.on('connect')
def on_connect():
    sio.emit('add-user', {token: 'KflrIWcoLbdpkKQbvrWG', type: 'alert_widget'})
    print('I\'m connected!')


@sio.on('donation')
def on_message(data):
    print(data)